// src/App.jsx - Add the judgement route
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Search from './pages/Search';
import Results from './pages/Results';
import Judgement from './pages/Judgement';

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
          <Route path="/results" element={<Results />} />
          <Route path="/judgement/:id" element={<Judgement />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;