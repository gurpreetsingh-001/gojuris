// src/App.jsx - Updated with protected routes
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
import Password from './pages/Password';
import Citation from './pages/Citation';
import AIChat from './pages/AIChat';
import AISearch from './pages/AISearch';
import Dashboard from './pages/Dashboard';
import Signup from './pages/Signup';

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
          <Route path="/password" element={<Password />} />
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
              <Header />
              <main className="page-wrapper">
                <Search />
              </main>
              <Footer />
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
          
          <Route path="/ai-search" element={
            <ProtectedRoute>
              <AISearch />
            </ProtectedRoute>
          } />
          
          <Route path="/database" element={
            <ProtectedRoute>
              <Header />
              <main className="page-wrapper">
                <div className="container mt-5 pt-5">
                  <div className="text-center">
                    <h2>Database</h2>
                    <p>Database page content goes here...</p>
                  </div>
                </div>
              </main>
              <Footer />
            </ProtectedRoute>
          } />

          {/* Future routes for commented out sidebar items */}
          {/* 
          <Route path="/chat" element={
            <ProtectedRoute>
              <div className="container mt-5 pt-5">
                <div className="text-center">
                  <h2>Coming Soon</h2>
                  <p>Chat feature will be available soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } />
          
          <Route path="/virtual" element={
            <ProtectedRoute>
              <div className="container mt-5 pt-5">
                <div className="text-center">
                  <h2>Coming Soon</h2>
                  <p>Virtual Assistance will be available soon...</p>
                </div>
              </div>
            </ProtectedRoute>
          } />
          */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;