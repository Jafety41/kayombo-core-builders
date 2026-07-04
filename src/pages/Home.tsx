import React, { useState, useEffect, useRef } from 'react';
import { 
  Building2, 
  Construction, 
  HardHat, 
  Phone, 
  Mail, 
  MessageSquare, 
  ChevronDown, 
  ChevronUp,
  MapPin,
  Clock,
  ArrowRight,
  Send,
  Loader2,
  CheckCircle2,
  Menu,
  X,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { toast } from 'sonner';
import { Project } from '../types';
import { supabase } from '../lib/supabase';
import { ProjectCarousel } from '../components/ProjectCarousel';
import { InteractiveButton } from '../components/InteractiveButton';
import { View } from '../App';

interface HomeProps {
  onNavigate: (view: View, sectionId?: string) => void;
  scrollToSection?: string | null;
  onClearScroll?: () => void;
}

// Components
const Hero = ({ onNavigate }: { onNavigate: (view: View, sectionId?: string) => void }) => {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -40]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.4]);

  return (
    <section className="relative min-h-[60vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden text-center px-4 sm:px-6 lg:px-12">
      {/* Blueprint Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none hidden md:block" />
      
      {/* Decorative Glow Orb */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-blue-900/5 blur-3xl rounded-full pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10 py-12 md:py-20">
        <motion.div style={{ y, opacity }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-transparent"
          >
            <div className="flex justify-center mb-6 md:mb-8 bg-transparent p-0 rounded-none shadow-none">
              <img 
                src="/images/logo-optimized.webp" 
                alt="Kayombo Core Builders Company" 
                className="h-20 md:h-32 w-auto object-contain bg-transparent mix-blend-multiply"
                fetchPriority="high"
                width={256}
                height={128}
              />
            </div>
            <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold tracking-tight text-gray-900 mb-6 md:mb-8 leading-[1.1]">
              Build Your Future. <br className="hidden sm:block" />
              <span className="text-blue-900">Solid Foundations.</span>
            </h1>
            <p className="text-sm sm:text-lg md:text-xl lg:text-2xl text-gray-500 mb-8 md:mb-12 leading-relaxed max-w-3xl mx-auto font-medium px-4">
              Expert civil engineering and infrastructure development based in Dar es Salaam. 
              Engineering stability for Tanzania's growth.
            </p>
            <div className="flex flex-row items-center justify-center gap-3 sm:gap-4 px-2 sm:px-0">
              <InteractiveButton 
                onClick={() => onNavigate('project-form')}
                className="flex-1 sm:flex-none rounded-full px-4 sm:px-10 py-4 sm:py-5 bg-blue-900 hover:bg-blue-800 text-white font-bold shadow-xl shadow-blue-900/20 transition-all active:scale-95 text-[10px] sm:text-sm md:text-base whitespace-nowrap"
              >
                Start Your Project
              </InteractiveButton>
              <InteractiveButton 
                onClick={() => onNavigate('portfolio')}
                className="flex-1 sm:flex-none rounded-full px-4 sm:px-10 py-4 sm:py-5 bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-all shadow-sm active:scale-95 text-[10px] sm:text-sm md:text-base whitespace-nowrap"
              >
                View Our Portfolio
              </InteractiveButton>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

const CEOMessage = () => (
  <section id="about" className="py-5 md:py-24 bg-gray-50/50 scroll-mt-20">
    <div className="max-w-4xl mx-auto px-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden p-6 md:p-8"
      >
        <div className="flex flex-col items-center text-center space-y-4 md:flex-row md:items-start md:text-left md:space-x-8 md:space-y-0">
          <div className="flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-xl overflow-hidden border border-gray-100 shadow-inner">
            <img 
              src="/images/ceo-image-optimized.webp" 
              alt="Eng. Kayombo - Founder & CEO" 
              width={128}
              height={128}
              loading="lazy"
              decoding="async"
              className="object-cover w-full h-full"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center">
            <div className="mb-2">
              <span className="text-[10px] md:text-xs font-bold text-blue-700 uppercase tracking-widest">
                Message from the CEO
              </span>
              <h4 className="text-xl md:text-2xl font-bold text-gray-900">Eng. Kayombo</h4>
            </div>
            
            <div className="relative">
              <p className="text-sm md:text-lg text-gray-700 italic leading-snug">
                "We don't just build structures; we build the foundations of a stronger Tanzania. Engineering excellence and integrity are at the heart of everything we do at KCBC Ltd."
              </p>
            </div>

            <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-center md:justify-start gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-700 animate-pulse" />
              <p className="text-[9px] md:text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Engineering with Integrity</p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
);

const Services = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const interactionTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleInteraction = () => {
    isInteracting.current = true;
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, 4000);
  };

  const handleScroll = () => {
    handleInteraction();
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth - 32 + 16;
      const index = Math.round(scrollRef.current.scrollLeft / itemWidth);
      setCurrentIndex(index);
    }
  };

  const services = [
    {
      title: "Civil Engineering",
      description: "Comprehensive structural designs and heavy infrastructure projects tailored for urban landscapes.",
      icon: <Building2 className="w-6 h-6" />,
    },
    {
      title: "Modern Foundations",
      description: "Specialized deep-foundation installations ensuring high-rise and industrial safety standards.",
      icon: <Construction className="w-6 h-6" />,
    },
    {
      title: "Site Supervision",
      description: "Rigorous on-site management and quality control following international safety protocols.",
      icon: <HardHat className="w-6 h-6" />,
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
      if (!scrollContainer || isInteracting.current) return;
      const itemWidth = scrollContainer.offsetWidth - 32 + 16; // Width + gap
      const currentIndex = Math.round(scrollContainer.scrollLeft / itemWidth);
      const nextIndex = (currentIndex + 1) % services.length;
      
      scrollContainer.scrollTo({
        left: nextIndex * itemWidth,
        behavior: 'smooth'
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    };
  }, [services.length]);

  return (
    <section id="services" className="relative py-5 md:py-24 lg:py-32 bg-gray-50/50 scroll-mt-20 overflow-hidden">
      {/* Blueprint Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none hidden md:block" />
      
      {/* Decorative Glow Orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-blue-900/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-24 px-4"
        >
          <span className="inline-block py-1.5 px-4 mb-4 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold uppercase tracking-[0.2em]">
            Expertise
          </span>
          <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4 md:mb-6">Our Core Services</h2>
          <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">Delivering excellence through specialized expertise in the Tanzanian construction landscape.</p>
        </motion.div>
        
        {/* Mobile: Horizontal Swiping | Desktop: Grid */}
        <div 
          ref={scrollRef}
          onTouchStart={handleInteraction}
          onScroll={handleScroll}
          onMouseEnter={handleInteraction}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-10 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0"
        >
          {services.map((service, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -10 }}
              className="bg-white p-6 md:p-10 rounded-3xl md:rounded-[32px] border border-gray-100 shadow-sm flex flex-col justify-between hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-900/5 transition-all group relative overflow-hidden w-[calc(100vw-32px)] md:w-auto snap-center flex-shrink-0"
            >
              <div className="relative z-10 flex flex-col space-y-3 md:space-y-4">
                <div className="w-12 h-12 md:w-16 md:h-16 bg-gray-50 rounded-xl md:rounded-2xl flex items-center justify-center mb-2 md:mb-4 group-hover:bg-blue-900 group-hover:text-white transition-all duration-500">
                  {service.icon}
                </div>
                <h3 className="text-lg md:text-2xl font-bold text-gray-900">{service.title}</h3>
                <p className="text-sm md:text-base text-gray-500 leading-relaxed font-medium">{service.description}</p>
              </div>
              <a href="#" className="mt-6 inline-flex items-center text-[10px] md:text-xs font-bold uppercase tracking-widest text-blue-900 hover:gap-3 transition-all relative z-10">
                Learn more <ArrowRight className="ml-1 w-4 h-4" />
              </a>
              
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Hint & Indicators */}
        <div className="flex md:hidden flex-col items-center justify-center mt-6">
          <div className="flex gap-2 mb-4">
            {services.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollRef.current) {
                    const itemWidth = scrollRef.current.offsetWidth - 32 + 16;
                    scrollRef.current.scrollTo({
                      left: idx * itemWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-blue-900 w-4' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Swipe to explore services
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-3 h-3" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Projects = ({ onNavigate }: { onNavigate: (view: View) => void }) => {
  return (
    <section id="projects" className="py-5 md:py-24 bg-white scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-6 md:mb-16 gap-6 px-4 md:px-0"
        >
          <div className="max-w-2xl text-center md:text-left">
            <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Featured Projects</h2>
            <p className="text-sm md:text-lg text-gray-500 font-medium">A track record of stability and excellence in high-standard civil engineering across the city.</p>
          </div>
          <button 
            onClick={() => onNavigate('portfolio')}
            className="w-full md:w-auto flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-900 hover:gap-4 transition-all py-4 md:py-0 border border-gray-100 md:border-none rounded-full"
          >
            View All Work <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        <ProjectCarousel onNavigate={onNavigate} />
      </div>
    </section>
  );
};

const SuccessStories = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const interactionTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleInteraction = () => {
    isInteracting.current = true;
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, 4000);
  };

  const handleScroll = () => {
    handleInteraction();
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth - 32 + 16;
      const index = Math.round(scrollRef.current.scrollLeft / itemWidth);
      setCurrentIndex(index);
    }
  };

  const testimonials = [
    {
      name: "Eng. Mwandamizi",
      role: "Senior Consultant",
      content: "Kayombo Core Builders Company delivered the Temeke project with exceptional technical skill. Their attention to foundation stability is unmatched in the region.",
      project: "Temeke Culvert"
    },
    {
      name: "Saidi Hamisi",
      role: "Project Developer",
      content: "Professional, reliable, and deeply knowledgeable about Dar es Salaam's unique soil challenges. Their site supervision was impeccable.",
      project: "Kijichi Residence"
    },
    {
      name: "Municipal Council",
      role: "Infrastructure Oversight",
      content: "The double cell culvert construction has significantly improved drainage. Kayombo Core Builders Company is a partner you can trust for heavy infrastructure.",
      project: "Mwanamtoti Project"
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
      if (!scrollContainer || isInteracting.current) return;
      const itemWidth = scrollContainer.offsetWidth - 32 + 16;
      const currentIndex = Math.round(scrollContainer.scrollLeft / itemWidth);
      const nextIndex = (currentIndex + 1) % testimonials.length;
      
      scrollContainer.scrollTo({
        left: nextIndex * itemWidth,
        behavior: 'smooth'
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    };
  }, [testimonials.length]);

  return (
    <section className="py-5 md:py-24 bg-gray-50/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-16 px-4"
        >
          <span className="inline-block py-1.5 px-4 mb-4 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold uppercase tracking-[0.2em]">
            Testimonials
          </span>
          <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Client Success Stories</h2>
          <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto font-medium">Hear from the partners and stakeholders we've worked with on major city projects.</p>
        </motion.div>

        {/* Mobile: Horizontal Swiping | Desktop: Grid */}
        <div 
          ref={scrollRef}
          onTouchStart={handleInteraction}
          onScroll={handleScroll}
          onMouseEnter={handleInteraction}
          className="flex md:grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-6 md:p-10 rounded-3xl border border-gray-200 shadow-sm flex flex-col w-[calc(100vw-32px)] md:w-auto snap-center flex-shrink-0"
            >
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, idx) => (
                  <svg key={idx} className="w-3 h-3 md:w-4 md:h-4 text-blue-900 fill-current" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-sm md:text-base text-gray-600 italic mb-8 flex-1 leading-relaxed">"{t.content}"</p>
              <div className="flex flex-col space-y-1">
                <h4 className="font-bold text-gray-900 text-sm md:text-base">{t.name}</h4>
                <p className="text-[10px] md:text-xs text-gray-400 uppercase tracking-[0.1em] font-bold">{t.role}</p>
                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center gap-2 text-[9px] md:text-[10px] font-bold text-blue-900 uppercase tracking-widest">
                  <Building2 className="w-3 h-3" /> {t.project}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Hint & Indicators */}
        <div className="flex md:hidden flex-col items-center justify-center mt-6">
          <div className="flex gap-2 mb-4">
            {testimonials.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollRef.current) {
                    const itemWidth = scrollRef.current.offsetWidth - 32 + 16;
                    scrollRef.current.scrollTo({
                      left: idx * itemWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-blue-900 w-4' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Swipe to read more
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-3 h-3" />
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const faqs = [
    {
      q: "Do you handle municipal tenders?",
      a: "Yes, Kayombo Core Builders Company is fully registered and experienced in handling municipal and government infrastructure tenders in Dar es Salaam."
    },
    {
      q: "What regions do you serve?",
      a: "While we are based in Dar es Salaam, we undertake major civil engineering projects throughout Tanzania and the East African region."
    },
    {
      q: "Do you provide site inspections?",
      a: "Absolutely. We offer initial site surveys and ongoing supervision to ensure all work meets engineering specifications."
    },
    {
      q: "What types of civil engineering projects do you undertake?",
      a: "We specialize in a wide range of infrastructure projects including road construction, drainage systems (culverts and storm drains), commercial building foundations, retaining walls, and water supply networks."
    },
    {
      q: "Do you provide architectural and structural design services?",
      a: "Yes, our team of certified engineers offers comprehensive structural design and analysis to ensure safety, durability, and compliance with Tanzanian building codes."
    },
    {
      q: "How do you ensure quality and safety on construction sites?",
      a: "We strictly adhere to ISO standards and OSHA regulations. Every project is overseen by experienced site engineers, and we use high-grade, tested materials to guarantee structural integrity and worker safety."
    }
  ];

  return (
    <section className="py-5 md:py-24 bg-white">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 md:mb-10 text-center">Frequently Asked Questions</h2>
        <div className="space-y-2 md:space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-xl md:rounded-2xl overflow-hidden">
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between p-4 md:p-6 text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-semibold text-gray-900 text-sm md:text-base">{faq.q}</span>
                <motion.div
                  animate={{ rotate: openIndex === i ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400 shrink-0 ml-2" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="px-4 pb-4 md:px-6 md:pb-6 text-gray-500 text-sm md:text-base leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

const OfficeLocation = () => (
  <section className="py-5 md:py-24 bg-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 lg:gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="order-1 lg:order-1"
        >
          <span className="inline-block py-1.5 px-4 mb-4 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold uppercase tracking-[0.2em]">
            Our Headquarters
          </span>
          <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 lg:mb-8 leading-tight">Visit Our Office in <br className="hidden lg:block" /> Dar es Salaam</h2>
          <p className="text-sm md:text-lg text-gray-500 mb-8 leading-relaxed font-medium">
            We are located in the heart of the city, easily accessible for consultations and project meetings. Stop by to discuss your next infrastructure venture.
          </p>
          
          <div className="space-y-4 md:space-y-6">
            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-start gap-4 md:gap-6 group p-4 md:p-6 rounded-3xl hover:bg-gray-50 transition-all cursor-default border border-transparent hover:border-gray-100"
            >
              <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-900 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-xl shadow-blue-900/20">
                <MapPin className="w-5 h-5 md:w-8 md:h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1 text-base md:text-lg">Physical Address</h4>
                <p className="text-gray-500 text-xs md:text-base leading-relaxed">UDSM Main Campus, University Road,<br />Dar es Salaam, Tanzania</p>
              </div>
            </motion.div>

            <motion.div 
              whileHover={{ x: 10 }}
              className="flex items-start gap-4 md:gap-6 group p-4 md:p-6 rounded-3xl hover:bg-gray-50 transition-all cursor-default border border-transparent hover:border-gray-100"
            >
              <div className="w-10 h-10 md:w-16 md:h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-700 shrink-0 group-hover:bg-blue-900 group-hover:text-white transition-all shadow-sm">
                <Clock className="w-5 h-5 md:w-8 md:h-8" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-1 text-base md:text-lg">Business Hours</h4>
                <p className="text-gray-500 text-xs md:text-base leading-relaxed">Mon - Fri: 8:00 AM - 5:00 PM<br />Sat: 9:00 AM - 1:00 PM</p>
              </div>
            </motion.div>
          </div>

          <a 
            href="https://maps.app.goo.gl/uXv7Z6vQ6C6z5z5v8" 
            target="_blank" 
            rel="noopener noreferrer"
            className="mt-6 md:mt-10 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 md:px-10 md:py-5 border border-gray-200 text-gray-900 font-bold hover:bg-gray-50 transition-all active:scale-95 shadow-sm text-sm md:text-base"
          >
            Get Directions <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="order-2 lg:order-2 relative group"
        >
          <div className="aspect-square rounded-[40px] overflow-hidden border border-gray-100 shadow-2xl relative">
            {/* Real Google Maps Embed */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15848.123456789!2d39.2033!3d-6.7811!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x185c4bf46227659b%3A0xe54e60655079a40!2sUniversity%20of%20Dar%20es%20Salaam%20(UDSM)!5e0!3m2!1sen!2stz!4v1700000000000!5m2!1sen!2stz"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="eager"
              referrerPolicy="no-referrer-when-downgrade"
              title="Kayombo Location - UDSM"
              className="w-full h-full grayscale-[0.3] hover:grayscale-0 transition-all duration-700"
            ></iframe>
            
            {/* Floating Detail Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="absolute top-8 right-8 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-xl border border-white/20 hidden sm:block max-w-[200px]"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Live Location</span>
              </div>
              <p className="text-sm font-bold text-gray-900 leading-tight">UDSM Campus, Engineering Department Hub.</p>
            </motion.div>
          </div>
          
          {/* Decorative Back Elements */}
          <div className="absolute -z-10 top-10 -right-10 w-full h-full bg-blue-900/5 rounded-[40px] blur-3xl group-hover:bg-blue-900/10 transition-colors" />
        </motion.div>
      </div>
    </div>
  </section>
);

const Contact = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const isInteracting = useRef(false);
  const interactionTimeout = useRef<ReturnType<typeof setTimeout>>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [formData, setFormData] = useState({ name: '', phone: '', details: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleInteraction = () => {
    isInteracting.current = true;
    if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    interactionTimeout.current = setTimeout(() => {
      isInteracting.current = false;
    }, 4000);
  };

  const handleScroll = () => {
    handleInteraction();
    if (scrollRef.current) {
      const itemWidth = scrollRef.current.offsetWidth - 32 + 16;
      const index = Math.round(scrollRef.current.scrollLeft / itemWidth);
      setCurrentIndex(index);
    }
  };

  const contacts = [
    {
      title: "WhatsApp",
      details: "+255 7XX XXX XXX",
      icon: <MessageSquare className="w-5 h-5" />,
      action: "Chat with us"
    },
    {
      title: "Call Us",
      details: "+255 22 XXX XXXX",
      icon: <Phone className="w-5 h-5" />,
      action: "Call now"
    },
    {
      title: "Email",
      details: "info@kcbc.co.tz",
      icon: <Mail className="w-5 h-5" />,
      action: "Send email"
    }
  ];

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const interval = setInterval(() => {
      if (!scrollContainer || isInteracting.current) return;
      const itemWidth = scrollContainer.offsetWidth - 32 + 16;
      const currentIndex = Math.round(scrollContainer.scrollLeft / itemWidth);
      const nextIndex = (currentIndex + 1) % contacts.length;
      
      scrollContainer.scrollTo({
        left: nextIndex * itemWidth,
        behavior: 'smooth'
      });
    }, 3000);

    return () => {
      clearInterval(interval);
      if (interactionTimeout.current) clearTimeout(interactionTimeout.current);
    };
  }, [contacts.length]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.from('messages').insert([formData]);
      if (error) throw error;
      toast.success('Message sent successfully! Our team will get back to you shortly.');
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setFormData({ name: '', phone: '', details: '' });
      }, 1500);
    } catch (err) {
      console.error('Error saving message:', err);
      toast.error('Could not send message. Please check your connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-5 md:py-24 lg:py-32 bg-gray-50/50 overflow-hidden scroll-mt-20">
      {/* Decorative Glow Orb */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[30rem] md:w-[40rem] h-[30rem] md:h-[40rem] bg-blue-900/5 blur-3xl rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-6 md:mb-16"
        >
          <span className="inline-block py-1.5 px-4 mb-4 rounded-full bg-blue-50 text-blue-900 text-[10px] font-bold uppercase tracking-[0.2em]">
            Get In Touch
          </span>
          <h2 className="text-2xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">Contact Our Team</h2>
          <p className="text-sm md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed font-medium">Real people, every time. Get in touch with our engineers today.</p>
        </motion.div>
        
        {/* Contact Cards: Mobile Horizontal Swipe | Desktop Grid */}
        <div 
          ref={scrollRef}
          onTouchStart={handleInteraction}
          onScroll={handleScroll}
          onMouseEnter={handleInteraction}
          className="flex md:grid md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-16 overflow-x-auto md:overflow-x-visible pb-8 md:pb-0 snap-x snap-mandatory scrollbar-hide px-4 md:px-0 -mx-4 md:mx-0"
        >
          {contacts.map((contact, i) => (
            <motion.div 
              key={i} 
              whileHover={{ y: -5 }}
              className="bg-white p-6 md:p-10 rounded-3xl border border-gray-100 shadow-sm text-center w-[calc(100vw-32px)] md:w-auto snap-center flex-shrink-0 flex flex-col items-center"
            >
              <div className="w-10 h-10 md:w-16 md:h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-900 mb-4 md:mb-8">
                {contact.icon}
              </div>
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">{contact.title}</h3>
              <p className="text-gray-500 text-xs md:text-base mb-6 md:mb-8 font-medium">{contact.details}</p>
              <button className="w-full mt-auto rounded-full py-3 md:py-4 border border-gray-200 text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-900 hover:bg-gray-50 transition-all">
                {contact.action}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Mobile Swipe Hint & Indicators */}
        <div className="flex md:hidden flex-col items-center justify-center mb-10">
          <div className="flex gap-2 mb-4">
            {contacts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  if (scrollRef.current) {
                    const itemWidth = scrollRef.current.offsetWidth - 32 + 16;
                    scrollRef.current.scrollTo({
                      left: idx * itemWidth,
                      behavior: 'smooth'
                    });
                  }
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentIndex ? 'bg-blue-900 w-4' : 'bg-gray-300'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
          <div className="flex items-center gap-2 text-gray-400 font-bold text-[10px] uppercase tracking-[0.2em]">
            Swipe to see all contacts
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <ArrowRight className="w-3 h-3" />
            </motion.div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto bg-white p-6 md:p-12 rounded-[40px] border border-gray-100 shadow-2xl relative"
        >
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all" 
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input 
                  type="tel" 
                  required
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all" 
                  placeholder="+255..." 
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Project Details</label>
              <textarea 
                rows={4} 
                required
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 transition-all" 
                placeholder="Tell us about your project..."
                value={formData.details}
                onChange={(e) => setFormData({ ...formData, details: e.target.value })}
              ></textarea>
            </div>
            <InteractiveButton 
              type="submit"
              disabled={isSubmitting || submitted}
              className="w-full rounded-full py-3 md:py-4 bg-blue-900 hover:bg-blue-800 text-white font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm md:text-base h-[52px] md:h-[60px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Sending...</span>
                </>
              ) : submitted ? (
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }} 
                  animate={{ scale: 1, opacity: 1 }} 
                  className="flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Sent!</span>
                </motion.div>
              ) : (
                <>
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </>
              )}
            </InteractiveButton>
          </form>
        </motion.div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-white border-t border-gray-100 pt-12 md:pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-8 gap-y-12 mb-16">
        <div className="col-span-2">
          <div className="mb-6">
            <img 
              src="/images/logo-optimized.webp" 
              alt="Kayombo Core Builders Company" 
              className="h-10 md:h-12 w-auto object-contain" 
              loading="lazy"
              decoding="async"
              width={160}
              height={48}
            />
          </div>
          <p className="text-gray-500 max-w-md leading-relaxed text-sm">
            Kayombo Core Builders Company is a leading civil engineering firm in Dar es Salaam, 
            dedicated to building the infrastructure that powers Tanzania's future.
          </p>
        </div>
        <div className="col-span-1">
          <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-900 mb-6">Company</h4>
          <ul className="space-y-4 text-sm">
            <li><a href="#about" className="text-gray-500 hover:text-blue-900 transition-colors">About Us</a></li>
            <li><a href="#projects" className="text-gray-500 hover:text-blue-900 transition-colors">Projects</a></li>
            <li><a href="#services" className="text-gray-500 hover:text-blue-900 transition-colors">Services</a></li>
          </ul>
        </div>
        <div className="col-span-1">
          <h4 className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-gray-900 mb-6">Contact</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3 text-gray-500"><MapPin className="w-4 h-4 shrink-0" /> Dar es Salaam</li>
            <li className="flex items-center gap-3 text-gray-500"><Phone className="w-4 h-4 shrink-0" /> +255 22 XXX</li>
            <li className="flex items-center gap-3 text-gray-500"><Clock className="w-4 h-4 shrink-0" /> 8am - 6pm</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-gray-100 pt-10 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center md:text-left">
        <div className="max-w-[250px] md:max-w-none">© 2026 KAYOMBO CORE BUILDERS COMPANY LTD — DAR ES SALAAM, TZ</div>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 items-center">
          <span>WhatsApp: +255 7XX XXX XXX</span>
          <span>Email: info@kcbc.co.tz</span>
        </div>
      </div>
    </div>
  </footer>
);

export default function Home({ onNavigate, scrollToSection, onClearScroll }: HomeProps) {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    if (scrollToSection) {
      const element = document.getElementById(scrollToSection);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
        onClearScroll?.();
      }
    }
  }, [scrollToSection, onClearScroll]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans selection:bg-blue-900/10 selection:text-blue-900 relative">
      <main>
        <Hero onNavigate={onNavigate} />
        <CEOMessage />
        <Services />
        <Projects onNavigate={onNavigate} />
        <SuccessStories />
        <OfficeLocation />
        <FAQ />
        <Contact />
      </main>
      <Footer />

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <InteractiveButton magnetic={false}
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            onClick={scrollToTop}
            className="fixed bottom-[5.5rem] right-6 md:bottom-28 md:right-8 z-[60] w-10 h-10 md:w-14 md:h-14 bg-blue-900 text-white rounded-full flex items-center justify-center shadow-2xl shadow-blue-900/40 hover:bg-blue-800 transition-all hover:-translate-y-1 active:scale-95 group"
            aria-label="Scroll to top"
          >
            <ChevronUp className="w-5 h-5 md:w-6 md:h-6 group-hover:animate-bounce" />
          </InteractiveButton>
        )}
      </AnimatePresence>
    </div>
  );
}
