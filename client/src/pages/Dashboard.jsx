import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchMyGigs } from '../features/gigSlice';
import { fetchMyApplications } from '../features/bidSlice';
import { Briefcase, FileText, ChevronRight, Gavel, CheckCircle, XCircle, Clock, PlusCircle, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

const StatusBadge = memo(({ status }) => {
    const styles = {
        open: 'bg-green-500/10 text-green-400 border-green-500/20',
        assigned: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
        hired: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
        rejected: 'bg-red-500/10 text-red-400 border-red-500/20',
        pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    };
    return (
        <span className={`px-2 py-0.5 text-[9px] font-black tracking-widest rounded-md border ${styles[status] || styles.pending}`}>
            {status.toUpperCase()}
        </span>
    );
});

const GigItem = memo(({ gig }) => (
    <Link
        to={`/gigs/${gig._id}`}
        className="glass-card p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between group hover:border-blue-500/40 transition-all duration-300 relative overflow-hidden"
    >
        <div className="absolute inset-0 bg-blue-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center space-x-4 md:space-x-6 relative z-10 text-left">
            <div className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center border transition-all duration-300 group-hover:scale-110 flex-shrink-0 ${gig.status === 'open' ? 'bg-blue-500/10 border-blue-500/20 text-blue-400' : 'bg-purple-500/10 border-purple-500/20 text-purple-400'}`}>
                <FileText className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="space-y-1 min-w-0">
                <h3 className="text-white text-base md:text-lg font-bold group-hover:text-blue-400 transition-colors leading-tight truncate">{gig.title}</h3>
                <div className="flex items-center space-x-3">
                    <div className="flex items-center space-x-1 text-slate-500 text-[10px] md:text-xs font-bold">
                        <DollarSign className="w-3 md:w-3.5 h-3 md:h-3.5 text-green-400" />
                        <span>{gig.budget}</span>
                    </div>
                    <span className="text-slate-800 text-xs">|</span>
                    <StatusBadge status={gig.status} />
                </div>
            </div>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center justify-end sm:justify-center relative z-10 self-end sm:self-center">
            <div className="p-2 rounded-xl bg-white/5 border border-white/5 group-hover:border-blue-500/30 transition-all group-hover:bg-blue-500/5">
                <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
            </div>
        </div>
    </Link>
));

const ApplicationItem = memo(({ bid }) => (
    <Link
        to={`/gigs/${bid.gigId?._id}`}
        className="glass-card p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between relative overflow-hidden group hover:border-indigo-500/40 transition-all duration-300"
    >
        <div className="absolute inset-0 bg-indigo-600/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <div className="flex items-center space-x-4 md:space-x-6 relative z-10 text-left flex-1 min-w-0">
            <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                <Gavel className="w-6 h-6 md:w-7 md:h-7" />
            </div>
            <div className="space-y-1.5 min-w-0 flex-1">
                <div className="flex items-center space-x-2">
                    <h3 className="text-white text-base md:text-lg font-bold group-hover:text-indigo-400 transition-colors leading-tight truncate">{bid.gigId?.title}</h3>
                    <StatusBadge status={bid.status} />
                </div>
                <p className="text-slate-500 text-xs truncate max-w-md">{bid.gigId?.description}</p>
                <div className="flex items-center space-x-4 text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-wider">
                    <div className="flex items-center space-x-1">
                        <DollarSign className="w-3 h-3 text-green-400" />
                        <span>Your Bid: ${bid.price}</span>
                    </div>
                    <span className="text-slate-800">|</span>
                    <div className="flex items-center space-x-1">
                        <Briefcase className="w-3 h-3 text-blue-400" />
                        <span>Project Budget: ${bid.gigId?.budget}</span>
                    </div>
                </div>
            </div>
        </div>
        <div className="mt-4 sm:mt-0 flex flex-col items-end space-y-2 relative z-10 flex-shrink-0">
            <div className="flex items-center justify-center">
                {bid.status === 'hired' && (
                    <div className="flex items-center space-x-1.5 text-green-400 animate-in zoom-in duration-500">
                        <CheckCircle className="w-6 h-6 md:w-7 md:h-7 fill-green-400/10" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter">HIRED</span>
                    </div>
                )}
                {bid.status === 'rejected' && (
                    <div className="flex items-center space-x-1.5 text-red-400 opacity-60">
                        <XCircle className="w-6 h-6 md:w-7 md:h-7 fill-red-400/10" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter">REJECTED</span>
                    </div>
                )}
                {bid.status === 'pending' && (
                    <div className="flex items-center space-x-1.5 text-yellow-500 animate-pulse">
                        <Clock className="w-6 h-6 md:w-7 md:h-7 fill-yellow-500/10" />
                        <span className="text-[9px] md:text-[10px] font-black uppercase tracking-tighter">IN REVIEW</span>
                    </div>
                )}
            </div>
            <span className="text-[9px] md:text-[10px] font-bold text-slate-600 uppercase tracking-widest">{new Date(bid.createdAt).toLocaleDateString()}</span>
        </div>
    </Link>
));

const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('client');
    const dispatch = useDispatch();
    const { myGigs, loading: gigsLoading } = useSelector((state) => state.gigs);
    const { myApplications, loading: bidsLoading } = useSelector((state) => state.bids);

    useEffect(() => {
        dispatch(fetchMyGigs());
        dispatch(fetchMyApplications());
    }, [dispatch]);

    const handleTabChange = useCallback((tab) => {
        setActiveTab(tab);
    }, []);

    const renderedGigs = useMemo(() => {
        if (gigsLoading) return <div className="text-center p-10 text-slate-500">Loading your gigs...</div>;
        return myGigs.length > 0 ? (
            myGigs.map((gig) => <GigItem key={gig._id} gig={gig} />)
        ) : (
            <div className="bg-white/[0.02] rounded-3xl border-2 border-dashed border-white/5 p-12 md:p-20 text-center space-y-4 shadow-inner">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <FileText className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 font-medium text-sm md:text-base">No projects found. Ready to hire some talent?</p>
                <Link to="/post-gig" className="inline-block text-blue-400 hover:text-blue-300 font-bold transition-colors text-sm md:text-base">Start by posting your first gig →</Link>
            </div>
        );
    }, [myGigs, gigsLoading]);

    const renderedApplications = useMemo(() => {
        if (bidsLoading) return <div className="text-center p-10 text-slate-500">Loading your applications...</div>;
        return myApplications.length > 0 ? (
            myApplications.map((bid) => <ApplicationItem key={bid._id} bid={bid} />)
        ) : (
            <div className="bg-white/[0.02] rounded-3xl border-2 border-dashed border-white/5 p-12 md:p-20 text-center space-y-4 shadow-inner">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                    <Gavel className="w-6 h-6 md:w-8 md:h-8 text-slate-600" />
                </div>
                <p className="text-slate-500 font-medium text-sm md:text-base">Haven't place any bids yet. Time to freelance?</p>
                <Link to="/" className="inline-block text-indigo-400 hover:text-indigo-300 font-bold transition-colors text-sm md:text-base">Browse available gigs →</Link>
            </div>
        );
    }, [myApplications, bidsLoading]);

    return (
        <div className="space-y-8 md:space-y-10 px-2 sm:px-0">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
                <div className="space-y-2 text-center lg:text-left">
                    <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white tracking-tight">Your Dashboard</h1>
                    <p className="text-slate-400 text-xs md:text-sm lg:text-base">Manage your business projects and applications</p>
                </div>

                <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/5 w-fit mx-auto lg:mx-0 backdrop-blur-xl shadow-inner">
                    <button
                        onClick={() => handleTabChange('client')}
                        className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-all font-bold text-xs sm:text-sm flex items-center space-x-2 ${activeTab === 'client' ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-[0_0_20px_rgba(37,99,235,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Client Projects</span>
                    </button>
                    <button
                        onClick={() => handleTabChange('freelancer')}
                        className={`px-4 sm:px-8 py-2.5 sm:py-3 rounded-xl transition-all font-bold text-xs sm:text-sm flex items-center space-x-2 ${activeTab === 'freelancer' ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-[0_0_20px_rgba(79,70,229,0.3)]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                    >
                        <Gavel className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        <span>Freelance Bids</span>
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg md:text-xl lg:text-2xl font-display font-bold text-white">{activeTab === 'client' ? 'Active Postings' : 'Active Applications'}</h2>
                    {activeTab === 'client' && (
                        <Link to="/post-gig" className="btn-primary py-2 px-4 md:px-6 text-xs md:text-sm flex items-center space-x-2">
                            <PlusCircle className="w-3.5 h-3.5 md:w-4 md:h-4" />
                            <span className="hidden sm:inline">Post New Gig</span>
                        </Link>
                    )}
                </div>

                <div className="grid gap-4 md:gap-6">
                    {activeTab === 'client' ? renderedGigs : renderedApplications}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
