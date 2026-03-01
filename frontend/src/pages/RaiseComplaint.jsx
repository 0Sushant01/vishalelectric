import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createComplaint } from '../api/complaints';
import { logoutAdmin } from '../api/auth';
import api from '../api/axios';
import { Send, CheckCircle, AlertCircle, LogIn, UserPlus, ShieldCheck, LogOut } from 'lucide-react';
import AuthModals from '../components/AuthModals';

const RaiseComplaint = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        customer_name: '',
        phone: '',
        address: '',
        issue_category: '',
        issue_description: '',
    });
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null); // 'success' | 'error' | null
    const [errorMessage, setErrorMessage] = useState('');
    const [showSplash, setShowSplash] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [authModal, setAuthModal] = useState({ isOpen: false, mode: 'login' });

    useEffect(() => {
        const verifyAuth = async () => {
            try {
                const response = await api.get('accounts/auth-status/');
                const data = response.data;

                if (data.is_authenticated) {
                    setIsLoggedIn(true);
                    setFormData(prev => ({
                        ...prev,
                        phone: data.user.phone_number,
                        customer_name: data.user.full_name || prev.customer_name
                    }));
                }
            } catch (error) {
                // Not authenticated
                console.log("No active secure session found.");
            }
        };
        verifyAuth();

        const handleUnauthorized = () => {
            setIsLoggedIn(false);
            setFormData(prev => ({ ...prev, phone: '', customer_name: '' }));
            setAuthModal({ isOpen: true, mode: 'login' });
        };
        window.addEventListener('unauthorized', handleUnauthorized);

        const timer = setTimeout(() => {
            setShowSplash(false);
        }, 3000); // 3 seconds splash

        return () => {
            clearTimeout(timer);
            window.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, []);

    const handleLogout = async () => {
        await logoutAdmin();
        window.dispatchEvent(new Event('unauthorized'));
    };

    const issueCategories = [
        'Repair',
        'Installation',
        'Maintenance',
        'Wiring Issue',
        'Other'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus(null);
        setErrorMessage('');
        try {
            await createComplaint(formData);
            setStatus('success');
            setFormData(prev => ({
                customer_name: prev.customer_name, // keep logged in context
                phone: prev.phone,                 // keep logged in context
                address: '',
                issue_category: '',
                issue_description: '',
            }));
        } catch (error) {
            setStatus('error');
            if (error.response && error.response.data && error.response.data.error) {
                setErrorMessage(error.response.data.error);
            } else {
                setErrorMessage('Error submitting request. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {showSplash && (
                <div className={`splash-overlay ${!showSplash ? 'splash-exit' : ''}`}>
                    <h1 className="splash-logo">
                        {["Welcome", "to", "Karthik", "Electricals"].map((word, i) => (
                            <span key={i} className="word-wrapper">
                                <span className="animated-word" style={{ animationDelay: `${0.2 + i * 0.1}s` }}>
                                    {word}
                                </span>
                            </span>
                        ))}
                    </h1>
                    <p className="splash-text slide-up" style={{ animationDelay: '0.8s' }}>
                        We are happy to assist you. Kindly fill the details below to continue.
                    </p>
                </div>
            )}

            <div className={`complaint-container ${!showSplash ? 'form-reveal' : ''}`} style={{ visibility: showSplash ? 'hidden' : 'visible' }}>
                <div className="complaint-card">
                    <header>
                        <h1>Welcome To Karthik Electricals</h1>
                        <div className="subtitle">We are happy to assist you kindly fill the details below to continue</div>
                    </header>

                    {status === 'success' && (
                        <div className="status-toast success">
                            <CheckCircle size={16} />
                            <span>Request submitted successfully!</span>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="status-toast error">
                            <AlertCircle size={16} />
                            <span>{errorMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="customer_name">Full Name</label>
                            <input
                                id="customer_name"
                                type="text"
                                name="customer_name"
                                placeholder="e.g. John Doe"
                                value={formData.customer_name}
                                onChange={handleChange}
                                required
                                disabled={isLoggedIn}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone Number</label>
                            <input
                                id="phone"
                                type="tel"
                                name="phone"
                                placeholder="Enter your contact number"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                disabled={isLoggedIn}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="address">Service Address</label>
                            <textarea
                                id="address"
                                name="address"
                                placeholder="Address where service is needed"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="issue_category">Issue Category</label>
                            <select
                                id="issue_category"
                                name="issue_category"
                                value={formData.issue_category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">-- Select Category --</option>
                                {issueCategories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="issue_description">Describe the problem</label>
                            <textarea
                                id="issue_description"
                                name="issue_description"
                                placeholder="Tell us what needs to be fixed..."
                                value={formData.issue_description}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="form-footer">
                            {isLoggedIn ? (
                                <div className="btn-group">
                                    <button type="submit" className="btn-primary" disabled={loading}>
                                        {loading ? 'Submitting...' : (
                                            <>
                                                <Send size={20} />
                                                Submit Request
                                            </>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={handleLogout}
                                        style={{ color: '#ef4444', borderColor: '#fca5a5' }}
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="btn-group">
                                    <button
                                        type="button"
                                        className="btn-secondary"
                                        onClick={() => setAuthModal({ isOpen: true, mode: 'login' })}
                                    >
                                        <LogIn size={18} />
                                        LOGIN
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-primary"
                                        onClick={() => setAuthModal({ isOpen: true, mode: 'register' })}
                                    >
                                        <UserPlus size={18} />
                                        REGISTER
                                    </button>
                                </div>
                            )}
                        </div>
                    </form>
                </div>
            </div>

            <AuthModals
                isOpen={authModal.isOpen}
                onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))}
                initialMode={authModal.mode}
                onAuthSuccess={(user) => {
                    setIsLoggedIn(true);
                    setFormData(prev => ({
                        ...prev,
                        phone: user.phone_number,
                        customer_name: user.full_name || prev.customer_name
                    }));
                }}
            />
        </>
    );
};

export default RaiseComplaint;
