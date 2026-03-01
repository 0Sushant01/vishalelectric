import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getComplaintDetail, updateComplaint } from '../api/complaints';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const [editData, setEditData] = useState({
        status: '',
        charge: '',
        amount_paid: '',
        payment_mode: ''
    });

    useEffect(() => {
        fetchComplaint();
    }, [id]);

    const fetchComplaint = async () => {
        try {
            setLoading(true);
            const res = await getComplaintDetail(id);
            setComplaint(res.data);
            setEditData({
                status: res.data.status || 'PENDING',
                charge: res.data.charge || 0,
                amount_paid: res.data.amount_paid || 0,
                payment_mode: res.data.payment_mode || ''
            });
        } catch (err) {
            console.error(err);
            setError('Failed to load complaint details.');
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEditData({
            ...editData,
            [name]: value
        });
    };

    const handleSave = async () => {
        try {
            setSaving(true);
            setError('');
            setSuccess('');

            // Validation
            if (parseFloat(editData.amount_paid) > parseFloat(editData.charge)) {
                setError('Amount paid cannot exceed total charge.');
                setSaving(false);
                return;
            }

            const payload = {
                status: editData.status,
                charge: editData.charge,
                amount_paid: editData.amount_paid || null,
                payment_mode: editData.payment_mode || null
            };

            await updateComplaint(id, payload);
            setSuccess('Complaint updated successfully!');
            // Refresh details
            fetchComplaint();
        } catch (err) {
            console.error(err);
            if (err.response && err.response.data) {
                // Formatting DRF errors easily readable
                const messages = Object.values(err.response.data).map(val => Array.isArray(val) ? val[0] : val).join(' ');
                setError(messages || 'Failed to update complaint.');
            } else {
                setError('Failed to update complaint.');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ color: 'var(--text-muted)' }}>Loading Details...</div>
        </div>
    );

    if (!complaint) return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
            Complaint not found.
        </div>
    );

    const balance = (parseFloat(complaint.charge || 0) - parseFloat(complaint.amount_paid || 0)).toFixed(2);

    return (
        <div className="fade-in" style={{ paddingBottom: '2rem' }}>
            <header className="dashboard-header" style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate(-1)}
                        style={{ padding: '0.4rem 0.6rem' }}
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Complaint #{complaint.id}</h1>
                        <p style={{ color: 'var(--text-muted)' }}>{complaint.issue_category} • {new Date(complaint.created_at).toLocaleString()}</p>
                    </div>
                </div>
            </header>

            {error && (
                <div style={{ backgroundColor: '#fef2f2', borderLeft: '4px solid #ef4444', padding: '1rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#991b1b', borderRadius: '4px' }}>
                    <AlertCircle size={18} />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div style={{ backgroundColor: '#f0fdf4', borderLeft: '4px solid #22c55e', padding: '1rem', marginBottom: '1.5rem', color: '#166534', borderRadius: '4px' }}>
                    {success}
                </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                {/* Customer Details */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Customer Details</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Name</span>
                            <div style={{ fontWeight: 500 }}>{complaint.customer?.full_name || 'N/A'}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Phone</span>
                            <div style={{ fontWeight: 500 }}>{complaint.customer?.phone_number || 'N/A'}</div>
                        </div>
                        <div>
                            <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Address</span>
                            <div>{complaint.address}</div>
                        </div>
                    </div>
                </div>

                {/* Complaint Details & Edit */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Issue & Status Management</h3>

                    <div style={{ marginBottom: '1.5rem' }}>
                        <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Description</span>
                        <div style={{ marginTop: '0.25rem', padding: '0.75rem', backgroundColor: '#f8fafc', borderRadius: '4px', border: '1px solid #e2e8f0' }}>
                            {complaint.issue_description}
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Status</label>
                            <select name="status" value={editData.status} onChange={handleChange}>
                                <option value="PENDING">Pending</option>
                                <option value="ASSIGNED">Assigned</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Financials Edit */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.125rem', marginBottom: '1rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Financials</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Total Charge (₹)</label>
                            <input
                                type="number"
                                name="charge"
                                value={editData.charge}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0" step="0.01"
                            />
                        </div>
                        <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Amount Paid (₹)</label>
                            <input
                                type="number"
                                name="amount_paid"
                                value={editData.amount_paid}
                                onChange={handleChange}
                                placeholder="0.00"
                                min="0" step="0.01"
                            />
                        </div>
                    </div>

                    <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                        <label>Payment Mode</label>
                        <select name="payment_mode" value={editData.payment_mode} onChange={handleChange}>
                            <option value="">Select Mode...</option>
                            <option value="UPI">UPI</option>
                            <option value="CARD">CARD</option>
                            <option value="CASH">CASH</option>
                        </select>
                    </div>

                    <div style={{ padding: '1rem', backgroundColor: parseFloat(balance) > 0 ? '#fffef2' : '#f0fdf4', border: `1px solid ${parseFloat(balance) > 0 ? '#fde047' : '#bbf7d0'}`, borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: 500, color: 'var(--text-muted)' }}>Remaining Balance:</span>
                        <span style={{ fontSize: '1.25rem', fontWeight: 700, color: parseFloat(balance) > 0 ? '#ea580c' : '#16a34a' }}>
                            ₹{balance}
                        </span>
                    </div>

                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn btn-primary"
                            onClick={handleSave}
                            disabled={saving}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
                        >
                            <Save size={18} />
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetail;
