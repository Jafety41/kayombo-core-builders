import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, ArrowRight } from 'lucide-react';
import { View } from '../App';
import { supabase } from '../lib/supabase';

interface Project {
  id: string | number;
  title: string;
  category: string;
  location: string;
  image_url: string;
}

interface ProjectCarouselProps {
  onNavigate?: (view: View) => void;
}

const fallbackProjects: Project[] = [
  {
    id: 'fallback-1',
    title: "Temeke Drainage Infrastructure",
    category: "Civil Works",
    location: "Temeke, Dar es Salaam",
    image_url: "/images/WhatsApp Image 2026-07-03 at 14.41.47.jpeg"
  },
  {
    id: 'fallback-2',
    title: "Kijichi Foundation Beams",
    category: "Foundations",
    location: "Kijichi, Dar es Salaam",
    image_url: "/images/WhatsApp Image 2026-07-03 at 14.41.49.jpeg"
  },
  {
    id: 'fallback-3',
    title: "Structural Site Reinforcement",
    category: "Structural",
    location: "Dar es Salaam",
    image_url: "/images/WhatsApp Image 2026-07-03 at 14.41.50 (1).jpeg"
  },
  {
    id: 'fallback-4',
    title: "Mwananyamala Groundwork",
    category: "Civil Works",
    location: "Mwananyamala, Dar es Salaam",
    image_url: "/images/WhatsApp Image 2026-07-03 at 14.41.50 (2).jpeg"
  },
  {
    id: 'fallback-5',
    title: "Industrial Facility Foundation",
    category: "Infrastructure",
    location: "Kigamboni, Dar es Salaam",
    image_url: "/images/WhatsApp Image 2026-07-03 at 14.41.50 (3).jpeg"
  },
  {
    id: 'fallback-6',
    title: "Heavy Equipment Logistics",
    category: "Logistics",
    location: "Dar es Salaam",
    image_url: "/images/WhatsApp Image 2026-07-03 at 14.41.51 (1).jpeg"
  },
  {
    id: 'fallback-7',
    title: "Main Culvert Reinforcement",
    category: "Civil Works",
    location: "Kigamboni, Dar es Salaam",
    image_url: "/images/WhatsApp Image 2026-07-03 at 14.41.51 (3).jpeg"
  }
];

export const ProjectCarousel: React.FC<ProjectCarouselProps> = ({ onNavigate }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects(fallbackProjects);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
        setProjects(fallbackProjects);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  const handleDetailsClick = () => {
    if (onNavigate) {
      onNavigate('portfolio');
    }
  };

  const nextProject = useCallback(() => {
    if (projects.length === 0) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % projects.length);
  }, [projects.length]);

  const prevProject = useCallback(() => {
    if (projects.length === 0) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + projects.length) % projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (!isAutoPlaying || projects.length === 0) return;

    const interval = setInterval(() => {
      nextProject();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextProject, projects.length]);

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

  if (isLoading) {
    return (
      <div className="w-full">
        {/* Mobile Loading Skeleton */}
        <div className="block md:hidden h-[450px] w-full px-4">
          <div className="bg-gray-100 rounded-2xl h-full w-full animate-pulse flex flex-col">
            <div className="h-64 w-full bg-gray-200 rounded-t-2xl"></div>
            <div className="p-6 flex-1 flex flex-col gap-4">
              <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="mt-auto h-12 bg-gray-200 rounded-xl w-full"></div>
            </div>
          </div>
        </div>
        
        {/* Desktop Loading Skeleton Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-[450px] border border-gray-50 flex flex-col animate-pulse">
              <div className="h-64 w-full bg-gray-200 rounded-t-2xl"></div>
              <div className="p-6 flex-1 flex flex-col gap-4">
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                <div className="mt-auto flex items-center gap-2">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
                  src={projects[currentIndex].image_url} 
                  alt={projects[currentIndex].title}
                  className="w-full h-full object-cover"
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={400}
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
              <motion.div
                className="absolute inset-0 bg-blue-900 z-10 origin-right"
                initial={{ scaleX: 1 }}
                whileInView={{ scaleX: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.2, ease: "easeInOut" }}
              />
              <motion.div
                className="w-full h-full"
                initial={{ opacity: 0, scale: 1.1 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: i * 0.1 + 0.2, ease: "easeOut" }}
              >
                <img 
                  src={project.image_url} 
                  alt={project.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  width={600}
                  height={400}
                />
              </motion.div>
              <div className="absolute top-4 left-4 z-20">
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
