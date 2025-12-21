import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import '../App.css';
import StudentDashboard from "../components/StudentDashboard";
import CoursesCatalog from "../components/CoursesCatalog";
import EnrolledCoursesView from "../components/EnrolledCourses";
import ProfessorDashboard from "../components/ProfessorDashboard";
import AdminDashboard from "../pages/AdminDashboard";
import RoomCalendar from "../pages/RoomCalendar"; // make sure this import exists
import CourseAssignments from "../pages/CourseAssignments"
import AssignmentSubmission from "../pages/AssignmentSubmission"
import ExamView from '../pages/ExamView';
import ExamTaking from '../pages/ExamTaking';
import StaffDirectories from '../pages/StaffDirectories'

import ParentDashboard from "../pages/ParentDashboard";
import PublicAnnouncements from "../pages/AnnouncementsPage";
import AnnouncementDetail from "../pages/AnnouncementDetail";

const AppRoutes = () => {
  return (
      <Routes>
           <Route path="/login" element={<Login />} />
           {/* CHANGE THESE PATHS WHEN THE DASHBOARDS ARE DONE */}
           <Route path="/professor-dashboard" element={<ProfessorDashboard />} />
           <Route path="/admin-dashboard" element={<AdminDashboard />} />
           <Route path="/student-dashboard" element={<StudentDashboard />} />
           <Route path="/course-catalog" element={<CoursesCatalog />} />
           <Route path="/EnrolledCourses" element={<EnrolledCoursesView/>} /> {/* ✅ Fixed */}
          <Route path="/RoomCalendar" element={<RoomCalendar/>} /> {/* ✅ Fixed */}
          <Route path="/course/:courseId/assignments" element={<CourseAssignments />} />
           <Route path="/assignment/:assignmentId" element={<AssignmentSubmission />} />
           <Route path="/exams" element={<ExamView />} />
           <Route path="/exam/:examId" element={<ExamTaking />} />
           <Route path="/StaffDirectories" element={<StaffDirectories />} />

          <Route path="/parent-dashboard" element={<ParentDashboard />} /> {/* Add this route */}
          <Route path="/public-announcements" element={<PublicAnnouncements />} />
          <Route path="/announcements/:id" element={<AnnouncementDetail />} />




           {/* Default route - always go to login */}
           <Route path="/" element={<Navigate to="/login" />} />

        {/* Catch-all route for unknown paths */}
           <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
  );
};

export default AppRoutes;