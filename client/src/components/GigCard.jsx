import React from 'react';
import { Link } from 'react-router-dom';
import { DollarSign, Clock, ArrowUpRight, User } from 'lucide-react';

const GigCard = ({ gig }) => {
    return (
        <div className="glass-card p-6 md:p-8 group hover:border-blue-500/40 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all duration-500"></div>

            <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl md:text-2xl font-display font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1 leading-tight">{gig.title}</h3>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 text-[10px] font-black tracking-widest rounded-lg border border-blue-500/20 shadow-sm">
                    OPEN
                </span>
            </div>

            <p className="text-slate-400 text-sm md:text-base mb-8 line-clamp-3 flex-grow leading-relaxed">
                {gig.description}
            </p>

            <div className="space-y-6 pt-6 border-t border-white/5 mt-auto">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/5">
                        <DollarSign className="w-5 h-5 text-green-400" />
                        <span className="font-bold text-white md:text-lg">${gig.budget}</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-slate-500 text-[11px] font-medium uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{new Date(gig.createdAt).toLocaleDateString()}</span>
                    </div>
                </div>

                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-white/10 group-hover:border-blue-500/30 transition-all">
                            <User className="w-4 h-4 text-slate-400 group-hover:text-blue-400" />
                        </div>
                        <span className="text-xs md:text-sm text-slate-400 font-medium group-hover:text-slate-300 transition-colors">{gig.ownerId?.name || 'Client'}</span>
                    </div>
                    <Link
                        to={`/gigs/${gig._id}`}
                        className="flex items-center space-x-2 text-blue-400 hover:text-blue-300 text-sm font-bold group-hover:translate-x-1.5 transition-all py-1"
                    >
                        <span>View Details</span>
                        <ArrowUpRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default GigCard;
