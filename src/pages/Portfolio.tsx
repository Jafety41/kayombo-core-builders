import { InteractiveButton } from "../components/InteractiveButton";
import React, { useEffect, useRef } from 'react';
import { motion, useInView, useMotionValue, useSpring } from 'motion/react';
import { ArrowLeft, MapPin, Building2, Calendar } from 'lucide-react';
import { ProjectCarousel } from '../components/ProjectCarousel';

import { View } from '../App';

interface PortfolioProps {
  onBack: () => void;
  onNavigate?: (view: View) => void;
}

const AnimatedCounter = ({ value, suffix = "+" }: { value: number, suffix?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    duration: 1500,
    bounce: 0,
  });
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Intl.NumberFormat("en-US").format(Math.round(latest)) + suffix;
      }
    });
  }, [springValue, suffix]);

  return <span ref={ref}>0{suffix}</span>;
};

const Portfolio: React.FC<PortfolioProps> = ({ onBack, onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          <InteractiveButton magnetic={false} 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-900 transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </InteractiveButton>
          <img src="/images/logo-optimized.webp" alt="KCBC Logo" className="h-10 w-auto object-contain" />
          <div className="w-24 hidden sm:block" /> {/* Spacer */}
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gray-50/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <div className="max-w-3xl">
              <span className="inline-block py-1.5 px-4 mb-4 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold uppercase tracking-[0.2em]">
                Excellence in Action
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
                Engineering <span className="text-blue-900">Portfolio.</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
                Explore our track record of high-standard civil engineering, foundations, and infrastructure projects across Tanzania.
              </p>
            </div>
          </div>
        </section>

        {/* Projects Showcase */}
        <section className="py-16 md:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
            <ProjectCarousel onNavigate={onNavigate} />
            
            {/* Additional Project Details/Stats */}
            <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { label: 'Projects Completed', value: 150, suffix: '+' , icon: <Building2 className="w-6 h-6" /> },
                { label: 'Years of Experience', value: 15, suffix: '+', icon: <Calendar className="w-6 h-6" /> },
                { label: 'Locations Served', value: 12, suffix: '+', icon: <MapPin className="w-6 h-6" /> },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm text-center">
                  <div className="w-12 h-12 bg-blue-50 text-blue-900 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    {stat.icon}
                  </div>
                  <h4 className="text-3xl font-extrabold text-gray-900 mb-2">
                    <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                  </h4>
                  <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 md:py-24 bg-blue-900 text-white overflow-hidden relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 relative z-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-8">Ready to build your next project with us?</h2>
              <p className="text-blue-100 text-lg mb-10 leading-relaxed font-medium">
                Let's discuss how our engineering expertise can bring your vision to life with stability and integrity.
              </p>
              <InteractiveButton magnetic={false} 
                onClick={() => onNavigate?.('project-form')}
                className="rounded-full px-6 py-3 md:px-10 md:py-5 bg-white text-blue-900 font-bold shadow-xl transition-all hover:-translate-y-1 active:scale-95 text-xs sm:text-sm md:text-base"
              >
                Start Your Project
              </InteractiveButton>
            </div>
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-800/50 rounded-full blur-3xl -z-0" />
        </section>
      </main>

      {/* Footer (Simplified) */}
      <footer className="py-12 border-t border-gray-100 text-center">
        <p className="text-[10px] uppercase tracking-[0.2em] text-gray-400 font-bold">
          © 2026 KAYOMBO CORE BUILDERS COMPANY LTD — DAR ES SALAAM, TZ
        </p>
      </footer>
    </div>
  );
};

export default Portfolio;
