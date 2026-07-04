import React from 'react';
import { View } from '../App';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View, sectionId?: string) => void;
}

export const Navbar = ({ currentView, onNavigate }: NavbarProps) => {
  const navItems = [
    { name: 'Home', href: 'home' },
    { name: 'Services', href: 'services' },
    { name: 'Projects', href: 'projects' },
    { name: 'About', href: 'about' },
    { name: 'Contact', href: 'contact' },
  ];

  const handleNavClick = (sectionId: string) => {
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
    <nav className="bg-white flex-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex justify-between items-center h-20">
          {/* Logo Alignment */}
          <div 
            className="flex items-center cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <img 
              src="/images/logo.jpg" 
              alt="Kayombo Core Builders Company" 
              className="h-10 md:h-16 w-auto object-contain" 
            />
          </div>

          {/* Desktop Navigation Behavior */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.href)}
                className="text-sm font-medium text-gray-500 hover:text-blue-900 transition-colors"
              >
                {item.name}
              </button>
            ))}
            <button 
              onClick={() => onNavigate('admin')}
              className="rounded-full px-6 py-2.5 bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800 transition-all shadow-sm active:scale-95"
            >
              Admin Login
            </button>
          </div>

          {/* Mobile Admin Button Replacement */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={() => onNavigate('admin')}
              className="bg-blue-900 text-white rounded-full px-4 py-2 text-sm font-medium shadow-md active:scale-95 transition-transform"
            >
              Admin
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};
