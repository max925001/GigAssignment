import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigById, fetchGigs } from '../features/gigSlice';
import { fetchBidsByGig, submitBid, hireFreelancer, resetHiringStatus } from '../features/bidSlice';
import { DollarSign, User, Calendar, MessageSquare, Send, CheckCircle, ShieldCheck, Loader2, ArrowLeft } from 'lucide-react';

const GigDetails = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentGig, loading: gigLoading } = useSelector((state) => state.gigs);
    const { bids, hiringStatus, loading: bidsLoading } = useSelector((state) => state.bids);
    const { user } = useSelector((state) => state.auth);

    const [bidData, setBidData] = useState({ message: '', price: '' });
    const [showBidForm, setShowBidForm] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        dispatch(fetchGigById(id));
        dispatch(fetchBidsByGig(id));

        return () => dispatch(resetHiringStatus());
    }, [dispatch, id]);

    const handleBidSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        const result = await dispatch(submitBid({ gigId: id, ...bidData }));
        if (!result.error) {
            setShowBidForm(false);
            dispatch(fetchBidsByGig(id));
            setBidData({ message: '', price: '' });
        } else {
            setError(result.payload || 'Failed to submit bid');
        }
    };

    const handleHire = async (bidId) => {
        if (window.confirm('Are you sure you want to hire this freelancer? All other bids will be rejected.')) {
            const result = await dispatch(hireFreelancer(bidId));
            if (!result.error) {
                dispatch(fetchGigById(id));
                dispatch(fetchBidsByGig(id));
            }
        }
    };

    if (gigLoading || !currentGig) {
        return <div className="flex justify-center items-center h-64"><Loader2 className="w-12 h-12 text-blue-500 animate-spin" /></div>;
    }

    const isOwner = user?._id === currentGig.ownerId?._id;
    const hasBid = bids.some(bid => bid.freelancerId?._id === user?._id);

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <button onClick={() => navigate(-1)} className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors">
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
            </button>

            {/* Gig Header */}
            <div className="glass-card p-6 md:p-10 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/10 rounded-full blur-[100px] -mr-24 -mt-24 group-hover:bg-blue-500/20 transition-all duration-700"></div>

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                    <div className="space-y-4 md:space-y-6 max-w-3xl">
                        <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold border tracking-wider shadow-sm ${currentGig.status === 'open' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-purple-500/10 text-purple-400 border-purple-500/20'}`}>
                            <div className={`w-1.5 h-1.5 rounded-full mr-2 ${currentGig.status === 'open' ? 'bg-green-400 animate-pulse' : 'bg-purple-400'}`} />
                            {currentGig.status.toUpperCase()}
                        </div>
                        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                            {currentGig.title}
                        </h1>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 text-slate-400 text-sm md:text-base">
                            <div className="flex items-center space-x-3 bg-white/5 px-4 py-2 rounded-xl backdrop-blur-sm border border-white/5">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center border border-blue-500/30">
                                    <User className="w-4 h-4 md:w-5 md:h-5 text-blue-400" />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[10px] uppercase font-bold text-slate-500">CLIENT</span>
                                    <span className="text-white font-medium">{currentGig.ownerId?.name}</span>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2 text-slate-500 px-2 py-1">
                                <Calendar className="w-4 h-4" />
                                <span>Posted {new Date(currentGig.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="bg-gradient-to-br from-white/10 to-white/5 border border-white/10 rounded-3xl p-6 md:p-8 text-center min-w-[200px] shadow-2xl backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        <p className="text-slate-500 text-[10px] md:text-xs mb-2 uppercase tracking-[0.2em] font-black">Project Budget</p>
                        <div className="flex items-center justify-center space-x-1 text-white relative z-10">
                            <DollarSign className="w-6 h-6 md:w-8 md:h-8 text-green-400" />
                            <span className="text-4xl md:text-5xl font-bold font-display tracking-tight">{currentGig.budget}</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* Tabs / Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <div className="glass-card p-8">
                        <h2 className="text-xl font-bold text-white mb-6 border-b border-white/10 pb-4">Job Description</h2>
                        <div className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                            {currentGig.description}
                        </div>
                    </div>

                    {/* Bids Section for Owner or Freelancer */}
                    {isOwner ? (
                        <div className="space-y-6">
                            <h2 className="text-xl font-bold text-white flex items-center space-x-2">
                                <MessageSquare className="w-5 h-5 text-blue-400" />
                                <span>Received Bids ({bids.length})</span>
                            </h2>
                            <div className="space-y-4">
                                {bids.length > 0 ? (
                                    bids.map((bid) => (
                                        <div key={bid._id} className={`glass-card p-6 border-l-4 transition-all ${bid.status === 'hired' ? 'border-l-green-500 bg-green-500/5' : bid.status === 'rejected' ? 'border-l-red-500 opacity-60' : 'border-l-blue-500 hover:bg-white/10'}`}>
                                            <div className="flex justify-between items-start mb-4">
                                                <div className="flex items-center space-x-3">
                                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-white/10 font-bold text-blue-400">
                                                        {bid.freelancerId?.name?.[0].toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <h4 className="text-white font-bold">{bid.freelancerId?.name}</h4>
                                                        <p className="text-slate-500 text-xs">{bid.freelancerId?.email}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-white font-bold text-lg">${bid.price}</p>
                                                    <p className="text-slate-500 text-[10px]">{new Date(bid.createdAt).toLocaleDateString()}</p>
                                                </div>
                                            </div>
                                            <p className="text-slate-400 text-sm mb-6 bg-black/20 p-4 rounded-xl italic">"{bid.message}"</p>

                                            {currentGig.status === 'open' && bid.status === 'pending' && (
                                                <button
                                                    onClick={() => handleHire(bid._id)}
                                                    disabled={hiringStatus === 'loading'}
                                                    className="w-full btn-primary flex items-center justify-center space-x-2 py-3"
                                                >
                                                    {hiringStatus === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                                        <><ShieldCheck className="w-5 h-5" /> <span>Hire Freelancer</span></>
                                                    )}
                                                </button>
                                            )}

                                            {bid.status === 'hired' && (
                                                <div className="flex items-center justify-center space-x-2 text-green-400 font-bold py-2 bg-green-500/10 rounded-xl">
                                                    <CheckCircle className="w-5 h-5" />
                                                    <span>Hired</span>
                                                </div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10 text-slate-500">
                                        No bids received yet.
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {currentGig.status === 'open' && !hasBid && user && !isOwner && (
                                <div className="glass-card p-8 border-2 border-blue-500/20 bg-blue-500/5">
                                    <h2 className="text-xl font-bold text-white mb-6">Apply for this Gig</h2>
                                    <form onSubmit={handleBidSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Proposal Message</label>
                                            <textarea
                                                required
                                                className="input-field min-h-[120px]"
                                                placeholder="Tell the client why you are a good fit..."
                                                value={bidData.message}
                                                onChange={(e) => setBidData({ ...bidData, message: e.target.value })}
                                            ></textarea>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Bid Price ($)</label>
                                            <input
                                                type="number"
                                                required
                                                className="input-field"
                                                placeholder="Enter your price"
                                                value={bidData.price}
                                                onChange={(e) => setBidData({ ...bidData, price: e.target.value })}
                                            />
                                        </div>
                                        <button
                                            type="submit"
                                            disabled={bidsLoading || gigLoading}
                                            className="w-full btn-primary py-4 font-bold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                        >
                                            {bidsLoading ? (
                                                <>
                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                    <span>Submitting...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Send className="w-5 h-5" />
                                                    <span>Submit Application</span>
                                                </>
                                            )}
                                        </button>
                                        {error && (
                                            <p className="text-red-400 text-xs font-bold text-center mt-2 animate-in fade-in slide-in-from-top-1">
                                                {error}
                                            </p>
                                        )}
                                    </form>
                                </div>
                            )}

                            {isOwner && currentGig.status === 'open' && (
                                <div className="glass-card p-8 border-2 border-blue-500/10 bg-white/[0.02] text-center">
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <User className="w-6 h-6 text-blue-400" />
                                    </div>
                                    <h3 className="text-lg font-bold text-white">Project Management</h3>
                                    <p className="text-slate-500 text-sm mt-2">You are the owner of this gig. Manage bids from the list on the left.</p>
                                </div>
                            )}

                            {hasBid && (
                                <div className="glass-card p-8 border-2 border-green-500/20 bg-green-500/5 text-center">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/30">
                                        <CheckCircle className="w-8 h-8 text-green-400" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">Application Submitted!</h3>
                                    <p className="text-slate-400 mt-2">You have already submitted your bid for this gig. If the client is interested in your profile, they will contact you.</p>
                                </div>
                            )}

                            {!user && (
                                <div className="glass-card p-8 text-center bg-white/5">
                                    <p className="text-slate-400 mb-4">You need to be logged in to bid on this gig.</p>
                                    <button onClick={() => navigate('/login')} className="btn-primary">Login to Apply</button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="glass-card p-6">
                        <h3 className="text-white font-bold mb-4 flex items-center space-x-2">
                            <ShieldCheck className="w-4 h-4 text-blue-400" />
                            <span>Safety Tips</span>
                        </h3>
                        <ul className="text-xs text-slate-500 space-y-3 list-disc pl-4 leading-relaxed">
                            <li>Never pay outside the platform.</li>
                            <li>Check freelancer reviews before hiring.</li>
                            <li>Ensure project requirements are clear.</li>
                            <li>Use milestones for large projects.</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GigDetails;
