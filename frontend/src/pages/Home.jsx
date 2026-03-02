import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Wrench, Fan, Snowflake, Refrigerator, Cable, ToggleRight, CheckCircle, MapPin, Phone, MessageCircle } from 'lucide-react';

const Home = () => {
    const navigate = useNavigate();
    const [introStage, setIntroStage] = useState('center'); // 'center' -> 'moving' -> 'done'

    useEffect(() => {
        // Start animation after a short delay
        const timer1 = setTimeout(() => {
            setIntroStage('moving');
            const timer2 = setTimeout(() => {
                setIntroStage('done');
            }, 1000); // 1s for the move transition
            return () => clearTimeout(timer2);
        }, 2500); // 2.5s showing in center

        return () => clearTimeout(timer1);
    }, []);

    const isIntro = introStage !== 'done';

    return (
        <div style={{
            fontFamily: "'Inter', sans-serif",
            minHeight: '100vh',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            overflowX: 'hidden',
            position: 'relative'
        }}>
            {/* Global Styles for Animations */}
            <style>
                {`
                    @keyframes fadeUp {
                        from { opacity: 0; transform: translateY(30px); }
                        to { opacity: 1; transform: translateY(0); }
                    }
                    @keyframes pulseGlow {
                        0% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
                        50% { box-shadow: 0 0 25px rgba(56, 189, 248, 0.5); }
                        100% { box-shadow: 0 0 15px rgba(56, 189, 248, 0.2); }
                    }
                    .service-card {
                        background: rgba(255, 255, 255, 0.03);
                        border: 1px solid rgba(255, 255, 255, 0.05);
                        border-radius: 16px;
                        padding: 2rem;
                        text-align: center;
                        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                        backdrop-filter: blur(10px);
                        position: relative;
                        overflow: hidden;
                    }
                    .service-card:hover {
                        transform: translateY(-5px) scale(1.02);
                        background: rgba(255, 255, 255, 0.06);
                        border-color: rgba(56, 189, 248, 0.4);
                        box-shadow: 0 10px 30px -10px rgba(56, 189, 248, 0.2);
                    }
                    .service-card .icon-wrapper {
                        transition: transform 0.3s;
                    }
                    .service-card:hover .icon-wrapper {
                        transform: rotate(10deg);
                    }
                    
                    /* Custom Scrollbar */
                    ::-webkit-scrollbar {
                        width: 8px;
                    }
                    ::-webkit-scrollbar-track {
                        background: #0f172a; 
                    }
                    ::-webkit-scrollbar-thumb {
                        background: #334155; 
                        border-radius: 4px;
                    }
                    ::-webkit-scrollbar-thumb:hover {
                        background: #475569; 
                    }
                `}
            </style>

            {/* Background Ambient Glow */}
            <div style={{
                position: 'fixed',
                top: '0',
                left: '20%',
                width: '60vw',
                height: '60vh',
                background: 'radial-gradient(ellipse at top, rgba(56,189,248,0.1) 0%, rgba(15,23,42,0) 70%)',
                zIndex: 0,
                pointerEvents: 'none'
            }} />

            {/* Intro / Navbar Logo */}
            <div style={{
                position: introStage === 'center' ? 'fixed' : 'absolute',
                top: introStage === 'center' ? '45%' : '2rem',
                left: introStage === 'center' ? '50%' : '4rem',
                transform: introStage === 'center' ? 'translate(-50%, -50%)' : 'translate(0, 0)',
                transition: 'all 1s cubic-bezier(0.65, 0, 0.35, 1)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: introStage === 'center' ? 'center' : 'flex-start',
                zIndex: 100
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                        width: introStage === 'center' ? '60px' : '40px',
                        height: introStage === 'center' ? '60px' : '40px',
                        borderRadius: '12px',
                        background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 4px 20px rgba(14, 165, 233, 0.5)',
                        transition: 'all 1s ease'
                    }}>
                        <Activity color="white" size={introStage === 'center' ? 32 : 24} />
                    </div>
                    <div>
                        <div style={{
                            fontSize: introStage === 'center' ? '2.5rem' : '1.5rem',
                            fontWeight: 800,
                            letterSpacing: '-0.5px',
                            transition: 'all 1s ease'
                        }}>
                            Karthik<span style={{ color: '#38bdf8' }}>Electrical</span>
                        </div>
                    </div>
                </div>
                {/* Intro subtitle fades out as it moves */}
                <div style={{
                    opacity: introStage === 'center' ? 1 : 0,
                    transition: 'opacity 0.5s ease',
                    color: '#fbbf24', // Gold accent
                    marginTop: '1rem',
                    fontSize: '1.1rem',
                    fontWeight: 500,
                    letterSpacing: '1px',
                    textAlign: 'center'
                }}>
                    Trusted Local Service Since 2012
                </div>
            </div>

            {/* Navbar Items (fades in after intro) */}
            <header style={{
                opacity: introStage === 'done' ? 1 : 0,
                transition: 'opacity 0.5s ease 0.2s',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
                padding: '2.25rem 4rem',
                position: 'relative',
                zIndex: 90
            }}>
                <button
                    onClick={() => navigate('/raise-complaint')}
                    style={{
                        padding: '0.6rem 1.5rem',
                        borderRadius: '50px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.2)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.background = 'rgba(56, 189, 248, 0.1)';
                    }}
                >
                    Book Service
                </button>
            </header>

            {/* Main Content container (fades up after intro) */}
            <div style={{
                opacity: introStage === 'done' ? 1 : 0,
                transform: introStage === 'done' ? 'translateY(0)' : 'translateY(40px)',
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s',
                pointerEvents: introStage === 'done' ? 'auto' : 'none'
            }}>

                {/* Hero Section */}
                <section style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    padding: '4rem 2rem 6rem',
                    textAlign: 'center',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <h1 style={{
                        fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                        fontWeight: 800,
                        lineHeight: 1.1,
                        marginBottom: '1.5rem',
                        maxWidth: '900px',
                        letterSpacing: '-1px'
                    }}>
                        Reliable Electrical & <br />
                        <span style={{
                            background: 'linear-gradient(to right, #38bdf8, #fbbf24)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            Appliance Repair
                        </span>
                    </h1>

                    <p style={{
                        fontSize: '1.2rem',
                        color: '#94a3b8',
                        maxWidth: '600px',
                        marginBottom: '3rem',
                        lineHeight: 1.6
                    }}>
                        Professional repair services for your home appliances with quality and care. Skilled Technicians. Honest Pricing.
                    </p>

                    <button
                        onClick={() => navigate('/raise-complaint')}
                        style={{
                            padding: '1.2rem 3rem',
                            fontSize: '1.2rem',
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #0ea5e9, #2563eb)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '50px',
                            cursor: 'pointer',
                            animation: 'pulseGlow 2s infinite',
                            transition: 'transform 0.2s',
                        }}
                        onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        Book Service
                    </button>
                </section>

                {/* Services Section */}
                <section style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    padding: '0 2rem 6rem',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Our Expertise</h2>
                        <div style={{ width: '60px', height: '4px', background: '#38bdf8', margin: '0 auto', borderRadius: '2px' }} />
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                        gap: '2rem'
                    }}>
                        {/* Mixer Repair */}
                        <div className="service-card">
                            <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '16px', color: '#38bdf8', marginBottom: '1rem' }}>
                                <Wrench size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Mixer Repair</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>Expert servicing for all brands of kitchen mixers and grinders.</p>
                        </div>

                        {/* Fan Repair */}
                        <div className="service-card">
                            <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '16px', color: '#38bdf8', marginBottom: '1rem' }}>
                                <Fan size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Fan Repair</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>Ceiling, pedestal, and exhaust fan rewinding and repairs.</p>
                        </div>

                        {/* AC Service */}
                        <div className="service-card">
                            <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '16px', color: '#38bdf8', marginBottom: '1rem' }}>
                                <Snowflake size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>AC Service</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>Installation, gas refilling, and comprehensive AC maintenance, available 24x7.</p>
                        </div>

                        {/* Fridge Repair */}
                        <div className="service-card">
                            <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '16px', color: '#38bdf8', marginBottom: '1rem' }}>
                                <Refrigerator size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Fridge Repair</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>Diagnostics, compressor replacements, and cooling system fixes.</p>
                        </div>

                        {/* House Wiring */}
                        <div className="service-card">
                            <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '16px', color: '#38bdf8', marginBottom: '1rem' }}>
                                <Cable size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>House Wiring</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>Safe, reliable electrical wiring for new buildings and renovations.</p>
                        </div>

                        {/* Switchboard & Installation */}
                        <div className="service-card">
                            <div className="icon-wrapper" style={{ display: 'inline-block', padding: '1rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '16px', color: '#38bdf8', marginBottom: '1rem' }}>
                                <ToggleRight size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '0.5rem' }}>Switchboard Installs</h3>
                            <p style={{ color: '#94a3b8', fontSize: '0.95rem', lineHeight: 1.5 }}>Upgrades, MCB installations, and fault rectifications.</p>
                        </div>
                    </div>
                </section>

                {/* Why Choose Us */}
                <section style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    padding: '4rem 2rem',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <h2 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '2.5rem', textAlign: 'center' }}>Why Choose Karthik Electrical?</h2>

                        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}>
                                <CheckCircle color="#10b981" />
                                10+ Years Experienced
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}>
                                <CheckCircle color="#10b981" />
                                Affordable & Honest Pricing
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '1.1rem', fontWeight: 500 }}>
                                <CheckCircle color="#10b981" />
                                Trusted by 1000+ Customers
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer style={{
                    background: '#0a0f1d',
                    padding: '3rem 2rem',
                    borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                    position: 'relative',
                    zIndex: 10
                }}>
                    <div style={{
                        maxWidth: '1200px',
                        margin: '0 auto',
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        gap: '2rem'
                    }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #0ea5e9, #3b82f6)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <Activity color="white" size={18} />
                                </div>
                                <span style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                                    Karthik<span style={{ color: '#38bdf8' }}>Electrical</span>
                                </span>
                            </div>
                            <p style={{ color: '#64748b', maxWidth: '300px', fontSize: '0.9rem' }}>
                                Serving our community with care. Your trusted local electrical shop.
                            </p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', color: '#94a3b8' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                                <MapPin size={20} color="#38bdf8" />
                                <span style={{ maxWidth: '250px', fontSize: '0.9rem', lineHeight: 1.5 }}>
                                    123 Main Street, Local Market Area, City HQ
                                </span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <Phone size={20} color="#38bdf8" />
                                <span style={{ fontSize: '0.9rem' }}>+91 98765 43210</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <MessageCircle size={20} color="#10b981" />
                                <span style={{ fontSize: '0.9rem' }}>WhatsApp Available</span>
                            </div>
                        </div>
                    </div>

                    <div style={{
                        marginTop: '3rem',
                        paddingTop: '1.5rem',
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        textAlign: 'center',
                        color: '#475569',
                        fontSize: '0.85rem'
                    }}>
                        © {new Date().getFullYear()} Karthik Electrical. All rights reserved.
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Home;
