import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import StaffDashboard from "./StaffDashboard";

const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('staff'));
        
        // If no user is logged in, redirect to the login page
        if (!user) {
            navigate('/login');
        }
    }, [navigate]);

    const user = JSON.parse(localStorage.getItem('staff'));

    // Render either AdminDashboard or StaffDashboard based on user role
    return user?.role === 'admin' || user?.role === 'dhead' ? <AdminDashboard /> : <StaffDashboard />;
};

export default Dashboard;
