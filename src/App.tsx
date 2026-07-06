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
import { AnimatePresence, motion, useScroll, useSpring } from 'motion/react';

import { Toaster } from 'sonner';

function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/255613266252"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-8 right-8 md:bottom-12 md:right-12 z-[70] w-12 h-12 md:w-20 md:h-20 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:bg-[#20bd5a] transition-transform hover:scale-110 active:scale-95"
      aria-label="WhatsApp Us"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-6 h-6 md:w-11 md:h-11"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.347-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
      </svg>
    </a>
  );
}

export type View = 'home' | 'admin' | 'dashboard' | 'portfolio' | 'project-form';

export default function App() {
  const [view, setView] = useState<View>('home');
  const [scrollToSection, setScrollToSection] = useState<string | null>(null);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

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
    <div className="flex flex-col min-h-screen w-full">
      <motion.div
        className="fixed top-0 left-0 right-0 h-[3px] bg-blue-900 origin-left z-[100]"
        style={{ scaleX }}
      />
      <Toaster position="bottom-right" richColors />
      {view !== 'admin' && view !== 'dashboard' && (
        <Navbar currentView={view} onNavigate={navigate} />
      )}
      <AnimatePresence mode="wait">
        {view === 'home' && (
          <motion.div
            key="home"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 w-full"
          >
            <Home onNavigate={navigate} scrollToSection={scrollToSection} onClearScroll={handleClearScroll} />
          </motion.div>
        )}
        {view === 'portfolio' && (
          <motion.div
            key="portfolio"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 w-full"
          >
            <Portfolio onBack={() => navigate('home')} onNavigate={navigate} />
          </motion.div>
        )}
        {view === 'project-form' && (
          <motion.div
            key="project-form"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 w-full"
          >
            <ProjectForm onBack={() => navigate('home')} />
          </motion.div>
        )}
        {view === 'admin' && (
          <motion.div
            key="admin"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 w-full"
          >
            <AdminLogin 
              onBack={() => navigate('home')} 
              onLogin={() => navigate('dashboard')}
            />
          </motion.div>
        )}
        {view === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flex-1 w-full"
          >
            <Dashboard onLogout={() => navigate('home')} />
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Floating WhatsApp Button */}
      {view !== 'admin' && view !== 'dashboard' && <WhatsAppButton />}
    </div>
  );
}

