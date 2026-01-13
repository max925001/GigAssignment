import React, { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGigs } from '../features/gigSlice';
import { fetchMyApplications } from '../features/bidSlice';
import GigCard from '../components/GigCard';
import { Search, Loader2, Sparkles } from 'lucide-react';

const Home = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    const { myApplications } = useSelector((state) => state.bids);
    const { gigs, loading } = useSelector((state) => state.gigs);

    useEffect(() => {
        if (user) {
            dispatch(fetchMyApplications());
        }
    }, [dispatch, user]);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            dispatch(fetchGigs(searchTerm));
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm, dispatch]);

    const filteredGigs = useMemo(() => {
        if (!user) return gigs;
        const appliedGigIds = new Set(myApplications.map(app => app.gigId?._id || app.gigId));
        return gigs.filter(gig => !appliedGigIds.has(gig._id));
    }, [gigs, myApplications, user]);

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <section className="text-center space-y-6 py-8 md:py-16">
                <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full text-blue-400 text-xs md:text-sm font-medium animate-bounce shadow-glow">
                    <Sparkles className="w-3.5 h-3.5 md:w-4 md:h-4" />
                    <span>The world's premier gig marketplace</span>
                </div>
                <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight leading-tight">
                    Find your next <br className="hidden sm:block" />
                    <span className="gradient-text">Dream Gig</span>
                </h1>
                <p className="text-slate-400 text-base md:text-xl max-w-2xl mx-auto px-4 leading-relaxed">
                    The ultimate platform for freelancers and clients to connect, collaborate, and build amazing products together.
                </p>

                {/* Search Bar */}
                <div className="max-w-2xl mx-auto relative group px-4 mt-8 md:mt-12">
                    <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-focus-within:opacity-40 transition duration-1000"></div>
                    <div className="relative">
                        <Search className="absolute left-6 md:left-8 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5 md:w-6 md:h-6" />
                        <input
                            type="text"
                            placeholder="Search projects (React, Node, UI Design)..."
                            className="w-full bg-[#0a0f1e] border border-white/10 rounded-2xl py-4 md:py-5 pl-14 md:pl-18 pr-6 text-white text-base md:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all shadow-2xl placeholder:text-slate-600"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </section>

            {/* Feed */}
            <section className="space-y-8">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-display font-bold text-white">Latest Gigs</h2>
                    <span className="text-slate-500 text-sm">{filteredGigs.length} projects found</span>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-24 space-y-4">
                        <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                        <p className="text-slate-400 animate-pulse">Scanning the marketplace...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredGigs.length > 0 ? (
                            filteredGigs.map((gig) => <GigCard key={gig._id} gig={gig} />)
                        ) : (
                            <div className="col-span-full text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                                <p className="text-slate-400 text-lg">No gigs found matching your search.</p>
                            </div>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Home;
