import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import StudentDashboard from "../components/StudentDashboard";
import CoursesCatalog from "../components/CoursesCatalog";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<StudentDashboard />} />
        <Route path= "/course-catalog" element={<CoursesCatalog />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
