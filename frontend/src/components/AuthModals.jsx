import React, { useState, useEffect } from 'react';
import { X, Smartphone, User, Lock, ArrowRight, CheckCircle, ShieldCheck } from 'lucide-react';
import api from '../api/axios';

const AuthModals = ({ isOpen, onClose, initialMode = 'login', onAuthSuccess }) => {
    const [mode, setMode] = useState(initialMode); // 'login' | 'register' | 'otp'
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        phone_number: '',
        full_name: '',
        password: '',
        password_confirm: '',
        otp_code: ''
    });

    useEffect(() => {
        if (isOpen) {
            setMode(initialMode);
            setError(null);
        }
    }, [isOpen, initialMode]);

    if (!isOpen) return null;

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if ((name === 'phone_number' || name === 'otp_code') && !/^\d*$/.test(value)) return;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('accounts/register/', {
                phone_number: formData.phone_number,
                full_name: formData.full_name,
                password: formData.password,
                password_confirm: formData.password_confirm
            });
            setMode('otp');
        } catch (err) {
            if (err.response && err.response.data) {
                setError(Object.values(err.response.data).flat().join(', '));
            } else {
                setError("Connection failed. Ensure backend is running.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleVerifyOTP = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('accounts/verify-otp/', {
                phone_number: formData.phone_number,
                code: formData.otp_code
            });
            const data = response.data;
            onAuthSuccess(data.user);
            onClose();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Verification failed or connection error.");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            const response = await api.post('accounts/login/', {
                phone_number: formData.phone_number,
                password: formData.password
            });
            const data = response.data;
            onAuthSuccess(data.user);
            onClose();
        } catch (err) {
            if (err.response && err.response.data && err.response.data.error) {
                setError(err.response.data.error);
            } else {
                setError("Invalid credentials or connection error.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-modal-overlay">
            <div className="auth-modal-card slide-up">
                <button className="modal-close" onClick={onClose}><X size={24} /></button>

                <div className="auth-modal-header">
                    <div className="auth-icon-wrapper">
                        {mode === 'otp' ? <ShieldCheck size={32} color="#2563eb" /> : <Smartphone size={32} color="#2563eb" />}
                    </div>
                    <div className="auth-brand-name">Karthik Electricals</div>
                    <h2>{mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Join Us' : 'Verify Phone'}</h2>
                    <p>{mode === 'login' ? 'Enter your details to continue' : mode === 'register' ? 'Create an account to track requests' : 'Enter the 6-digit code sent to your terminal'}</p>
                </div>

                {error && <div className="auth-error-msg fade-in">{error}</div>}

                {mode === 'login' && (
                    <form onSubmit={handleLogin} className="auth-form">
                        <div className="auth-input-group">
                            <Smartphone size={18} className="input-icon" />
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                required
                                maxLength="10"
                            />
                        </div>
                        <div className="auth-input-group">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Password"
                                required
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Authenticating...' : 'Login Now'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                        <p className="auth-switch-p">
                            Already have an account? <button type="button" onClick={() => setMode('register')}>Register</button>
                        </p>
                    </form>
                )}

                {mode === 'register' && (
                    <form onSubmit={handleRegister} className="auth-form">
                        <div className="auth-input-group">
                            <User size={18} className="input-icon" />
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                placeholder="Full Name"
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <Smartphone size={18} className="input-icon" />
                            <input
                                type="tel"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleInputChange}
                                placeholder="Phone Number"
                                required
                                maxLength="10"
                            />
                        </div>
                        <div className="auth-input-group">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Create Password"
                                required
                            />
                        </div>
                        <div className="auth-input-group">
                            <Lock size={18} className="input-icon" />
                            <input
                                type="password"
                                name="password_confirm"
                                value={formData.password_confirm}
                                onChange={handleInputChange}
                                placeholder="Confirm Password"
                                required
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Processing...' : 'Register'}
                            {!loading && <ArrowRight size={18} />}
                        </button>
                        <p className="auth-switch-p">
                            Buying registered? <button type="button" onClick={() => setMode('login')}>Login</button>
                        </p>
                    </form>
                )}

                {mode === 'otp' && (
                    <form onSubmit={handleVerifyOTP} className="auth-form">
                        <div className="auth-input-group otp-group">
                            <input
                                type="text"
                                name="otp_code"
                                value={formData.otp_code}
                                onChange={handleInputChange}
                                placeholder="· · · · · ·"
                                required
                                maxLength="6"
                                className="otp-input"
                            />
                        </div>
                        <button type="submit" className="auth-submit-btn" disabled={loading}>
                            {loading ? 'Verifying...' : 'Verify & Continue'}
                            {!loading && <CheckCircle size={18} />}
                        </button>
                        <p className="auth-switch-p">
                            Didn't get code? <button type="button" onClick={() => setMode('register')}>Change Number</button>
                        </p>
                    </form>
                )}
            </div>
        </div>
    );
};

export default AuthModals;
