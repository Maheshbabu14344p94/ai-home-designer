import React from 'react';
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import AboutSection from '../components/AboutSection';
import Testimonials from '../components/Testimonials';
import Footer from '../components/Footer';
import ChatbotWidget from '../components/ChatbotWidget';

export default function LandingPage() {
  return (
    <div>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <Testimonials />
      <Footer />
      <ChatbotWidget />
    </div>
  );
}