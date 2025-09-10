// src/App.jsx - Update with new routes
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
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
          <Route path="/" element={
            <>
              <Header />
              <main className="page-wrapper">
                <Home />
              </main>
              <Footer />
            </>
          } />
          <Route path="/search" element={
            <>
              <Header />
              <main className="page-wrapper">
                <Search />
              </main>
              <Footer />
            </>
          } />
          
          {/* Add Header and Footer to Dashboard */}
          <Route path="/dashboard" element={
            <>
              <Header />
              <main className="page-wrapper">
                <Dashboard />
              </main>
              <Footer />
            </>
          } />
          
          {/* Pages without Header/Footer (specialized layouts) */}
          <Route path="/results" element={<Results />} />
          <Route path="/judgement/:id" element={<Judgement />} />
          <Route path="/login" element={<Login />} />
          <Route path="/password" element={<Password />} />
          <Route path="/citation" element={<Citation />} />
          <Route path="/ai-chat" element={<AIChat />} />
          <Route path="/ai-search" element={<AISearch />} />
          <Route path="/signup" element={<Signup />} />

        </Routes>
      </div>
    </Router>
  );
}

export default App;