import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EnrolledCoursesView from './components/EnrolledCourses.jsx'; // <-- Your new component//


function App() {
  return (
      // We use the Router to handle navigation
      <Router>
        <Routes>


          <Route path="/" element={<EnrolledCoursesView />} />


        </Routes>
      </Router>
  );
}

export default App;