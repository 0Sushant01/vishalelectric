import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAnalytics, getComplaints } from '../api/complaints';
import { logoutAdmin } from '../api/auth';
import {
    BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
    LayoutDashboard,
    Banknote,
    BadgeIndianRupee,
    Wallet,
    Users,
    TrendingUp,
    LogOut,
    ArrowLeft,
    X,
    Calendar
} from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6'];

const Analytics = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalConfig, setModalConfig] = useState({ title: '', columns: [], data: [] });
    const [modalLoading, setModalLoading] = useState(false);
    const [complaintsData, setComplaintsData] = useState(null);

    // Date Range State
    const getDaysAgo = (days) => {
        const d = new Date();
        d.setDate(d.getDate() - days);
        return d.toISOString().split('T')[0];
    };

    const [startDate, setStartDate] = useState(getDaysAgo(7));
    const [endDate, setEndDate] = useState(getDaysAgo(0));

    const navigate = useNavigate();

    useEffect(() => {
        setComplaintsData(null); // invalidate cache on date change
        fetchAnalytics();
    }, [startDate, endDate]);

    const fetchAnalytics = async () => {
        setLoading(true);
        try {
            const response = await getAnalytics({ start_date: startDate, end_date: endDate });
            setData(response.data);
        } catch (err) {
            console.error('Failed to fetch analytics:', err);
            setError('Failed to load analytics data. Ensure you have the correct permissions.');
            if (err.response && err.response.status === 401) {
                navigate('/owner-login');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await logoutAdmin();
        navigate('/owner-login');
    };

    const handleCardClick = async (type) => {
        setIsModalOpen(true);
        setModalLoading(true);
        setModalConfig({ title: `Loading...`, columns: [], data: [] });

        try {
            let allComplaints = complaintsData;
            if (!allComplaints) {
                const response = await getComplaints({ start_date: startDate, end_date: endDate });
                allComplaints = response.data;
                setComplaintsData(allComplaints);
            }

            let filteredData = [];
            let columns = [];
            let title = '';

            switch (type) {
                case 'total_complaints':
                    title = 'Total Complaints';
                    columns = ['ID', 'Customer', 'Category', 'Status', 'Date'];
                    filteredData = allComplaints.map(c => ({
                        ID: `#${c.id}`,
                        Customer: c.customer_name,
                        Category: c.issue_category || 'Other',
                        Status: c.status,
                        Date: new Date(c.created_at).toLocaleDateString()
                    }));
                    break;
                case 'total_customers':
                    title = 'Total Customers';
                    columns = ['Customer Name', 'Phone', 'Address'];
                    const uniqueCustomers = [];
                    const seenPhones = new Set();
                    allComplaints.forEach(c => {
                        if (c.phone && !seenPhones.has(c.phone)) {
                            seenPhones.add(c.phone);
                            uniqueCustomers.push({
                                'Customer Name': c.customer_name,
                                'Phone': c.phone,
                                'Address': c.address
                            });
                        }
                    });
                    filteredData = uniqueCustomers;
                    break;
                case 'total_revenue':
                    title = 'Total Revenue Generated (Include All Services)';
                    columns = ['ID', 'Customer', 'Status', 'Charge'];
                    filteredData = allComplaints.filter(c => parseFloat(c.charge || 0) > 0).map(c => ({
                        ID: `#${c.id}`,
                        Customer: c.customer_name,
                        Status: c.status,
                        Charge: `₹${parseFloat(c.charge).toLocaleString()}`
                    }));
                    break;
                case 'total_collected':
                    title = 'Total Collected Amount';
                    columns = ['ID', 'Customer', 'Status', 'Collected'];
                    filteredData = allComplaints.filter(c => parseFloat(c.amount_paid || 0) > 0).map(c => ({
                        ID: `#${c.id}`,
                        Customer: c.customer_name,
                        Status: c.status,
                        Collected: `₹${parseFloat(c.amount_paid).toLocaleString()}`
                    }));
                    break;
                case 'pending_amount':
                    title = 'Pending Amount Dues';
                    columns = ['ID', 'Customer', 'Charge', 'Paid', 'Pending'];
                    filteredData = allComplaints.filter(c => {
                        const charge = parseFloat(c.charge || 0);
                        const paid = parseFloat(c.amount_paid || 0);
                        return charge > paid;
                    }).map(c => {
                        const charge = parseFloat(c.charge || 0);
                        const paid = parseFloat(c.amount_paid || 0);
                        return {
                            ID: `#${c.id}`,
                            Customer: c.customer_name,
                            Charge: `₹${charge.toLocaleString()}`,
                            Paid: `₹${paid.toLocaleString()}`,
                            Pending: `₹${(charge - paid).toLocaleString()}`
                        };
                    });
                    break;
                case 'average_charge':
                    title = 'Service Call Breakdown (Average Base)';
                    columns = ['ID', 'Customer', 'Category', 'Charge'];
                    filteredData = allComplaints.filter(c => parseFloat(c.charge || 0) > 0).map(c => ({
                        ID: `#${c.id}`,
                        Customer: c.customer_name,
                        Category: c.issue_category || 'Other',
                        Charge: `₹${parseFloat(c.charge).toLocaleString()}`
                    }));
                    break;
                default:
                    break;
            }

            setModalConfig({ title, columns, data: filteredData });

        } catch (err) {
            console.error('Failed to fetch modal data:', err);
            setModalConfig({ title: 'Error loading data', columns: [], data: [] });
        } finally {
            setModalLoading(false);
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="fade-in" style={{ color: 'var(--text-muted)' }}>Generating Insights...</div>
        </div>
    );

    if (error) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: '#ef4444' }}>
            <div className="fade-in">{error}</div>
        </div>
    );

    const { summary, status_breakdown, category_breakdown, revenue_trend } = data;

    // Transform status breakdown for PieChart
    const statusData = Object.keys(status_breakdown).map(key => ({
        name: key.replace('_', ' '),
        value: status_breakdown[key]
    })).filter(item => item.value > 0);

    return (
        <div className="fade-in">
            <header className="dashboard-header">
                <div>
                    <button
                        className="btn btn-outline"
                        onClick={() => navigate('/owner_dashbord')}
                        style={{ padding: '0.4rem 0.75rem', marginBottom: '1rem', display: 'inline-flex' }}
                    >
                        <ArrowLeft size={16} />
                        <span style={{ marginLeft: '0.5rem' }}>Back to Dashboard</span>
                    </button>
                    <div className="dashboard-title">
                        <h1>Business Analytics</h1>
                        <p>Performance & Financial Insights</p>
                    </div>
                </div>

                <div className="dashboard-actions">
                    <button className="btn btn-outline" onClick={handleLogout} style={{ color: '#ef4444', borderColor: '#fca5a5' }}>
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            </header>

            {/* Date Range Filter */}
            <div className="card" style={{ marginBottom: '2rem', padding: '1rem', display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#1e293b', fontWeight: 600 }}>
                    <Calendar size={18} style={{ color: '#2563eb' }} />
                    <span>Filter Data Range:</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Start Date</label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            max={endDate}
                            style={{ padding: '0.5rem 0.75rem', height: 'auto' }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                        <label style={{ fontSize: '0.75rem', marginBottom: '4px' }}>End Date</label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            min={startDate}
                            style={{ padding: '0.5rem 0.75rem', height: 'auto' }}
                        />
                    </div>
                </div>
            </div>

            {/* SECTION 1: Financial Summary Cards */}
            <div className="stats-grid" style={{ marginBottom: '2rem' }}>
                <div className="stat-card clickable-card" onClick={() => handleCardClick('total_complaints')}>
                    <div className="stat-icon" style={{ backgroundColor: '#eff6ff', color: '#2563eb' }}>
                        <LayoutDashboard size={20} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Complaints</h3>
                        <div className="value">{summary.total_complaints}</div>
                    </div>
                </div>
                <div className="stat-card clickable-card" onClick={() => handleCardClick('total_customers')}>
                    <div className="stat-icon" style={{ backgroundColor: '#f5f3ff', color: '#8b5cf6' }}>
                        <Users size={20} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Customers</h3>
                        <div className="value">{summary.total_customers}</div>
                    </div>
                </div>
                <div className="stat-card clickable-card" onClick={() => handleCardClick('total_revenue')}>
                    <div className="stat-icon" style={{ backgroundColor: '#f0fdf4', color: '#16a34a' }}>
                        <Banknote size={20} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Revenue</h3>
                        <div className="value">₹{summary.total_revenue.toLocaleString()}</div>
                    </div>
                </div>
                <div className="stat-card clickable-card" onClick={() => handleCardClick('total_collected')}>
                    <div className="stat-icon" style={{ backgroundColor: '#fffbeb', color: '#d97706' }}>
                        <BadgeIndianRupee size={20} />
                    </div>
                    <div className="stat-info">
                        <h3>Total Collected</h3>
                        <div className="value">₹{summary.total_collected.toLocaleString()}</div>
                    </div>
                </div>
                <div className="stat-card clickable-card" onClick={() => handleCardClick('pending_amount')}>
                    <div className="stat-icon" style={{ backgroundColor: '#fef2f2', color: '#dc2626' }}>
                        <Wallet size={20} />
                    </div>
                    <div className="stat-info">
                        <h3>Pending Amount</h3>
                        <div className="value">₹{summary.pending_amount.toLocaleString()}</div>
                    </div>
                </div>
                <div className="stat-card clickable-card" onClick={() => handleCardClick('average_charge')}>
                    <div className="stat-icon" style={{ backgroundColor: '#f0f9ff', color: '#0284c7' }}>
                        <TrendingUp size={20} />
                    </div>
                    <div className="stat-info">
                        <h3>Average Charge</h3>
                        <div className="value">₹{Math.round(summary.average_charge).toLocaleString()}</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>

                {/* SECTION 2: Revenue Trend */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.125rem' }}>Revenue Growth (MoM)</h3>
                    <div style={{ height: 300 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={revenue_trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="month" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(value) => `₹${value}`} />
                                <RechartsTooltip
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [`₹${value.toLocaleString()}`, 'Revenue']}
                                />
                                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* SECTION 3: Status Distribution */}
                <div className="card" style={{ padding: '1.5rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.125rem' }}>Fulfillment Pipeline Map</h3>
                    <div style={{ height: 300 }}>
                        {statusData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <RechartsTooltip
                                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>No data to display</div>
                        )}
                    </div>
                </div>

                {/* SECTION 4: Category Breakdown */}
                <div className="card" style={{ padding: '1.5rem', gridColumn: '1 / -1' }}>
                    <h3 style={{ marginBottom: '1.5rem', color: '#1e293b', fontSize: '1.125rem' }}>Service Call Demographics</h3>
                    <div style={{ height: 350 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={category_breakdown} margin={{ top: 20, right: 30, left: 20, bottom: 5 }} barSize={40}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                                <XAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} />
                                <RechartsTooltip
                                    cursor={{ fill: '#f8fafc' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    formatter={(value) => [value, 'Complaints']}
                                />
                                <Bar dataKey="count" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="data-modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="data-modal-card" onClick={(e) => e.stopPropagation()}>
                        <div className="data-modal-header">
                            <h2>{modalConfig.title}</h2>
                            <button className="modal-close" onClick={() => setIsModalOpen(false)}>
                                <X size={24} />
                            </button>
                        </div>
                        <div className="data-modal-body">
                            {modalLoading ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>Loading records...</div>
                            ) : modalConfig.data.length === 0 ? (
                                <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>No records found.</div>
                            ) : (
                                <div className="table-container">
                                    <table>
                                        <thead>
                                            <tr>
                                                {modalConfig.columns.map((col, idx) => (
                                                    <th key={idx}>{col}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {modalConfig.data.map((row, rIndex) => (
                                                <tr key={rIndex} className="table-row-hover">
                                                    {modalConfig.columns.map((col, cIndex) => (
                                                        <td key={cIndex} style={{ fontWeight: cIndex === 0 && col === 'ID' ? 600 : 'normal', color: cIndex === 0 && col === 'ID' ? '#64748b' : 'inherit' }}>
                                                            {row[col]}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;
