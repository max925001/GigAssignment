import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register, resetError } from '../features/authSlice';
import { UserPlus, Mail, Lock, User, Loader2 } from 'lucide-react';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, loading, error } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(resetError());
    }, [dispatch]);

    useEffect(() => {
        if (user) navigate('/');
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(formData));
    };

    return (
        <div className="max-w-md mx-auto mt-12">
            <div className="glass-card p-8 shadow-2xl">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-indigo-500/20 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-indigo-500/30">
                        <UserPlus className="w-8 h-8 text-indigo-400" />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white mb-2">Create Account</h2>
                    <p className="text-slate-400">Join the GigFlow marketplace</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Full Name</label>
                        <div className="relative">
                            <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="text"
                                required
                                className="input-field pl-12"
                                placeholder="John Doe"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="email"
                                required
                                className="input-field pl-12"
                                placeholder="john@example.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                required
                                className="input-field pl-12"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6 flex flex-col sm:flex-row gap-4">
                        <button
                            type="button"
                            onClick={() => navigate('/')}
                            className="flex-1 btn-secondary text-center py-4"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-[2] btn-primary py-4 flex items-center justify-center space-x-2"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Create Account</span>}
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-center text-slate-400">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-medium">Log in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
