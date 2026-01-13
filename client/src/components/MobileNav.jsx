import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Home, Briefcase, PlusCircle, Bell, LogOut, User } from 'lucide-react';
import { logout } from '../features/authSlice';
import NotificationCenter from './NotificationCenter';

const MobileNav = () => {
    const { user } = useSelector((state) => state.auth);
    const { unreadCount } = useSelector((state) => state.notifications);
    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    if (!user) return null;

    const getInitials = (name) => {
        return name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const isActive = (path) => location.pathname === path;

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-6 pt-2">
            <div className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 rounded-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between px-6 py-3">
                <Link to="/" className={`flex flex-col items-center space-y-1 transition-all ${isActive('/') ? 'text-blue-400' : 'text-slate-500'}`}>
                    <Home className={`w-5 h-5 ${isActive('/') ? 'fill-blue-400/10' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter transition-all">Home</span>
                </Link>

                <Link to="/post-gig" className={`flex flex-col items-center space-y-1 transition-all ${isActive('/post-gig') ? 'text-blue-400' : 'text-slate-500'}`}>
                    <PlusCircle className={`w-5 h-5 ${isActive('/post-gig') ? 'fill-blue-400/10' : ''}`} />
                    <span className="text-[10px] font-bold uppercase tracking-tighter transition-all">Post</span>
                </Link>

                {/* Unified Notification Trigger for Mobile */}
                <div className="relative">
                    <NotificationCenter isMobile={true} />
                </div>

                <Link to="/dashboard" className={`flex flex-col items-center space-y-1 transition-all ${isActive('/dashboard') ? 'text-blue-400' : 'text-slate-500'}`}>
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[10px] font-black text-white shadow-lg shadow-blue-500/20 ring-2 ring-white/10">
                        {getInitials(user.name)}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-tighter transition-all">Me</span>
                </Link>

                <button onClick={handleLogout} className="flex flex-col items-center space-y-1 text-slate-500 hover:text-red-400 transition-all">
                    <LogOut className="w-5 h-5" />
                    <span className="text-[10px] font-bold uppercase tracking-tighter">Exit</span>
                </button>
            </div>
        </div>
    );
};

export default MobileNav;
