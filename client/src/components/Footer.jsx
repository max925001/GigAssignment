import React from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="relative mt-20 border-t border-white/5 bg-[#020617]/80 backdrop-blur-xl">
            {/* Decorative background element */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-px bg-gradient-to-r from-transparent via-blue-500/50 to-transparent"></div>

            <div className="mx-auto max-w-7xl px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-8">
                    {/* Brand Section */}
                    <div className="col-span-1 md:col-span-1 space-y-6">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                                <Briefcase className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-2xl font-display font-black tracking-tight text-white">
                                GiG<span className="text-blue-500">Free</span>
                            </span>
                        </Link>
                        <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
                            The ultimate platform for freelancers and clients to connect, collaborate, and build amazing products together.
                        </p>
                        <div className="flex items-center space-x-4">
                            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all">
                                <Twitter className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all">
                                <Github className="w-4 h-4" />
                            </a>
                            <a href="#" className="p-2 rounded-lg bg-white/5 border border-white/5 text-slate-400 hover:text-blue-400 hover:border-blue-500/30 transition-all">
                                <Linkedin className="w-4 h-4" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">For Freelancers</h3>
                        <ul className="space-y-4">
                            <li><Link to="/" className="text-slate-400 hover:text-white text-sm transition-colors">Browse Gigs</Link></li>
                            <li><Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">My Applications</Link></li>
                            <li><Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Freelancer Guide</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">For Clients</h3>
                        <ul className="space-y-4">
                            <li><Link to="/post-gig" className="text-slate-400 hover:text-white text-sm transition-colors">Post a Gig</Link></li>
                            <li><Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Manage Projects</Link></li>
                            <li><Link to="/dashboard" className="text-slate-400 hover:text-white text-sm transition-colors">Hiring Advice</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-white font-bold mb-6 uppercase tracking-wider text-xs">Support</h3>
                        <ul className="space-y-4">
                            <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Help Center</Link></li>
                            <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Terms of Service</Link></li>
                            <li><Link to="#" className="text-slate-400 hover:text-white text-sm transition-colors">Privacy Policy</Link></li>
                            <li className="flex items-center space-x-2 text-slate-400 text-sm">
                                <Mail className="w-4 h-4" />
                                <span>support@gigfree.com</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-slate-500 text-xs font-medium">
                        © {currentYear} GiGFree Marketplace. All rights reserved.
                    </p>
                    <div className="flex items-center space-x-1 text-slate-500 text-xs font-medium">
                        <span>Built with</span>
                        <Heart className="w-3 h-3 text-red-500 animate-pulse" />
                        <span>for the freelance community</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
