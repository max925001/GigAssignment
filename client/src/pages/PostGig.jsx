import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createGig } from '../features/gigSlice';
import { PlusCircle, DollarSign, Text, AlignLeft, Loader2 } from 'lucide-react';

const PostGig = () => {
    const [formData, setFormData] = useState({ title: '', description: '', budget: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.gigs);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await dispatch(createGig(formData));
        if (!result.error) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="glass-card p-8 shadow-2xl">
                <div className="flex items-center space-x-4 mb-8">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center border border-blue-500/30">
                        <PlusCircle className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white">Post a New Gig</h1>
                        <p className="text-slate-400 text-sm">Fill in the details to find the perfect freelancer</p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Gig Title</label>
                        <div className="relative">
                            <Text className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                required
                                className="input-field pl-12"
                                placeholder="e.g. Build a Landing Page for a SaaS"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Budget (USD)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="number"
                                required
                                className="input-field pl-12"
                                placeholder="500"
                                value={formData.budget}
                                onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                        <div className="relative">
                            <AlignLeft className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                            <textarea
                                required
                                rows="6"
                                className="input-field pl-12 resize-none"
                                placeholder="Describe the requirements, tech stack, and timeline..."
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            ></textarea>
                        </div>
                    </div>

                    <div className="pt-4 flex space-x-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 btn-secondary text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] btn-primary flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>Posting...</span>
                                </>
                            ) : (
                                <span>Post Gig</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostGig;
