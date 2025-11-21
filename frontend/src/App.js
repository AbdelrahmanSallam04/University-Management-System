import React from "react";
import AppRoutes from "./routes/AppRoutes";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import './App.css';
import StudentDashboard from "./components/StudentDashboard";
import CoursesCatalog from "./components/CoursesCatalog";

function App() {
    return (
        <Router>
            <div className="App">
                <Routes>
                    {/* Simple routes - no authentication checks */}
                    <Route path="/login" element={<Login />} />



                    {/*CHANGE THESE PATHS WHEN THE DASHBOARDS ARE DONE!!!!!!!!!!!!!!!!!*/}
                    <Route path="/professor-dashboard" element={<StudentDashboard />} />
                    <Route path="/admin-dashboard" element={<StudentDashboard />} />
                    <Route path="/student-dashboard" element={<StudentDashboard />} />
                    <Route path="/course-catalog" element={<CoursesCatalog />} />



                    {/* Default route - always go to login */}
                    <Route path="/" element={<Navigate to="/login" />} />

                    {/* Catch-all route for unknown paths */}
                    <Route path="*" element={<Navigate to="/login" />} />
                </Routes>
            </div>
        </Router>
    );
}
//const App = () => <AppRoutes />;

export default App;
