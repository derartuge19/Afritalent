import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../../components/layout/Layout';
import { Button } from '../../components/common/Button';
import { api } from '../../lib/api';
import { Mail, Lock, AlertCircle, Building2, User } from 'lucide-react';

type UserRole = 'seeker' | 'employer';

export function RegisterPage() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialRole = (queryParams.get('role') as UserRole) || 'seeker';

    const [role, setRole] = useState<UserRole>(initialRole);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log('Attempting registration for:', email, 'as', role);
            await api.post('/auth/register', {
                email,
                password,
                role
            });

            console.log('Registration successful');
            // Success - Redirect to login
            navigate('/login');
        } catch (err: any) {
            console.error('Registration error:', err);
            const detail = err.response?.data?.detail;
            setError(typeof detail === 'string' ? detail : 'Failed to register. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Layout>
            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                    <div>
                        <h2 className="mt-6 text-center text-3xl font-bold text-slate-900">
                            Create an account
                        </h2>
                        <p className="mt-2 text-center text-sm text-slate-600">
                            Join AfriTalent today
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button
                            onClick={() => setRole('seeker')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === 'seeker'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                        >
                            <User className="h-6 w-6 mb-2" />
                            <span className="font-medium text-sm">User</span>
                        </button>
                        <button
                            onClick={() => setRole('employer')}
                            className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all ${role === 'employer'
                                ? 'border-primary-500 bg-primary-50 text-primary-700'
                                : 'border-slate-200 hover:border-slate-300 text-slate-600'
                                }`}
                        >
                            <Building2 className="h-6 w-6 mb-2" />
                            <span className="font-medium text-sm">Employer</span>
                        </button>
                    </div>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                                <AlertCircle className="h-4 w-4" />
                                {error}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">
                                    Email address
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700">
                                    Password
                                </label>
                                <div className="mt-1 relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-slate-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type="password"
                                        autoComplete="new-password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full flex justify-center py-2.5"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Create account'}
                        </Button>

                        <div className="text-center text-sm">
                            <span className="text-slate-600">Already have an account? </span>
                            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                                Sign in
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}
