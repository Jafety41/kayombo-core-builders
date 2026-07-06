import { InteractiveButton } from "../components/InteractiveButton";
import React, { useState, useEffect } from 'react';
import { 
  ArrowRight,
  LayoutDashboard, 
  FolderKanban, 
  MessageSquare, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  MoreVertical,
  TrendingUp,
  Users,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Save,
  Trash2,
  X as CloseIcon,
  Circle,
  CheckCircle2 as CheckCircle2Icon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Project, Message } from '../types';
import { supabase } from '../lib/supabase';
import { LottiePlayer } from '../components/LottiePlayer';
import emptyBoxAnimation from '../assets/lottie/empty-box.json';

export default function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'messages' | 'security'>('overview');
  const [projects, setProjects] = useState<Project[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saveStatus, setSaveStatus] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Add Project Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    location: '',
    category: 'Infrastructure',
    image_url: '',
    description: ''
  });

  useEffect(() => {
    fetchProjects();
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    const { data, error } = await supabase.from('messages').select('*').order('created_at', { ascending: false });
    if (data) setMessages(data);
  };

  const markAsRead = async (id: string, is_read: boolean = false) => {
    // Optimistic update
    setMessages(messages.map(m => m.id === id ? { ...m, is_read: !is_read } : m));
    
    try {
      const { error } = await supabase
        .from('messages')
        .update({ is_read: !is_read })
        .eq('id', id);

      if (error) {
         // Revert on error
         setMessages(messages.map(m => m.id === id ? { ...m, is_read } : m));
         if (error.message?.includes('does not exist')) {
           toast.error('Please update your database schema to support read status.');
         } else {
           throw error;
         }
      } else {
         toast.success(!is_read ? 'Message marked as read' : 'Message marked as unread');
      }
    } catch (err) {
      console.error('Error marking as read:', err);
      toast.error('Failed to update message status.');
    }
  };

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data) {
      setProjects(data);
    } else if (error) {
      console.error('Error fetching projects:', error);
    }
    setLoading(false);
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([newProject])
        .select();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      if (data && data[0]) {
        setProjects([data[0], ...projects]);
        toast.success('Project added successfully!');
        setIsModalOpen(false);
        setNewProject({
          title: '',
          location: '',
          category: 'Infrastructure',
          image_url: '',
          description: ''
        });
      }
    } catch (err: any) {
      console.error('Error adding project:', err);
      toast.error('Could not save to database. Please check your connection.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setProjects(projects.filter(p => p.id !== id));
      toast.success('Project deleted successfully!');
    } catch (err) {
      console.error('Error deleting project:', err);
      toast.error('Failed to delete project.');
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    
    setTimeout(() => {
      localStorage.setItem('adminPassword', newPassword);
      setSaveStatus('Password updated successfully!');
      toast.success('Password updated successfully!');
      setNewPassword('');
    }, 500);
  };

  const handleSignOut = async () => {
    onLogout();
  };

  const Sidebar = () => (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
      
      <aside className={`w-[280px] bg-white border-r border-gray-100 flex flex-col h-full fixed left-0 top-0 z-50 transition-transform duration-300 shadow-2xl md:shadow-none md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-8 md:mb-12">
            <div className="flex items-center">
              <img src="/images/logo.png" alt="Kayombo Core Builders Company" className="h-10 md:h-12 w-auto object-contain" />
            </div>
            <InteractiveButton magnetic={false} 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-900 bg-gray-50 rounded-full"
            >
              <CloseIcon className="w-4 h-4" />
            </InteractiveButton>
          </div>

          <nav className="space-y-1.5">
            {[
              { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
              { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
            ].map((item) => (
              <InteractiveButton magnetic={false} 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition-all group ${activeTab === item.id ? 'bg-blue-900 text-white shadow-lg shadow-blue-900/20' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <div className={`${activeTab === item.id ? 'text-white' : 'text-gray-400 group-hover:text-gray-900'} transition-colors`}>
                  {item.icon}
                </div>
                {item.label}
              </InteractiveButton>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 md:p-8 space-y-2">
          <InteractiveButton magnetic={false} className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold text-gray-500 hover:bg-gray-50 hover:text-gray-900 transition-all">
            <Settings className="w-4 h-4 text-gray-400" /> Settings
          </InteractiveButton>
          <InteractiveButton magnetic={false} 
            onClick={handleSignOut}
            className="w-full flex items-center gap-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </InteractiveButton>
        </div>
      </aside>
    </>
  );

  const recentActivities = [
    ...messages.map(m => ({
      date: new Date(m.created_at || Date.now()),
      desc: `New message from ${m.name}`,
      icon: <MessageSquare />
    })),
    ...projects.map(p => ({
      date: new Date((p as any).created_at || Date.now()),
      desc: `Project "${p.title}" added`,
      icon: <FolderKanban />
    }))
  ]
  .sort((a, b) => b.date.getTime() - a.date.getTime())
  .slice(0, 4)
  .map(a => ({
    time: a.date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
    desc: a.desc,
    icon: a.icon
  }));

  const Header = ({ title }: { title: string }) => (
    <header className="h-16 md:h-20 bg-white/80 backdrop-blur-xl border-b border-gray-100 flex items-center justify-between px-4 md:px-8 sticky top-0 z-30">
      <div className="flex items-center gap-3 md:gap-4">
        <InteractiveButton magnetic={false} 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-500 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 rounded-full md:hidden transition-colors"
        >
          <LayoutDashboard className="w-5 h-5" />
        </InteractiveButton>
        <h1 className="text-xl md:text-2xl font-extrabold tracking-tight text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-4 md:gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search dashboard..." 
            className="pl-11 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900/20 outline-none transition-all w-64 lg:w-80"
          />
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex flex-col items-end">
            <span className="text-xs font-bold text-gray-900 leading-none">Admin User</span>
            <span className="text-[10px] font-medium text-gray-500 mt-1">Superadmin</span>
          </div>
          <div className="w-9 h-9 md:w-11 md:h-11 rounded-full bg-gradient-to-tr from-blue-900 to-blue-700 shadow-md shadow-blue-900/20 flex items-center justify-center text-white font-bold text-xs uppercase border-2 border-white ring-2 ring-gray-50">
            AD
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-[100dvh] bg-[#f8fafc] flex font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-[280px] min-h-[100dvh] flex flex-col relative w-full overflow-x-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-900/5 rounded-full blur-[100px] pointer-events-none -translate-y-1/2 translate-x-1/2" />
        
        <Header title={activeTab === 'overview' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
        
        <div className="flex-1 relative z-10">
          {activeTab === 'overview' && (
            <div className="p-4 sm:p-6 md:p-8 lg:p-10 space-y-6 md:space-y-8 max-w-7xl mx-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Active Projects', value: projects.length.toString(), icon: <FolderKanban />, color: 'bg-blue-500', trend: 'Total' },
                { label: 'Total Messages', value: messages.length.toString(), icon: <MessageSquare />, color: 'bg-purple-500', trend: 'All leads' },
                { label: 'Site Visitors', value: '2.4k', icon: <Users />, color: 'bg-orange-500', trend: '+18%' },
                { label: 'Completion Rate', value: '94%', icon: <CheckCircle2 />, color: 'bg-green-500', trend: 'High efficiency' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 md:p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                  <div className="flex items-start justify-between mb-6">
                    <div className={`w-12 h-12 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                      {React.cloneElement(stat.icon as React.ReactElement, { className: "w-5 h-5" })}
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-green-500 bg-green-50 px-2 py-1 rounded-md">{stat.trend}</span>
                  </div>
                  <h4 className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">{stat.label}</h4>
                  <span className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
              <div className="lg:col-span-2 bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden flex flex-col">
                <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between shrink-0">
                  <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Recent Projects</h3>
                  <InteractiveButton magnetic={false} onClick={() => setActiveTab('projects')} className="text-blue-600 hover:text-blue-800 text-xs font-bold uppercase tracking-widest transition-colors flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></InteractiveButton>
                </div>
                <div className="divide-y divide-gray-50 flex-1 overflow-auto">
                  {projects.slice(0, 5).map((p) => (
                    <div key={p.id} className="p-4 md:p-6 flex items-center gap-4 md:gap-5 hover:bg-gray-50/50 transition-colors group">
                      <img src={p.image_url} alt="" className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover border border-gray-100 shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm md:text-base truncate group-hover:text-blue-900 transition-colors">{p.title}</h4>
                        <div className="flex items-center gap-2 mt-1 md:mt-1.5">
                          <span className="px-2 py-0.5 bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-600 rounded-md shrink-0">{p.category}</span>
                          <span className="text-gray-400 text-[10px] md:text-xs truncate">{p.location}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-green-50 text-[10px] font-bold uppercase tracking-wider text-green-700 rounded-md">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                        </span>
                        <InteractiveButton magnetic={false} className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-900"><MoreVertical className="w-5 h-5" /></InteractiveButton>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm p-6 md:p-8 flex flex-col">
                <div className="flex items-center justify-between mb-6 md:mb-8 shrink-0">
                  <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Recent Activity</h3>
                </div>
                <div className="space-y-6 flex-1 overflow-auto">
                  {recentActivities.length > 0 ? recentActivities.map((activity, i) => (
                    <div key={i} className="flex gap-4 group">
                      <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0 border border-gray-100 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors z-10 relative">
                          {React.cloneElement(activity.icon as React.ReactElement, { className: "w-4 h-4" })}
                        </div>
                        {i !== recentActivities.length - 1 && (
                          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-px h-6 bg-gray-100" />
                        )}
                      </div>
                      <div className="pt-2">
                        <p className="text-sm text-gray-700 font-medium leading-snug group-hover:text-gray-900 transition-colors">{activity.desc}</p>
                        <span className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mt-1 block">{activity.time}</span>
                      </div>
                    </div>
                  )) : (
                    <div className="flex flex-col items-center justify-center h-full py-10">
                      <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                        <Clock className="w-5 h-5 text-gray-300" />
                      </div>
                      <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest text-center">No recent activity</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'projects' && (
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-7xl mx-auto w-full">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 md:mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Manage Projects</h2>
                <p className="text-gray-500 text-sm mt-1">Add, edit or archive your construction portfolio</p>
              </div>
              <InteractiveButton magnetic={false} 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto rounded-full px-6 py-3.5 bg-blue-900 hover:bg-blue-800 text-white text-sm font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" /> Add Project
              </InteractiveButton>
            </div>
            
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-sm overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left min-w-[700px]">
                  <thead>
                    <tr className="bg-gray-50/50 border-b border-gray-100">
                      <th className="px-6 py-4 md:px-8 md:py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Project Details</th>
                      <th className="px-6 py-4 md:px-8 md:py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                      <th className="px-6 py-4 md:px-8 md:py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</th>
                      <th className="px-6 py-4 md:px-8 md:py-5 text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-6 py-4 md:px-8 md:py-5">
                          <div className="flex items-center gap-4">
                            <img src={p.image_url} alt="" className="w-14 h-14 rounded-xl object-cover border border-gray-100 shadow-sm" />
                            <div>
                              <span className="font-bold text-gray-900 text-sm block group-hover:text-blue-600 transition-colors">{p.title}</span>
                              <span className="text-xs text-gray-400 block mt-0.5 max-w-[250px] truncate">{p.description || 'No description provided.'}</span>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 md:px-8 md:py-5">
                          <span className="px-3 py-1 bg-gray-100 text-[10px] font-bold uppercase tracking-wider text-gray-600 rounded-lg inline-block whitespace-nowrap">{p.category}</span>
                        </td>
                        <td className="px-6 py-4 md:px-8 md:py-5 text-sm text-gray-500 font-medium">{p.location}</td>
                        <td className="px-6 py-4 md:px-8 md:py-5 text-right">
                          <InteractiveButton magnetic={false} 
                            onClick={() => handleDeleteProject(p.id)}
                            className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2.5 rounded-xl transition-all inline-flex"
                          >
                            <Trash2 className="w-4 h-4" />
                          </InteractiveButton>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-50">
                {projects.map(p => (
                  <div key={p.id} className="p-5 flex flex-col gap-4 hover:bg-gray-50/50 transition-colors">
                    <div className="flex gap-4">
                      <img src={p.image_url} alt="" className="w-20 h-20 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0" />
                      <div className="flex-1 min-w-0 py-1">
                        <h4 className="font-bold text-gray-900 text-base leading-tight mb-1">{p.title}</h4>
                        <p className="text-gray-500 text-xs truncate mb-2">{p.location}</p>
                        <span className="px-2 py-0.5 bg-gray-100 text-[9px] font-bold uppercase tracking-wider text-gray-600 rounded-md inline-block">
                          {p.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-[10px] flex items-center gap-1.5 font-bold uppercase tracking-widest text-green-600">
                        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Live
                      </span>
                      <InteractiveButton magnetic={false} 
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-2 text-xs font-semibold"
                      >
                        <Trash2 className="w-4 h-4" /> Delete
                      </InteractiveButton>
                    </div>
                  </div>
                ))}
              </div>

              {projects.length === 0 && !loading && (
                <div className="p-12 md:p-20 flex flex-col items-center text-center">
                  <div className="w-40 h-40">
                    <LottiePlayer 
                      animationData={emptyBoxAnimation}
                      loop={true}
                      autoplay={true}
                    />
                  </div>
                  <p className="text-gray-500 font-bold text-sm max-w-xs mx-auto">
                    No projects yet — add your first project to get started.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Project Modal */}
        <AnimatePresence>
          {isModalOpen && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsModalOpen(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative bg-white w-full max-w-lg rounded-[32px] shadow-2xl overflow-hidden"
              >
                <div className="p-6 md:p-8 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Add New Project</h3>
                  <InteractiveButton magnetic={false} onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <CloseIcon className="w-5 h-5" />
                  </InteractiveButton>
                </div>
                
                <form onSubmit={handleAddProject} className="p-6 md:p-8 space-y-5">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Project Title</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g., Ubungo Interchange"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-sm"
                      value={newProject.title}
                      onChange={e => setNewProject({...newProject, title: e.target.value})}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Dar es Salaam"
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-sm"
                        value={newProject.location}
                        onChange={e => setNewProject({...newProject, location: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</label>
                      <select 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-sm appearance-none bg-white"
                        value={newProject.category}
                        onChange={e => setNewProject({...newProject, category: e.target.value})}
                      >
                        <option>Infrastructure</option>
                        <option>Foundations</option>
                        <option>Civil Works</option>
                        <option>Residential</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Image URL</label>
                    <input 
                      type="url" 
                      required
                      placeholder="https://images.unsplash.com/..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-sm"
                      value={newProject.image_url}
                      onChange={e => setNewProject({...newProject, image_url: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Description (Optional)</label>
                    <textarea 
                      rows={3}
                      placeholder="Brief project details..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-sm resize-none"
                      value={newProject.description}
                      onChange={e => setNewProject({...newProject, description: e.target.value})}
                    />
                  </div>

                  <div className="pt-4 flex flex-col sm:flex-row gap-3">
                    <InteractiveButton magnetic={false} 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 rounded-full py-4 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </InteractiveButton>
                    <InteractiveButton magnetic={false} 
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 rounded-full py-4 bg-blue-900 hover:bg-blue-800 text-white text-[10px] font-bold uppercase tracking-widest shadow-lg shadow-blue-900/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {isSubmitting ? (
                        <>
                          <Clock className="w-4 h-4 animate-spin" /> Saving...
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" /> Save Project
                        </>
                      )}
                    </InteractiveButton>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {activeTab === 'messages' && (
          <div className="p-4 sm:p-6 md:p-8 lg:p-10 max-w-5xl mx-auto w-full">
            <div className="mb-6 md:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 md:gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Inbox & Leads</h2>
                <p className="text-gray-500 text-sm mt-1">View project applications and general inquiries</p>
              </div>
              <div className="bg-blue-50/80 backdrop-blur-sm px-4 py-2.5 rounded-xl flex items-center gap-3 border border-blue-100/50 self-start md:self-auto">
                <div className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
                </div>
                <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">
                  {messages.filter(m => !m.is_read).length} Unread <span className="opacity-40 mx-1">•</span> {messages.length} Total
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className={`bg-white p-5 md:p-6 rounded-[24px] border ${msg.is_read ? 'border-gray-100 opacity-80 shadow-sm' : 'border-blue-100 shadow-md shadow-blue-900/5'} transition-all group relative overflow-hidden flex flex-col sm:flex-row gap-5 md:gap-6`}
                  >
                    {!msg.is_read && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-600" />
                    )}
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-3 justify-between sm:justify-start">
                        <div className="flex items-center gap-3">
                          {msg.details.includes('[PROJECT APPLICATION') ? (
                            <span className="px-2.5 py-1 bg-blue-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-md">Project App</span>
                          ) : (
                            <span className="px-2.5 py-1 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-widest rounded-md">General</span>
                          )}
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(msg.created_at || '').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        
                        {/* Mobile Actions */}
                        <div className="flex items-center gap-1 sm:hidden">
                          <InteractiveButton magnetic={false}
                            onClick={() => markAsRead(msg.id, msg.is_read)}
                            className={`p-2 rounded-lg transition-all ${msg.is_read ? 'text-green-600 bg-green-50' : 'text-gray-400 bg-gray-50'}`}
                          >
                            {msg.is_read ? <CheckCircle2Icon className="w-4 h-4" /> : <Circle className="w-4 h-4" />}
                          </InteractiveButton>
                          <InteractiveButton magnetic={false} 
                            onClick={async () => {
                              if (!confirm('Delete this message?')) return;
                              await supabase.from('messages').delete().eq('id', msg.id);
                              fetchMessages();
                            }}
                            className="p-2 text-red-400 bg-red-50 rounded-lg"
                          >
                            <Trash2 className="w-4 h-4" />
                          </InteractiveButton>
                        </div>
                      </div>

                      <div>
                        <h4 className={`text-lg md:text-xl tracking-tight mb-1 ${msg.is_read ? 'font-semibold text-gray-700' : 'font-extrabold text-gray-900'}`}>{msg.name}</h4>
                        <div className="flex items-center gap-2 text-sm">
                          <span className={`${msg.is_read ? 'font-medium text-gray-500' : 'font-semibold text-blue-600'}`}>{msg.phone}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-gray-500 truncate max-w-[150px] sm:max-w-none">{msg.email}</span>
                        </div>
                      </div>
                      
                      <div className={`text-sm leading-relaxed whitespace-pre-wrap p-4 md:p-5 rounded-2xl border ${msg.is_read ? 'text-gray-600 bg-gray-50/50 border-gray-100' : 'text-gray-800 bg-blue-50/30 border-blue-100/50'}`}>
                        {msg.details}
                      </div>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden sm:flex flex-col gap-2 shrink-0 border-l border-gray-100 pl-6 my-2">
                      <InteractiveButton magnetic={false}
                        onClick={() => markAsRead(msg.id, msg.is_read)}
                        className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all ${msg.is_read ? 'text-green-600 bg-green-50 hover:bg-green-100' : 'text-gray-400 hover:text-blue-600 hover:bg-blue-50 bg-gray-50'}`}
                        title={msg.is_read ? "Mark as unread" : "Mark as read"}
                      >
                        {msg.is_read ? <CheckCircle2Icon className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                      </InteractiveButton>
                      <InteractiveButton magnetic={false} 
                        onClick={async () => {
                          if (!confirm('Delete this message?')) return;
                          await supabase.from('messages').delete().eq('id', msg.id);
                          fetchMessages();
                        }}
                        className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 bg-gray-50 transition-all"
                        title="Delete message"
                      >
                        <Trash2 className="w-5 h-5" />
                      </InteractiveButton>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="p-20 text-center bg-white rounded-[40px] border border-gray-100 border-dashed">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mx-auto mb-4">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900">No messages yet</h3>
                  <p className="text-gray-400 text-sm mt-2">When users fill out your forms, they will appear here.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="p-4 sm:p-6 md:p-10 max-w-2xl mx-auto w-full">
            <div className="mb-6 md:mb-10 text-center sm:text-left">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-4 mx-auto sm:mx-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Security Settings</h2>
              <p className="text-gray-500 text-sm mt-1">Manage your admin access and passwords</p>
            </div>
            
            <div className="bg-white p-6 md:p-10 rounded-[28px] md:rounded-[36px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3 ml-1">Change Admin Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new secure password" 
                    className="w-full px-5 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-sm md:text-base bg-gray-50/50 focus:bg-white"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <p className="mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic ml-1">Current default is 'KAYOMBO123%'</p>
                </div>
                
                <InteractiveButton magnetic={false} 
                  type="submit"
                  disabled={!newPassword || saveStatus === 'Saving...'}
                  className="w-full sm:w-auto rounded-full px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-50 mt-8"
                >
                  <Save className="w-4 h-4" /> {saveStatus === 'Saving...' ? 'Saving...' : 'Save Changes'}
                </InteractiveButton>
                
                <AnimatePresence>
                  {saveStatus === 'Password updated successfully!' && (
                    <motion.p 
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-[10px] font-bold text-green-600 uppercase tracking-[0.2em] mt-4 flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3 h-3" /> {saveStatus}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        )}
        </div>
      </main>
    </div>
  );
}
