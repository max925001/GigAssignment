import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../features/authSlice';
import { Menu, X, Briefcase, PlusCircle, LogOut, User as UserIcon } from 'lucide-react';

import NotificationCenter from './NotificationCenter';

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0f172a]/80 backdrop-blur-lg border-b border-white/10 hidden md:block">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                                <Briefcase className="text-white w-6 h-6" />
                            </div>
                            <span className="text-xl font-bold font-display gradient-text">GigFlow</span>
                        </Link>
                    </div>

                    <div className="flex items-center space-x-6 lg:space-x-8">
                        <Link to="/" className="text-slate-400 hover:text-blue-400 transition-all font-medium text-sm tracking-wide">Browse Gigs</Link>
                        {user ? (
                            <>
                                <Link to="/post-gig" className="flex items-center space-x-1.5 text-slate-400 hover:text-blue-400 transition-all font-medium text-sm tracking-wide">
                                    <PlusCircle className="w-4 h-4" />
                                    <span>Post a Gig</span>
                                </Link>
                                <Link to="/dashboard" className="text-slate-400 hover:text-blue-400 transition-all font-medium text-sm tracking-wide">Dashboard</Link>
                                <div className="flex items-center space-x-4 ml-4 pl-6 border-l border-white/5">
                                    <NotificationCenter />
                                    <div className="flex items-center space-x-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5 transition-all hover:border-blue-500/30">
                                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                                            <UserIcon className="w-4 h-4 text-white" />
                                        </div>
                                        <span className="text-white font-semibold text-xs tracking-tight">{user.name}</span>
                                    </div>
                                    <button onClick={handleLogout} className="text-slate-500 hover:text-red-400 transition-all p-1 hover:bg-red-400/10 rounded-lg">
                                        <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-5">
                                <Link to="/login" className="text-slate-400 hover:text-white font-medium text-sm">Login</Link>
                                <Link to="/register" className="btn-primary py-2 px-5 text-sm">Sign Up</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
