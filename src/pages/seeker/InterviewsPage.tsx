import { useState, useEffect } from 'react';
import { DashboardLayout } from '../../components/layout/DashboardLayout';
import { getInterviews, respondToInterview, Interview } from '../../lib/api';
import { Button } from '../../components/common/Button';
import { Calendar, Clock, MapPin, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { formatShortMonth, formatDay, formatTime } from '../../lib/utils';

export function InterviewsPage() {
    const [expandedHistory, setExpandedHistory] = useState<number | null>(null);
    const [interviews, setInterviews] = useState<Interview[]>([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState<number | null>(null);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [rescheduleNotes, setRescheduleNotes] = useState('');
    const [rescheduleId, setRescheduleId] = useState<number | null>(null);
    const navigate = useNavigate();

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
    }, []);

    const handleResponse = async (id: number, status: 'accepted' | 'declined' | 'reschedule_requested', notes?: string) => {
        setProcessingId(id);
        try {
            await respondToInterview(id, status, notes);
            fetchInterviews();
            if (status === 'reschedule_requested') {
                setIsRescheduleModalOpen(false);
                setRescheduleNotes('');
                setRescheduleId(null);
            }
        } catch (err) {
            console.error('Failed to respond to interview:', err);
        } finally {
            setProcessingId(null);
        }
    };

    const openRescheduleModal = (id: number) => {
        setRescheduleId(id);
        setIsRescheduleModalOpen(true);
    };

    const statusColors: any = {
        pending: 'bg-amber-100 text-amber-700 border-amber-200',
        accepted: 'bg-emerald-100 text-emerald-700 border-emerald-200',
        declined: 'bg-rose-100 text-rose-700 border-rose-200',
        reschedule_requested: 'bg-orange-100 text-orange-700 border-orange-200',
        scheduled: 'bg-blue-100 text-blue-700 border-blue-200',
        rescheduled: 'bg-blue-100 text-blue-700 border-blue-200',
        completed: 'bg-purple-100 text-purple-700 border-purple-200',
        cancelled: 'bg-slate-100 text-slate-700 border-slate-200',
    };

    return (
        <DashboardLayout role="seeker">
            <div className="space-y-6">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigate('/user/dashboard')}
                    leftIcon={<ArrowLeft className="h-4 w-4" />}
                    className="text-slate-500 hover:text-slate-900"
                >
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-2xl font-bold text-slate-900">Interview Invitations</h1>
                    <p className="text-slate-500">View and manage your interview invites</p>
                </div>

                {loading ? (
                    <div className="text-center py-20 text-slate-500 font-medium">Loading interviews...</div>
                ) : interviews.length === 0 ? (
                    <div className="py-20 text-center bg-white rounded-xl border border-slate-200 shadow-sm">
                        <Calendar className="h-16 w-16 text-slate-200 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-slate-900">No interview invites yet</h3>
                        <p className="text-slate-500 max-w-sm mx-auto mt-1">When employers invite you for an interview, they will appear here for you to accept or decline.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {interviews.map((interview, index) => (
                            <motion.div
                                key={interview.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
                            >
                                {/* Status Stripe */}
                                <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${interview.status === 'pending' ? 'bg-amber-400' :
                                    interview.status === 'accepted' || interview.status === 'scheduled' || interview.status === 'rescheduled' ? 'bg-emerald-400' :
                                        interview.status === 'reschedule_requested' ? 'bg-orange-400' :
                                            interview.status === 'completed' ? 'bg-purple-400' :
                                                'bg-rose-400'
                                    }`} />

                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                    <div className="flex items-start gap-5">
                                        <div className="hidden sm:flex flex-col items-center justify-center w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 text-slate-600 shrink-0">
                                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">{formatShortMonth(interview.start_time)}</span>
                                            <span className="text-2xl font-black leading-none text-slate-700">{formatDay(interview.start_time)}</span>
                                        </div>

                                        <div>
                                            <div className="flex items-center gap-3 mb-1.5">
                                                <h3 className="text-lg font-bold text-slate-900">{interview.title}</h3>
                                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusColors[interview.status.toLowerCase()] || 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                                                    {interview.status.replace('_', ' ')}
                                                </span>
                                                {interview.status === 'rescheduled' && (
                                                    <span className="bg-primary-50 text-primary-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-primary-100 italic animate-pulse">
                                                        NEW TIME PROPOSED
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex flex-wrap gap-x-5 gap-y-1.5 mb-4">
                                                <div className="flex items-center text-sm font-medium text-slate-600">
                                                    <Clock className="h-4 w-4 mr-2 text-primary-500" />
                                                    {formatTime(interview.start_time)} - {formatTime(interview.end_time)}
                                                </div>
                                                <div className="flex items-center text-sm font-medium text-slate-600">
                                                    <MapPin className="h-4 w-4 mr-2 text-primary-500" />
                                                    {interview.location || 'Online / Remote'}
                                                </div>
                                            </div>

                                            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 mb-4">
                                                <p className="text-sm text-slate-700 leading-relaxed font-medium">
                                                    {interview.description || "No additional details provided."}
                                                </p>
                                            </div>

                                            {/* History/Conversation Section */}
                                            {interview.history && interview.history.length > 0 && (
                                                <div className="mt-4">
                                                    <button
                                                        onClick={() => setExpandedHistory(expandedHistory === interview.id ? null : interview.id)}
                                                        className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 mb-2"
                                                    >
                                                        {expandedHistory === interview.id ? 'Hide History' : 'View History'} ({interview.history.length})
                                                    </button>

                                                    <AnimatePresence>
                                                        {expandedHistory === interview.id && (
                                                            <motion.div
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="space-y-3 pl-4 border-l-2 border-slate-100 py-1">
                                                                    {interview.history.map((item, idx) => (
                                                                        <div key={idx} className="relative">
                                                                            <div className="absolute -left-[18px] top-1.5 w-2 h-2 rounded-full bg-slate-200 border border-white" />
                                                                            <div className="flex justify-between items-start mb-0.5">
                                                                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                                                                                    {new Date(item.created_at).toLocaleDateString()}
                                                                                </span>
                                                                                <span className="text-[10px] font-medium text-slate-400">
                                                                                    {item.status_at_time.replace('_', ' ')}
                                                                                </span>
                                                                            </div>
                                                                            <p className="text-sm text-slate-600 italic">"{item.message}"</p>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </motion.div>
                                                        )}
                                                    </AnimatePresence>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {(interview.status === 'pending' || interview.status === 'accepted' || interview.status === 'scheduled' || interview.status === 'rescheduled') && (
                                        <div className="flex flex-col gap-2 shrink-0 min-w-[140px]">
                                            {(interview.status === 'pending' || interview.status === 'scheduled' || interview.status === 'rescheduled') && (
                                                <Button
                                                    variant="success"
                                                    className="w-full justify-center"
                                                    leftIcon={<CheckCircle className="h-4 w-4" />}
                                                    onClick={() => handleResponse(interview.id, 'accepted')}
                                                    isLoading={processingId === interview.id}
                                                >
                                                    Confirm
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline"
                                                className="w-full justify-center text-orange-600 hover:bg-orange-50 border-orange-100"
                                                leftIcon={<Clock className="h-4 w-4" />}
                                                onClick={() => openRescheduleModal(interview.id)}
                                                isLoading={processingId === interview.id}
                                            >
                                                Reschedule
                                            </Button>

                                            {(interview.status === 'pending' || interview.status === 'scheduled') && (
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-center text-rose-600 hover:bg-rose-50 border-rose-100"
                                                    leftIcon={<XCircle className="h-4 w-4" />}
                                                    onClick={() => handleResponse(interview.id, 'declined')}
                                                    isLoading={processingId === interview.id}
                                                >
                                                    Decline
                                                </Button>
                                            )}
                                        </div>
                                    )}

                                    {(interview.status === 'accepted' || interview.status === 'scheduled' || interview.status === 'rescheduled') && (
                                        <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-2 rounded-xl border border-emerald-100 shrink-0 self-start lg:self-center">
                                            <CheckCircle className="h-5 w-5" />
                                            {interview.status === 'rescheduled' ? 'Rescheduled' : 'Confirmed'}
                                        </div>
                                    )}

                                    {interview.status === 'reschedule_requested' && (
                                        <div className="flex items-center gap-2 text-orange-600 font-bold bg-orange-50 px-4 py-2 rounded-xl border border-orange-100 shrink-0">
                                            <Clock className="h-5 w-5" />
                                            Reschedule Requested
                                        </div>
                                    )}

                                    {interview.status === 'declined' && (
                                        <div className="flex items-center gap-2 text-rose-600 font-bold bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 shrink-0">
                                            <XCircle className="h-5 w-5" />
                                            Invitation Declined
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isRescheduleModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsRescheduleModalOpen(false)}
                            className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden"
                        >
                            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-slate-900">Request Reschedule</h3>
                                <button
                                    onClick={() => setIsRescheduleModalOpen(false)}
                                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                >
                                    <XCircle className="h-5 w-5 text-slate-500" />
                                </button>
                            </div>

                            <div className="p-6 space-y-4">
                                <p className="text-sm text-slate-600">
                                    Please let the employer know why you need to reschedule and suggest some alternative times if possible.
                                </p>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-1">Your Message</label>
                                    <textarea
                                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[120px] text-sm"
                                        placeholder="e.g. I have a prior commitment at this time. Would Wednesday at 2pm work instead?"
                                        value={rescheduleNotes}
                                        onChange={(e) => setRescheduleNotes(e.target.value)}
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button
                                        variant="outline"
                                        className="flex-1"
                                        onClick={() => setIsRescheduleModalOpen(false)}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                                        onClick={() => rescheduleId && handleResponse(rescheduleId, 'reschedule_requested', rescheduleNotes)}
                                        isLoading={processingId === rescheduleId}
                                        disabled={!rescheduleNotes.trim()}
                                    >
                                        Send Request
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </DashboardLayout>
    );
}
