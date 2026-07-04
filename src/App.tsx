/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Portfolio from './pages/Portfolio';
import ProjectForm from './pages/ProjectForm';
import { Navbar } from './components/Navbar';

export type View = 'home' | 'admin' | 'dashboard' | 'portfolio' | 'project-form';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);

  const navigate = (newView: View, sectionId?: string) => {
    setView(newView);
    if (sectionId) {
      setScrollToSection(sectionId);
    } else {
      setScrollToSection(null);
      window.scrollTo(0, 0);
    }
  };

  const handleClearScroll = () => {
    setScrollToSection(null);
  };

  return (
    <>
      {view !== 'admin' && view !== 'dashboard' && (
        <Navbar currentView={view} onNavigate={navigate} />
      )}
      {view === 'home' && (
        <Home onNavigate={navigate} scrollToSection={scrollToSection} onClearScroll={handleClearScroll} />
      )}
      {view === 'portfolio' && (
        <Portfolio onBack={() => navigate('home')} onNavigate={navigate} />
      )}
      {view === 'project-form' && (
        <ProjectForm onBack={() => navigate('home')} />
      )}
      {view === 'admin' && (
        <AdminLogin 
          onBack={() => navigate('home')} 
          onLogin={() => navigate('dashboard')}
        />
      )}
      {view === 'dashboard' && (
        <Dashboard onLogout={() => navigate('home')} />
      )}
    </>
  );
}

