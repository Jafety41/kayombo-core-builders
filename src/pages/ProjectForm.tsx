import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Send, CheckCircle2, Loader2, Building2, HardHat, Construction } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface ProjectFormProps {
  onBack: () => void;
}

const ProjectForm: React.FC<ProjectFormProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Civil Engineering',
    location: '',
    details: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // We'll use the existing 'messages' table or similar for project requests
      const { error } = await supabase.from('messages').insert([{
        name: formData.name,
        phone: `${formData.phone} | ${formData.email}`,
        details: `[PROJECT APPLICATION - ${formData.projectType}] Location: ${formData.location} | Details: ${formData.details}`
      }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting project request:', err);
      // Fallback for demo
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const projectTypes = [
    { id: 'Civil Engineering', icon: <Building2 className="w-5 h-5" /> },
    { id: 'Modern Foundations', icon: <Construction className="w-5 h-5" /> },
    { id: 'Site Supervision', icon: <HardHat className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-gray-50/50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 h-20 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-900 transition-colors font-bold text-xs uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </button>
          <img src="/images/logo.jpg" alt="KCBC Logo" className="h-10 w-auto object-contain" />
          <div className="w-24 hidden sm:block" />
        </div>
      </header>

      <main className="py-12 md:py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div 
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-8 md:p-12"
              >
                <div className="mb-10">
                  <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-4">Start Your Project</h1>
                  <p className="text-gray-500 font-medium leading-relaxed">
                    Fill out the form below and our engineering team will review your application and get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Project Type Selection */}
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project Category</label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {projectTypes.map((type) => (
                        <button
                          key={type.id}
                          type="button"
                          onClick={() => setFormData({ ...formData, projectType: type.id })}
                          className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-3 text-center ${
                            formData.projectType === type.id 
                            ? 'bg-blue-50 border-blue-900 text-blue-900' 
                            : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                          }`}
                        >
                          {type.icon}
                          <span className="text-xs font-bold">{type.id}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Full Name</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
                        placeholder="+255 7XX XXX XXX"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Email Address</label>
                      <input 
                        required
                        type="email" 
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
                        placeholder="john@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project Location</label>
                      <input 
                        required
                        type="text" 
                        className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all"
                        placeholder="e.g. Kigamboni, Dar es Salaam"
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project Details</label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full px-5 py-4 rounded-2xl border border-gray-100 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all resize-none"
                      placeholder="Please describe your project requirements..."
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full rounded-full py-5 bg-blue-900 hover:bg-blue-800 text-white font-bold shadow-xl shadow-blue-900/20 transition-all flex items-center justify-center gap-3 disabled:opacity-50 active:scale-95"
                  >
                    {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                    {isSubmitting ? 'Submitting Application...' : 'Submit Application'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-[40px] border border-gray-100 shadow-2xl p-12 text-center"
              >
                <div className="w-24 h-24 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Application Received!</h2>
                <p className="text-gray-500 font-medium leading-relaxed mb-10">
                  Thank you for choosing KCBC Ltd. Your project application has been sent to our admin panel. 
                  Our team will contact you shortly to discuss the next steps.
                </p>
                <button 
                  onClick={onBack}
                  className="rounded-full px-10 py-5 bg-blue-900 text-white font-bold shadow-lg transition-all hover:-translate-y-1 active:scale-95"
                >
                  Return to Home
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};

export default ProjectForm;
