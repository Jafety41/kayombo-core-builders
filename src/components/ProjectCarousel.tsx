import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight } from 'lucide-react';
import { View } from '../App';

interface Project {
  id: number;
  title: string;
  category: string;
  location: string;
  image: string;
}

const projects: Project[] = [
  {
    id: 1,
    title: "Temeke Drainage Infrastructure",
    category: "Civil Works",
    location: "Temeke, Dar es Salaam",
    image: "/images/WhatsApp Image 2026-07-03 at 14.41.47.jpeg"
  },
  {
    id: 2,
    title: "Kijichi Foundation Beams",
    category: "Foundations",
    location: "Kijichi, Dar es Salaam",
    image: "/images/WhatsApp Image 2026-07-03 at 14.41.49.jpeg"
  },
  {
    id: 3,
    title: "Structural Site Reinforcement",
    category: "Structural",
    location: "Dar es Salaam",
    image: "/images/WhatsApp Image 2026-07-03 at 14.41.50 (1).jpeg"
  },
  {
    id: 4,
    title: "Mwananyamala Groundwork",
    category: "Civil Works",
    location: "Mwananyamala, Dar es Salaam",
    image: "/images/WhatsApp Image 2026-07-03 at 14.41.50 (2).jpeg"
  },
  {
    id: 5,
    title: "Industrial Facility Foundation",
    category: "Infrastructure",
    location: "Kigamboni, Dar es Salaam",
    image: "/images/WhatsApp Image 2026-07-03 at 14.41.50 (3).jpeg"
  },
  {
    id: 6,
    title: "Heavy Equipment Logistics",
    category: "Logistics",
    location: "Dar es Salaam",
    image: "/images/WhatsApp Image 2026-07-03 at 14.41.51 (1).jpeg"
  },
  {
    id: 7,
    title: "Main Culvert Reinforcement",
    category: "Civil Works",
    location: "Kigamboni, Dar es Salaam",
    image: "/images/WhatsApp Image 2026-07-03 at 14.41.51 (3).jpeg"
  }
];

interface ProjectCarouselProps {
  onNavigate?: (view: View) => void;
}

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  const handleDetailsClick = () => {
    if (onNavigate) {
      onNavigate('portfolio');
    }
  };

  const nextProject = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, []);

  const prevProject = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, []);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextProject();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextProject]);

  // Framer Motion variants for the carousel animation
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0
    })
  };

  return (
    <div className="w-full">
      {/* Mobile Carousel (Hidden on Desktop) */}
      <div 
        className="block md:hidden relative h-[450px] w-full overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
        onTouchStart={() => setIsAutoPlaying(false)}
        onTouchEnd={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 }
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(_, info) => {
              if (info.offset.x < -50) {
                nextProject();
              } else if (info.offset.x > 50) {
                prevProject();
              }
            }}
            className="absolute inset-0 px-4"
          >
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col h-full">
              <div className="relative h-64 w-full overflow-hidden">
                <img 
                  src={projects[currentIndex].image} 
                  alt={projects[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-blue-900/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-widest rounded-lg">
                    {projects[currentIndex].category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                    <MapPin className="w-3 h-3 text-blue-900" />
                    {projects[currentIndex].location}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 leading-tight">
                    {projects[currentIndex].title}
                  </h3>
                </div>
                
                <button 
                  onClick={handleDetailsClick}
                  className="mt-6 flex items-center justify-center gap-2 w-full py-4 bg-blue-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest active:scale-95 transition-transform"
                >
                  Project Details <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Carousel Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-10">
          {projects.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setDirection(idx > currentIndex ? 1 : -1);
                setCurrentIndex(idx);
              }}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-8 bg-blue-900' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid (Hidden on Mobile) */}
      <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project, i) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
          >
            <div className="relative h-64 w-full overflow-hidden">
              <img 
                src={project.image} 
                alt={project.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-900 text-[10px] font-bold uppercase tracking-widest rounded-lg shadow-sm">
                  {project.category}
                </span>
              </div>
            </div>
            
            <div className="p-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-2">
                  <MapPin className="w-3 h-3 text-blue-900" />
                  {project.location}
                </div>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-900 transition-colors">
                  {project.title}
                </h3>
              </div>
              
              <button 
                onClick={handleDetailsClick}
                className="mt-6 flex items-center gap-2 text-blue-900 font-bold text-xs uppercase tracking-widest group-hover:gap-4 transition-all"
              >
                Learn More <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
