import { InteractiveButton } from "./InteractiveButton";
import React, { useState, useEffect } from 'react';
import { View } from '../App';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View, sectionId?: string) => void;
}

export const Navbar = ({ currentView, onNavigate }: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', href: 'home' },
    { name: 'Services', href: 'services' },
    { name: 'Projects', href: 'projects' },
    { name: 'About', href: 'about' },
    { name: 'Contact', href: 'contact' },
  ];

  const handleNavClick = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    if (sectionId === 'home') {
      onNavigate('home');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (currentView !== 'home') {
      onNavigate('home', sectionId);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-100/50' : 'bg-white border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative">
        <div className={`flex justify-between items-center transition-all duration-300 ${isScrolled ? 'h-16' : 'h-20'}`}>
          {/* Logo Alignment */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <img 
              src="/images/logo.png" 
              alt="Kayombo Core Builders Company" 
              className="h-10 md:h-16 w-auto object-contain" 
            />
          </div>

          {/* Desktop Navigation Behavior */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <InteractiveButton magnetic={false}
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-gray-500 hover:text-blue-900 transition-colors"
              >
                {item.name}
              </InteractiveButton>
            ))}
            <InteractiveButton magnetic={false} 
              onClick={() => onNavigate('admin')}
              className="rounded-full px-6 py-2.5 bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition-all shadow-sm active:scale-95"
            >
              Admin Login
            </InteractiveButton>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center">
            <InteractiveButton magnetic={false} 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-gray-500 hover:text-blue-900 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </InteractiveButton>
          </div>
        </div>
      </div>

      {/* Mobile Menu Panel */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white shadow-lg absolute w-full left-0 z-50">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <InteractiveButton magnetic={false}
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="block w-full text-left px-4 py-4 text-base font-medium text-gray-800 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-colors"
              >
                {item.name}
              </InteractiveButton>
            ))}
            <div className="pt-4 pb-4 mt-2 border-t border-gray-100">
              <InteractiveButton magnetic={false} 
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  onNavigate('admin');
                }}
                className="block w-full text-center px-4 py-3 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
              >
                Admin Login
              </InteractiveButton>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};
