// src/pages/Home.jsx
import React from 'react';
import Hero from '../components/Hero';
import SearchInterface from '../components/SearchInterface';
import Features from '../components/Features';
import VideoSection from '../components/VideoSection';
import Services from '../components/Services';
import CallToAction from '../components/CallToAction';
import Team from '../components/Team';
import Testimonials from '../components/Testimonials';
import Blog from '../components/Blog';
import ContactMap from '../components/ContactMap';
import Contact from '../components/Contact';

const Home = () => {
  return (
    <>
      <Hero />
      <SearchInterface />
      <Features />
      <VideoSection />
      <Services />
      <CallToAction />
      <Team />
      <Testimonials />
      <Blog />
      <ContactMap />
      {/* <Contact /> */}
    </>
  );
};

export default Home;