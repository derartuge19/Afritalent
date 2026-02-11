import React, { useState, useEffect, useRef } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { getInterviews, Interview } from '../../lib/api';
import { formatShortMonth, formatDay, formatTime } from '../../lib/utils';
import { updateInterview, deleteInterview, updateApplicationStatus } from '../../lib/api';
import { Button } from '../../components/common/Button';
import { Input } from '../../components/common/Input';
import { X, Edit2, Trash2, Calendar, Clock, MapPin, CheckCircle, XCircle, UserCheck, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function InterviewsPage() {
    const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
    const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
    const [activeDropdown, setActiveDropdown] = useState<number | null>(null); // For fancy dropdown
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingInterview, setEditingInterview] = useState<Interview | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editForm, setEditForm] = useState({
        title: '',
        description: '',
        date: '',
        startTime: '',
        endTime: '',
        location: ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const fetchInterviews = async () => {
        try {
            const data = await getInterviews();
            setInterviews(data);
        } catch (err) {
            console.error('Failed to fetch interviews:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInterviews();

        // Close dropdown when clicking outside
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleEditClick = (interview: Interview) => {
        const startDate = new Date(interview.start_time);
        setEditingInterview(interview);
        setEditForm({
            title: interview.title,
            description: interview.description || '',
            date: startDate.toISOString().split('T')[0],
            startTime: formatTime(interview.start_time),
            endTime: formatTime(interview.end_time),
            location: interview.location || ''
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateInterview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingInterview) return;

        setIsSaving(true);
        try {
            const start_time = `${editForm.date}T${editForm.startTime}:00`;
            const end_time = `${editForm.date}T${editForm.endTime}:00`;

            await updateInterview(editingInterview.id, {
                title: editForm.title,
                description: editForm.description,
                start_time,
                end_time,
                location: editForm.location
            });
            setIsEditModalOpen(false);
            fetchInterviews();
        } catch (err) {
            console.error('Failed to update interview:', err);
        } finally {
            setIsSaving(false);
        }
    };

    const handleApplicationStatusUpdate = async (applicationId: number, newStatus: string, interviewId: number) => {
        try {
            setActiveDropdown(null); // Close dropdown immediately

            // If status is 'interviewed', we also mark interview as completed
            if (newStatus === 'interviewed' || newStatus === 'hired' || newStatus === 'rejected') {
                await updateInterview(interviewId, { status: 'completed' });
            }

            await updateApplicationStatus(applicationId, newStatus);
            fetchInterviews();
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const handleDeleteClick = async (id: number) => {
        if (!window.confirm('Are you sure you want to cancel this interview?')) return;

        try {
            await deleteInterview(id);
            fetchInterviews();
        } catch (err) {
            console.error('Failed to delete interview:', err);
        }
    };

    // Filter interviews
    const upcomingInterviews = interviews.filter(i =>
        ['pending', 'accepted', 'scheduled', 'reschedule_requested'].includes(i.status)
    );
    const pastInterviews = interviews.filter(i =>
        ['completed', 'cancelled', 'declined', 'rescheduled'].includes(i.status)
    );

    const displayedInterviews = activeTab === 'upcoming' ? upcomingInterviews : pastInterviews;



    return (
        <DashboardLayout role="employer">
            <div className="space-y-8 animate-slide-in pb-20">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600">Interview Schedule</h1>
                        <p className="text-slate-500 font-medium mt-1">Manage and track your candidate pipeline</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex p-1 bg-slate-100/80 backdrop-blur-sm rounded-2xl w-fit">
                    <button
                        onClick={() => setActiveTab('upcoming')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === 'upcoming'
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        Upcoming ({upcomingInterviews.length})
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === 'history'
                            ? 'bg-white text-primary-600 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700'
                            }`}
                    >
                        History ({pastInterviews.length})
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-600" />
                    </div>
                ) : displayedInterviews.length === 0 ? (
                    <div className="py-24 text-center bg-white/50 backdrop-blur-md rounded-3xl border border-slate-200/60 border-dashed">
                        <div className="bg-slate-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Calendar className="h-10 w-10 text-slate-300" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">
                            {activeTab === 'upcoming' ? 'No upcoming interviews' : 'No interview history'}
                        </h3>
                        <p className="text-slate-500 max-w-sm mx-auto">
                            {activeTab === 'upcoming'
                                ? 'Interviews you schedule with candidates will appear here.'
                                : 'Past and completed interviews will be archived here.'}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6">
                        <AnimatePresence mode="popLayout">
                            {displayedInterviews.map((interview) => (
                                <motion.div
                                    layout
                                    key={interview.id}
                                    initial={{ opacity: 0, scale: 0.98 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.98 }}
                                    transition={{ duration: 0.2 }}
                                    className={`bg-white rounded-3xl border p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm hover:shadow-xl transition-all duration-300 group
                                        ${interview.status === 'cancelled' ? 'border-rose-100 bg-rose-50/30' : 'border-slate-200'}`}
                                >
                                    <div className="flex items-start gap-6 flex-1">
                                        {/* Date Badge */}
                                        <div className={`w-20 h-20 rounded-2xl flex flex-col items-center justify-center shrink-0 shadow-sm border
                                            ${interview.status === 'completed' ? 'bg-slate-100 border-slate-200 text-slate-400' :
                                                interview.status === 'cancelled' ? 'bg-rose-50 border-rose-100 text-rose-400' :
                                                    'bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-200/20 text-primary-700'}`}>
                                            <span className="text-xs font-black uppercase tracking-widest opacity-60 mb-1">{formatShortMonth(interview.start_time)}</span>
                                            <span className="text-3xl font-black leading-none tracking-tighter">{formatDay(interview.start_time)}</span>
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-wrap items-center gap-3 mb-3">
                                                <h3 className="font-extrabold text-slate-900 text-xl tracking-tight leading-tight truncate">{interview.title}</h3>
                                                <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border shadow-sm ${interview.status === 'reschedule_requested' ? 'bg-orange-100 text-orange-700 border-orange-200' :
                                                    interview.status === 'accepted' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                                                        interview.status === 'completed' ? 'bg-slate-100 text-slate-500 border-slate-200' :
                                                            interview.status === 'cancelled' ? 'bg-rose-100 text-rose-500 border-rose-200' :
                                                                'bg-indigo-50 text-indigo-600 border-indigo-100'
                                                    }`}>
                                                    {interview.status.replace('_', ' ')}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 mb-4">
                                                <div className="flex items-center text-sm font-bold text-slate-600">
                                                    <Clock className="h-4 w-4 text-slate-400 mr-2" />
                                                    {formatTime(interview.start_time)} - {formatTime(interview.end_time)}
                                                </div>
                                                <div className="flex items-center text-sm font-bold text-slate-600">
                                                    <MapPin className="h-4 w-4 text-slate-400 mr-2" />
                                                    {interview.location || 'Online / Link to follow'}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Candidate:</span>
                                                <span className="text-sm font-bold text-slate-900">
                                                    {interview.application?.seeker?.first_name} {interview.application?.seeker?.last_name}
                                                </span>
                                            </div>

                                            {/* Activity Log Toggle */}
                                            {interview.history && interview.history.length > 0 && (
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => setExpandedHistory(expandedHistory === interview.id ? null : interview.id)}
                                                        className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-primary-600 transition-colors uppercase tracking-widest"
                                                    >
                                                        <div className={`w-1.5 h-1.5 rounded-full ${expandedHistory === interview.id ? 'bg-primary-600' : 'bg-slate-300'}`} />
                                                        Activity Log ({interview.history.length})
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action Section */}
                                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between gap-4 border-t md:border-t-0 border-slate-100 pt-5 md:pt-0 mt-2 md:mt-0 w-full md:w-auto">

                                        {/* Status Dropdown - Only show for upcoming */}
                                        {activeTab === 'upcoming' && (
                                            <div className="relative">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setActiveDropdown(activeDropdown === interview.id ? null : interview.id);
                                                    }}
                                                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 transition-all font-bold text-sm shadow-lg shadow-slate-200"
                                                >
                                                    <span>Update Status</span>
                                                    <ChevronDown className={`h-4 w-4 transition-transform ${activeDropdown === interview.id ? 'rotate-180' : ''}`} />
                                                </button>

                                                <AnimatePresence>
                                                    {activeDropdown === interview.id && (
                                                        <motion.div
                                                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            animate={{ opacity: 1, y: 0, scale: 1 }}
                                                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                                            className="absolute right-0 bottom-full mb-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-20"
                                                        >
                                                            <div className="p-1.5 space-y-1">
                                                                <button
                                                                    onClick={() => handleApplicationStatusUpdate(interview.application_id, 'interviewed', interview.id)}
                                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition-colors text-sm font-bold text-left group/item"
                                                                >
                                                                    <div className="p-1.5 rounded-lg bg-blue-100 text-blue-600 group-hover/item:bg-blue-200 transition-colors">
                                                                        <CheckCircle className="h-4 w-4" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="leading-none mb-0.5">Interviewed</div>
                                                                        <div className="text-[10px] text-slate-400 font-normal">Task Complete</div>
                                                                    </div>
                                                                </button>

                                                                <button
                                                                    onClick={() => handleApplicationStatusUpdate(interview.application_id, 'hired', interview.id)}
                                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition-colors text-sm font-bold text-left group/item"
                                                                >
                                                                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-600 group-hover/item:bg-emerald-200 transition-colors">
                                                                        <UserCheck className="h-4 w-4" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="leading-none mb-0.5">Hire Candidate</div>
                                                                        <div className="text-[10px] text-slate-400 font-normal">Close Application</div>
                                                                    </div>
                                                                </button>

                                                                <button
                                                                    onClick={() => handleApplicationStatusUpdate(interview.application_id, 'rejected', interview.id)}
                                                                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-rose-50 text-slate-700 hover:text-rose-700 transition-colors text-sm font-bold text-left group/item"
                                                                >
                                                                    <div className="p-1.5 rounded-lg bg-rose-100 text-rose-600 group-hover/item:bg-rose-200 transition-colors">
                                                                        <XCircle className="h-4 w-4" />
                                                                    </div>
                                                                    <div>
                                                                        <div className="leading-none mb-0.5">Reject</div>
                                                                        <div className="text-[10px] text-slate-400 font-normal">Close Application</div>
                                                                    </div>
                                                                </button>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditClick(interview)}
                                                className="p-2.5 bg-slate-50 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-primary-600 transition-all border border-transparent hover:border-slate-100"
                                                title="Edit Details"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteClick(interview.id)}
                                                className="p-2.5 bg-slate-50 hover:bg-white hover:shadow-md rounded-xl text-slate-400 hover:text-rose-600 transition-all border border-transparent hover:border-slate-100"
                                                title="Cancel Interview"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Activity Log Expanded (Mobile/Desktop) */}
                                    <AnimatePresence>
                                        {expandedHistory === interview.id && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="basis-full w-full overflow-hidden border-t border-slate-100 mt-6 pt-6 md:mt-0 md:pt-0 md:border-0 md:basis-auto"
                                            >
                                                <div className="space-y-4 md:pl-6 md:border-l border-slate-100">
                                                    <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Activity History</h4>
                                                    {interview.history.map((item, idx) => (
                                                        <div key={idx} className="relative pl-6 pb-4 border-l border-slate-200 last:pb-0">
                                                            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-white border-2 border-slate-300" />
                                                            <div className="flex flex-col">
                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-0.5">
                                                                    {new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                                                </span>
                                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">{item.status_at_time.replace('_', ' ')}</span>
                                                                <p className="text-sm text-slate-600 italic">"{item.message}"</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsEditModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Edit Interview</h3>
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <X className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>

                            <form onSubmit={handleUpdateInterview} className="p-6 space-y-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1 font-bold">Interview Title</label>
                                        <Input
                                            required
                                            placeholder="e.g. Technical Round 1"
                                            value={editForm.title}
                                            onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                                            className="rounded-xl"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-700 mb-1 font-bold">Date</label>
                                            <Input
                                                required
                                                type="date"
                                                value={editForm.date}
                                                onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
                                                className="rounded-xl"
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-2">
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1 text-xs font-bold">Start</label>
                                                <Input
                                                    required
                                                    type="time"
                                                    value={editForm.startTime}
                                                    onChange={(e) => setEditForm({ ...editForm, startTime: e.target.value })}
                                                    className="rounded-xl"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-slate-700 mb-1 text-xs font-bold">End</label>
                                                <Input
                                                    required
                                                    type="time"
                                                    value={editForm.endTime}
                                                    onChange={(e) => setEditForm({ ...editForm, endTime: e.target.value })}
                                                    className="rounded-xl"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1 font-bold">Location / Meeting Link</label>
                                        <Input
                                            placeholder="e.g. Google Meet Link or Office Address"
                                            value={editForm.location}
                                            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
                                            className="rounded-xl"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-1 font-bold">Description (Optional)</label>
                                        <textarea
                                            className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[100px] text-sm font-medium"
                                            placeholder="Add any instructions for the candidate..."
                                            value={editForm.description}
                                            onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-6">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        className="flex-1 rounded-xl h-12 font-bold"
                                        onClick={() => setIsEditModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="flex-1 rounded-xl h-12 font-bold shadow-lg shadow-primary-500/20"
                                        isLoading={isSaving}
                                    >
                                        Update
                                    </Button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
