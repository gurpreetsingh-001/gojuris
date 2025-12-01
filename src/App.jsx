// src/App.jsx - Fixed with Database import
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Search from './pages/Search';
import Results from './pages/Results';
import Judgement from './pages/Judgement';
import Login from './pages/Login';
import Citation from './pages/Citation';
import Virtual from './pages/Virtual';

import AIChat from './pages/AIChat';
import AISearch from './pages/AISearch';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';
import Keyword from './pages/keyword';
import Database from './pages/Database'; // ADD THIS LINE
import PricingPlans from './pages/PricingPlans';
import Nominal from './pages/Nominal';
import LatestLawPoints from './pages/Latest-LawPoints';
import LatestLaw from './pages/Latest-Law';


function App() {
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap.bundle.min.js');
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public routes - no authentication required */}
          <Route path="/" element={
            <>
              <Header />
              <main className="page-wrapper">
                <Home />
              </main>
              <Footer />
            </>
          } />
          
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Protected routes - authentication required */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Header />
              <main className="page-wrapper">
                <Dashboard />
              </main>
              <Footer />
            </ProtectedRoute>
          } />
          
          <Route path="/search" element={
            <ProtectedRoute>
              <main className="page-wrapper">
                <Search />
              </main>
            </ProtectedRoute>
          } />
          
          <Route path="/results" element={
            <ProtectedRoute>
              <Results />
            </ProtectedRoute>
          } />
          
          <Route path="/judgement/:id" element={
            <ProtectedRoute>
              <Judgement />
            </ProtectedRoute>
          } />
          
          <Route path="/citation" element={
            <ProtectedRoute>
              <Citation />
            </ProtectedRoute>
          } />
          
          <Route path="/ai-chat" element={
            <ProtectedRoute>
              <AIChat />
            </ProtectedRoute>
          } />
           
          <Route path="/keyword" element={
            <ProtectedRoute>
              <Keyword />
            </ProtectedRoute>
          } />

          <Route path="/Nominal" element={
            <ProtectedRoute>
              <Nominal />
            </ProtectedRoute>
          } />

          <Route path="/Latest-LawPoints" element={
            <ProtectedRoute>
              <LatestLawPoints />
            </ProtectedRoute>
          } />

          <Route path="/Latest-Law" element={
           <ProtectedRoute>
              <Header />
              <main className="page-wrapper">
                <LatestLaw />
              </main>
              <Footer />
              </ProtectedRoute>
          } />
          
          <Route path="/ai-search" element={
            <ProtectedRoute>
              <AISearch />
            </ProtectedRoute>
          } />
          
          {/* FIXED DATABASE ROUTE */}
          <Route path="/database" element={
            <ProtectedRoute>
              <Database />
            </ProtectedRoute>
          } />

          <Route path="/virtual"
           element={
            <ProtectedRoute>
              <Virtual />
            </ProtectedRoute>
            } />



  <Route path="/pricing" element={<PricingPlans />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;