


import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';



import Dashboard from '../components/Dashboard';


import ClippedDrawer from '../components/ClippedDrawer';

import CompanyLogin from '../components/CompanyLogin';

import CompanyRegister from '../components/CompanyRegister';
import JobList from '../components/JobList';
import AddJob from '../components/AddJob';
import ViewJobs from '../components/ViewJobs';
import ApplicationDetails from '../components/ApplicationDetails';
import ManagePayment from '../components/ManagePayment';

export default function CompanyRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if admin is authenticated by verifying the presence of a token
    const token = localStorage.getItem('CompanyToken');
    if (token) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [location]);

  return (
    isAuthenticated ? (
      <ClippedDrawer>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/JobList" element={<JobList />} />
          <Route path="/AddJob" element={<AddJob />} />
          <Route path="/ViewJobs" element={<ViewJobs />} />
          <Route path="/ManagePayment" element={<ManagePayment />} />
         <Route path="/ApplicationDetails" element={<ApplicationDetails />} />

          
       

          <Route path="*" element={<Navigate to="/Company/" />} />
        </Routes>
      </ClippedDrawer>
    ) : (
      <Routes>
        <Route path="/" element={<CompanyLogin />} />
         <Route path="/CompanyRegister" element={<CompanyRegister />} />
        {/* <Route path="*" element={<Navigate to="/Admin/Dashboard" />} /> */}
      </Routes>
    )
  );
}
