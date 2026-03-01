import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '20px',
            backgroundColor: '#f5f7fa',
            fontFamily: 'Inter, sans-serif'
        }}>
            <h1 style={{ color: '#111827', marginBottom: '2rem' }}>Welcome to Karthik Electrical</h1>

            <button
                onClick={() => navigate('/raise-complaint')}
                style={{
                    padding: '15px 30px',
                    fontSize: '1.2rem',
                    backgroundColor: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '300px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#2563eb'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#3b82f6'}
            >
                Raise Complaint
            </button>

            <button
                onClick={() => navigate('/owner_dashbord')}
                style={{
                    padding: '15px 30px',
                    fontSize: '1.2rem',
                    backgroundColor: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    width: '300px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                    transition: 'background-color 0.2s'
                }}
                onMouseOver={(e) => e.target.style.backgroundColor = '#059669'}
                onMouseOut={(e) => e.target.style.backgroundColor = '#10b981'}
            >
                Owner Dashboard
            </button>
        </div>
    );
};

export default Home;
