import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentDashboard from "../components/StudentDashboard";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
