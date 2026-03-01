import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-container">
                <NavLink to="/dashboard" className="navbar-brand">
                    KARTHIK ELECTRICAL
                </NavLink>
                <div className="navbar-nav">
                    <NavLink
                        to="/raise-complaint"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Raise Complaint
                    </NavLink>
                    <NavLink
                        to="/owner_dashbord"
                        className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                    >
                        Owner Dashboard
                    </NavLink>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
