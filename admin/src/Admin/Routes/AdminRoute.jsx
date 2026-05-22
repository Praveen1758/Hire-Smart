

import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import ClippedDrawer from '../components/ClippedDrawer';
import AddCategory from '../components/AddCategory';
import Dashboard from '../components/Dashboard'
import ViewCategory from '../components/ViewCategory';

import AddSubCategory from '../components/AddSubCategory';
import ViewSubcategory from '../components/ViewSubcategory';

import AdminLogin from '../components/AdminLogin';
import ManageCompany from '../components/ManageCompany';
import ViewPayments from '../components/ViewPayments';
import ViewFeedback from '../components/ViewFeedback';
import ViewUser from '../components/Viewuser';

export default function AdminRoute() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Check if admin is authenticated by verifying the presence of a token
    const token = localStorage.getItem('AdminToken');
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
          <Route path="/AddCategory" element={<AddCategory />} />
          <Route path="/ViewCategory" element={<ViewCategory />} />
         
          <Route path="/ViewSubcategory" element={<ViewSubcategory />} />
         
          <Route path="/AddSubCategory" element={<AddSubCategory />} />
         
          <Route path="/ManageCompany" element={<ManageCompany />} />
          <Route path="/Viewuser" element={<ViewUser />} />
          <Route path="/ViewPayments" element={<ViewPayments />} />
          <Route path="/ViewFeedback" element={<ViewFeedback />} />
         

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </ClippedDrawer>
    ) : (
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        {/* <Route path="*" element={<Navigate to="/Admin/Dashboard" />} /> */}
      </Routes>
    )
  );
}
