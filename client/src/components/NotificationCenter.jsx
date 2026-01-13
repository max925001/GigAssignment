import { useNavigate } from 'react-router-dom';
import { Bell, Check, Trash2, X, Info } from 'lucide-react';
import { markRead, markAllRead } from '../features/notificationSlice';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const NotificationCenter = ({ isMobile = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { notifications, unreadCount } = useSelector((state) => state.notifications);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMarkRead = (id) => {
        dispatch(markRead(id));
    };

    const handleMarkAllRead = () => {
        dispatch(markAllRead());
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            handleMarkRead(notification._id);
        }
        if (notification.gigId) {
            navigate(`/gigs/${notification.gigId}`);
            setIsOpen(false);
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={isMobile
                    ? `flex flex-col items-center space-y-1 transition-all ${isOpen || unreadCount > 0 ? 'text-blue-400' : 'text-slate-500'}`
                    : "relative p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-blue-500/30 transition-all group overflow-hidden"
                }
            >
                {!isMobile && <div className="absolute inset-0 bg-blue-600/[0.05] opacity-0 group-hover:opacity-100 transition-opacity"></div>}

                <div className="relative">
                    <Bell className={`w-5 h-5 transition-colors ${unreadCount > 0 ? 'text-blue-400' : (isMobile ? '' : 'text-slate-400 group-hover:text-blue-400')}`} />
                    {unreadCount > 0 && (
                        <span className={`absolute ${isMobile ? '-top-1 -right-1' : 'top-1.5 right-1.5'} flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-lg animate-in zoom-in`}>
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    )}
                </div>

                {isMobile && <span className="text-[10px] font-bold uppercase tracking-tighter transition-all">Alerts</span>}
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm cursor-pointer"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className={`fixed ${isMobile ? 'bottom-24 left-4 right-4' : 'absolute right-0 mt-3 w-80 sm:w-96'} bg-[#0f172a] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.8)] z-[70] rounded-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200`}>
                        <div className="p-4 border-b border-white/10 bg-white/[0.03] flex items-center justify-between">
                            <h3 className="font-display font-bold text-white flex items-center space-x-2 text-sm">
                                <Bell className="w-4 h-4 text-blue-400" />
                                <span>Notifications Center</span>
                            </h3>
                            <div className="flex items-center space-x-2">
                                {unreadCount > 0 && (
                                    <button
                                        onClick={handleMarkAllRead}
                                        className="text-[9px] font-black text-blue-400 hover:text-white bg-blue-400/10 px-2 py-1 rounded-md transition-all uppercase tracking-widest border border-blue-400/20"
                                    >
                                        Mark all Read
                                    </button>
                                )}
                                <button onClick={() => setIsOpen(false)} className="p-1 rounded-md hover:bg-white/5 text-slate-500 hover:text-white transition-colors">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[50vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                            {notifications.length > 0 ? (
                                notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        onClick={() => handleNotificationClick(notification)}
                                        className={`p-4 border-b border-white/5 transition-all cursor-pointer relative group ${!notification.isRead ? 'bg-blue-600/[0.07] hover:bg-blue-600/[0.12]' : 'hover:bg-white/[0.03]'}`}
                                    >
                                        {!notification.isRead && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 shadow-[2px_0_10px_rgba(37,99,235,0.6)]" />
                                        )}
                                        <div className="flex space-x-4">
                                            <div className={`flex-shrink-0 mt-0.5 p-2 rounded-xl border ${notification.type === 'HIRED' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 'bg-blue-500/20 text-blue-400 border-blue-500/20'}`}>
                                                {notification.type === 'HIRED' ? <Check className="w-4 h-4" /> : <Info className="w-4 h-4" />}
                                            </div>
                                            <div className="flex-1 space-y-1.5 min-w-0">
                                                <p className={`text-sm leading-relaxed ${!notification.isRead ? 'text-white font-bold' : 'text-slate-400 font-medium'}`}>
                                                    {notification.message}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider">
                                                        {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(notification.createdAt).toLocaleDateString()}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <span className="text-[8px] bg-blue-600 px-1.5 py-0.5 rounded text-white font-black uppercase">New</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center space-y-4">
                                    <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center mx-auto border border-white/5 rotate-12 group-hover:rotate-0 transition-transform">
                                        <Bell className="w-8 h-8 text-slate-700" />
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-slate-400 font-bold text-sm">All caught up!</p>
                                        <p className="text-slate-600 text-[10px] uppercase font-bold tracking-widest">No new notifications</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {notifications.length > 0 && (
                            <div className="p-3 bg-white/[0.03] border-t border-white/5 text-center">
                                <span className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em]">End of feed</span>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationCenter;
