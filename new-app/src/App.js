import React, { Component } from 'react';
import { Routes, Route, Link } from 'react-router-dom';

import UserProfile from "./pages/Profile/Profile";
import WorkSchedule from "./pages/WorkSchedule/compact/WorkSchedule";
import FullSizeWorkSchedule from './pages/WorkSchedule/fullSize/fullSizeWorkSchedule';
import Test from './pages/WorkSchedule/test';

export default function App() {
  return (

    <Routes>
      <Route path='/profile/:id' element={<UserProfile />} />
      <Route path='/work-schedule' element={<WorkSchedule />} />
      <Route path='/fullsize-work-schedule' element={<FullSizeWorkSchedule />} />
      <Route path='/test' element={<Test />} />
    </Routes>
  );
}  
