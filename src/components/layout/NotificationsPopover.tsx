import React, { useState, useEffect, useRef } from 'react';
import { Bell, Check, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getNotifications, markNotificationRead, Notification } from '../../lib/api';
import { formatTime } from '../../lib/utils';
import { Button } from '../common/Button';

export function NotificationsPopover() {
    const [isOpen, setIsOpen] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const fetchNotifications = async () => {
        try {
            const data = await getNotifications();
            // Sort by Date (newest first) - assuming ID or created_at
            // The API returns them, let's assume backend sorts or we sort here if needed
            setNotifications(data.reverse());
            setUnreadCount(data.filter(n => !n.is_read).length);
        } catch (error) {
            console.error('Failed to fetch notifications:', error);
        }
    };

    // Initial fetch and periodic poll
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    // Close on click outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleMarkAsRead = async (id: number) => {
        try {
            await markNotificationRead(id);
            setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark read:', err);
        }
    };

    const handleMarkAllRead = async () => {
        // Optimistic update
        const unreadIds = notifications.filter(n => !n.is_read).map(n => n.id);
        setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
        setUnreadCount(0);

        // Process in background
        for (const id of unreadIds) {
            markNotificationRead(id).catch(console.error);
        }
    };

    const toggleOpen = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            fetchNotifications(); // Refresh on open
        }
    };

    return (
        <div className="relative" ref={containerRef}>
            <button
                onClick={toggleOpen}
                className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden z-50 origin-top-right"
                    >
                        <div className="flex items-center justify-between p-4 border-b border-slate-100">
                            <h3 className="font-semibold text-slate-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    className="text-xs font-medium text-primary-600 hover:text-primary-700"
                                >
                                    Mark all read
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-slate-500">
                                    <Bell className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                                    <p className="text-sm">No notifications yet</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-slate-100">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 hover:bg-slate-50 transition-colors ${!notification.is_read ? 'bg-primary-50/30' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`mt-1 h-2 w-2 rounded-full shrink-0 ${!notification.is_read ? 'bg-primary-500' : 'bg-transparent'}`} />
                                                <div className="flex-1 space-y-1">
                                                    <p className={`text-sm ${!notification.is_read ? 'font-semibold text-slate-900' : 'font-medium text-slate-700'}`}>
                                                        {notification.title}
                                                    </p>
                                                    <p className="text-sm text-slate-600 leading-relaxed">
                                                        {notification.message}
                                                    </p>
                                                    <div className="flex items-center justify-between pt-1">
                                                        <span className="text-xs text-slate-400 flex items-center">
                                                            <Clock className="h-3 w-3 mr-1" />
                                                            {new Date(notification.created_at || Date.now()).toLocaleDateString()}
                                                        </span>
                                                        {!notification.is_read && (
                                                            <button
                                                                onClick={() => handleMarkAsRead(notification.id)}
                                                                className="text-xs text-primary-600 hover:text-primary-700 font-medium flex items-center"
                                                            >
                                                                <Check className="h-3 w-3 mr-1" />
                                                                Mark read
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
