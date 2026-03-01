import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { loginAdmin, getAuthStatus } from '../api/auth';
import { Lock, Phone, ArrowLeft, AlertCircle } from 'lucide-react';

const OwnerLogin = () => {
    const [phone_number, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const location = useLocation();

    // Redirect back to where they came from or default to dashboard
    const from = location.state?.from?.pathname || '/admin/dashboard';

    useEffect(() => {
        const checkAuth = async () => {
            const status = await getAuthStatus();
            if (status.is_authenticated && (status.user?.role === 'ADMIN' || status.user?.role === 'OWNER')) {
                navigate(from, { replace: true });
            }
        };
        checkAuth();
    }, [navigate, from]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!phone_number || !password) {
            setError('Please enter both phone number and password.');
            return;
        }

        try {
            setLoading(true);
            await loginAdmin({ phone_number, password });
            navigate(from, { replace: true });
        } catch (err) {
            setError(err.message || 'Login failed.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            backgroundColor: '#f8fafc',
            fontFamily: 'Inter, sans-serif'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                overflow: 'hidden'
            }}>
                <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', textAlign: 'center', color: 'white', position: 'relative' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{
                            position: 'absolute',
                            left: '1rem',
                            top: '1.5rem',
                            background: 'transparent',
                            border: 'none',
                            color: '#94a3b8',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center'
                        }}
                        title="Back to Home"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#334155', borderRadius: '50%', width: '48px', height: '48px', marginBottom: '1rem' }}>
                        <Lock size={24} color="#38bdf8" />
                    </div>
                    <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 600 }}>Owner Portal</h2>
                    <p style={{ margin: '0.25rem 0 0 0', color: '#94a3b8', fontSize: '0.875rem' }}>Secure access for administrators</p>
                </div>

                <div style={{ padding: '2rem' }}>
                    {error && (
                        <div style={{
                            backgroundColor: '#fef2f2',
                            borderLeft: '4px solid #ef4444',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.5rem',
                            color: '#991b1b',
                            borderRadius: '4px',
                            fontSize: '0.875rem'
                        }}>
                            <AlertCircle size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                                Phone Number
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }}>
                                    <Phone size={18} />
                                </div>
                                <input
                                    type="tel"
                                    value={phone_number}
                                    onChange={(e) => setPhoneNumber(e.target.value)}
                                    placeholder="Enter registered phone"
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 500, color: '#334155', marginBottom: '0.5rem' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '12px', top: '10px', color: '#94a3b8' }}>
                                    <Lock size={18} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    style={{
                                        width: '100%',
                                        padding: '10px 10px 10px 40px',
                                        borderRadius: '6px',
                                        border: '1px solid #cbd5e1',
                                        fontSize: '1rem',
                                        boxSizing: 'border-box'
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                marginTop: '0.5rem',
                                width: '100%',
                                padding: '12px',
                                backgroundColor: '#2563eb',
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '1rem',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                opacity: loading ? 0.7 : 1,
                                transition: 'background-color 0.2s',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </button>
                    </form>
                </div>
            </div>
            <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
                &copy; {new Date().getFullYear()} Karthik Electrical Services.<br />All rights reserved.
            </div>
        </div>
    );
};

export default OwnerLogin;
