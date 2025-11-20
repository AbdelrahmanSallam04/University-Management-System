import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Simple routes - no authentication checks */}
                    <Route path="/login" element={<Login />} />



                    {/*CHANGE THESE PATHS WHEN THE DASHBOARDS ARE DONE!!!!!!!!!!!!!!!!!*/}
                    <Route path="/professor-dashboard" element={<Login />} />
                    <Route path="/admin-dashboard" element={<Login />} />
                    <Route path="/student-dashboard" element={<Login />} />



                    {/* Default route - always go to login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Catch-all route for unknown paths */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;