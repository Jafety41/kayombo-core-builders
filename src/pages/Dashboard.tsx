import React, { useState, useEffect } from 'react';
import { 
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
  X as CloseIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Project, Message } from '../types';
import { supabase } from '../lib/supabase';

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

  const fetchProjects = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    if (data && data.length > 0) {
      setProjects(data);
    } else {
      // Fallback to mock if supabase fails or is empty
      setProjects([
        {
          id: '1',
          title: "Temeke Culvert",
          location: "Dar es Salaam",
          category: "Infrastructure",
          image_url: "/images/temeke_culvert.jpg",
          description: "Major drainage improvement project."
        }
      ]);
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
      
      // Fallback: Add to local state for demo purposes even if DB fails
      const fallbackProject: Project = {
        ...newProject,
        id: Math.random().toString(36).substr(2, 9),
      };
      
      setProjects([fallbackProject, ...projects]);
      setIsModalOpen(false);
      setNewProject({
        title: '',
        location: '',
        category: 'Infrastructure',
        image_url: '',
        description: ''
      });
      
      // If it's an RLS error, it's expected if not properly authenticated with Supabase Auth
      if (err?.message?.includes('row-level security')) {
        console.warn('Database access denied (RLS). Project added to local view only.');
      } else {
        alert('Could not save to database. Project added to current view only.');
      }
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
    } catch (err) {
      console.error('Error deleting project:', err);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('Saving...');
    
    const { error } = await supabase
      .from('admin_settings')
      .update({ value: newPassword })
      .eq('key', 'admin_password');

    if (error) {
      setSaveStatus('Error saving password.');
    } else {
      setSaveStatus('Password updated successfully!');
      setNewPassword('');
    }
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
      
      <aside className={`w-64 bg-white border-r border-gray-100 flex flex-col h-full fixed left-0 top-0 z-50 transition-transform duration-300 md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 md:p-8">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <img src="/images/logo.jpg" alt="Kayombo Core Builders Company" className="h-10 w-auto object-contain" />
            </div>
            <button 
              onClick={() => setIsSidebarOpen(false)}
              className="md:hidden p-2 text-gray-400 hover:text-gray-900"
            >
              <LogOut className="w-5 h-5 rotate-180" />
            </button>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
              { id: 'projects', label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
              { id: 'messages', label: 'Messages', icon: <MessageSquare className="w-4 h-4" /> },
              { id: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4" /> },
            ].map((item) => (
              <button 
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id as any);
                  setIsSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${activeTab === item.id ? 'bg-blue-50 text-blue-900' : 'text-gray-500 hover:bg-gray-50'}`}
              >
                {item.icon} {item.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 md:p-8 space-y-4">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all">
            <Settings className="w-4 h-4" /> Settings
          </button>
          <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold text-red-500 hover:bg-red-50 transition-all"
          >
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </div>
      </aside>
    </>
  );

  const Header = ({ title }: { title: string }) => (
    <header className="h-16 md:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 md:px-10 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="p-2 -ml-2 text-gray-400 hover:text-blue-900 md:hidden"
        >
          <LayoutDashboard className="w-6 h-6" />
        </button>
        <h1 className="text-lg md:text-xl font-extrabold tracking-tight text-gray-900">{title}</h1>
      </div>
      <div className="flex items-center gap-3 md:gap-4">
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-gray-50 border-transparent rounded-full text-sm focus:bg-white focus:ring-2 focus:ring-blue-900/5 focus:border-blue-900/20 outline-none transition-all w-48 md:w-64"
          />
        </div>
        <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden text-[10px] md:text-xs flex items-center justify-center font-bold text-gray-400 uppercase">
          Adm
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex font-sans">
      <Sidebar />
      <main className="flex-1 md:ml-64 min-h-screen flex flex-col">
        <Header title={activeTab === 'overview' ? 'Overview' : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} />
        
        {activeTab === 'overview' && (
          <div className="p-4 md:p-10 space-y-6 md:space-y-10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {[
                { label: 'Active Projects', value: projects.length.toString(), icon: <FolderKanban />, color: 'bg-blue-500', trend: '+2 this month' },
                { label: 'Total Messages', value: '48', icon: <MessageSquare />, color: 'bg-purple-500', trend: '+12 this week' },
                { label: 'Site Visitors', value: '2.4k', icon: <Users />, color: 'bg-orange-500', trend: '+18%' },
                { label: 'Completion Rate', value: '94%', icon: <CheckCircle2 />, color: 'bg-green-500', trend: 'High efficiency' },
              ].map((stat, i) => (
                <div key={i} className="bg-white p-5 md:p-6 rounded-[24px] md:rounded-3xl border border-gray-100 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 ${stat.color} rounded-2xl flex items-center justify-center text-white shadow-lg shadow-black/5`}>
                      {stat.icon}
                    </div>
                    <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-green-500">{stat.trend}</span>
                  </div>
                  <h4 className="text-gray-400 text-[10px] font-bold uppercase tracking-widest mb-1">{stat.label}</h4>
                  <span className="text-xl md:text-2xl font-extrabold text-gray-900">{stat.value}</span>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-10">
              <div className="lg:col-span-2 bg-white rounded-[24px] md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 md:p-8 border-b border-gray-50 flex items-center justify-between">
                  <h3 className="font-extrabold text-gray-900 tracking-tight">Recent Projects</h3>
                  <button onClick={() => setActiveTab('projects')} className="text-blue-900 text-[10px] font-bold uppercase tracking-widest hover:underline">View All</button>
                </div>
                <div className="divide-y divide-gray-50">
                  {projects.slice(0, 5).map((p) => (
                    <div key={p.id} className="p-4 md:p-6 flex items-center gap-3 md:gap-4 hover:bg-gray-50 transition-colors">
                      <img src={p.image_url} alt="" className="w-14 h-10 md:w-16 md:h-12 rounded-lg md:rounded-xl object-cover border border-gray-100" />
                      <div className="flex-1">
                        <h4 className="font-bold text-gray-900 text-xs md:text-sm">{p.title}</h4>
                        <p className="text-gray-400 text-[10px] mt-0.5">Dar es Salaam, TZ</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="hidden xs:inline-block px-2 py-0.5 bg-blue-50 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-blue-900 rounded-md">Live</span>
                        <button className="p-1.5 md:p-2 hover:bg-gray-100 rounded-lg transition-colors"><MoreVertical className="w-4 h-4 text-gray-400" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-[24px] md:rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8">
                <h3 className="font-extrabold text-gray-900 tracking-tight mb-6 md:mb-8">Recent Activity</h3>
                <div className="space-y-6 md:space-y-8">
                  {[
                    { time: '2m ago', desc: 'New lead from John Doe', icon: <Users /> },
                    { time: '1h ago', desc: 'Project "Temeke" updated', icon: <Clock /> },
                    { time: '4h ago', desc: 'New message via WhatsApp', icon: <MessageSquare /> },
                    { time: 'Yesterday', desc: 'Completed site inspection', icon: <CheckCircle2 /> },
                  ].map((activity, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 shrink-0">
                        {activity.icon}
                      </div>
                      <div>
                        <p className="text-xs md:text-sm text-gray-700 font-medium leading-snug">{activity.desc}</p>
                        <span className="text-[9px] text-gray-400 uppercase font-bold">{activity.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'projects' && (
          <div className="p-4 md:p-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-10 gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Manage Projects</h2>
                <p className="text-gray-500 text-xs md:text-sm mt-1">Add, edit or archive your construction portfolio</p>
              </div>
              <button 
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto rounded-full px-6 py-3 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all"
              >
                <Plus className="w-4 h-4" /> Add Project
              </button>
            </div>
            
            <div className="bg-white rounded-[24px] md:rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left min-w-[600px]">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">Project</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">Category</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400">Location</th>
                      <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-gray-400 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {projects.map(p => (
                      <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 md:px-8 py-4 md:py-5">
                          <div className="flex items-center gap-3 md:gap-4">
                            <img src={p.image_url} alt="" className="w-10 h-10 md:w-12 md:h-12 rounded-lg object-cover shadow-sm" />
                            <span className="font-bold text-gray-900 text-xs md:text-sm">{p.title}</span>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-5">
                          <span className="px-2 py-0.5 bg-blue-50 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-blue-900 rounded-md">{p.category}</span>
                        </td>
                        <td className="px-6 md:px-8 py-4 md:py-5 text-xs md:text-sm text-gray-500 font-medium">{p.location}</td>
                        <td className="px-6 md:px-8 py-4 md:py-5 text-right">
                          <button 
                            onClick={() => handleDeleteProject(p.id)}
                            className="text-red-400 hover:text-red-600 p-2 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-50">
                {projects.map(p => (
                  <div key={p.id} className="p-4 flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <img src={p.image_url} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-gray-900 text-sm truncate">{p.title}</h4>
                        <p className="text-gray-500 text-[10px] uppercase font-bold tracking-widest mt-1">{p.location}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteProject(p.id)}
                        className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 bg-blue-50 text-[9px] font-bold uppercase tracking-wider text-blue-900 rounded-md">
                        {p.category}
                      </span>
                      <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Active</span>
                    </div>
                  </div>
                ))}
              </div>

              {projects.length === 0 && (
                <div className="p-20 text-center">
                  <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No projects found</p>
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
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-gray-400 hover:text-gray-900 transition-colors">
                    <CloseIcon className="w-5 h-5" />
                  </button>
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
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1 rounded-full py-4 border border-gray-200 text-[10px] font-bold uppercase tracking-widest text-gray-500 hover:bg-gray-50 transition-all"
                    >
                      Cancel
                    </button>
                    <button 
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
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {activeTab === 'messages' && (
          <div className="p-4 md:p-10 max-w-5xl mx-auto w-full">
            <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl md:text-3xl font-extrabold text-gray-900 tracking-tight">Inbox & Leads</h2>
                <p className="text-gray-500 text-xs md:text-sm mt-1">View project applications and general inquiries</p>
              </div>
              <div className="bg-blue-50 px-4 py-2 rounded-xl flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-900 rounded-full animate-pulse" />
                <span className="text-[10px] font-bold text-blue-900 uppercase tracking-widest">{messages.length} Total Messages</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    key={msg.id}
                    className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-sm hover:shadow-md transition-all group"
                  >
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 mb-2">
                          {msg.details.includes('[PROJECT APPLICATION') ? (
                            <span className="px-2 py-0.5 bg-blue-900 text-white text-[9px] font-bold uppercase tracking-widest rounded-md">Project App</span>
                          ) : (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[9px] font-bold uppercase tracking-widest rounded-md">General</span>
                          )}
                          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                            {new Date(msg.created_at || '').toLocaleDateString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-gray-900">{msg.name}</h4>
                        <p className="text-blue-900 text-sm font-semibold">{msg.phone}</p>
                      </div>
                      
                      <div className="flex-1 md:max-w-xl">
                        <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-wrap bg-gray-50/50 p-4 rounded-xl border border-gray-50">
                          {msg.details}
                        </p>
                      </div>

                      <div className="flex items-start">
                        <button 
                          onClick={async () => {
                            if (!confirm('Delete this message?')) return;
                            await supabase.from('messages').delete().eq('id', msg.id);
                            fetchMessages();
                          }}
                          className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
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
          <div className="p-4 md:p-10 max-w-2xl mx-auto w-full">
            <div className="mb-6 md:mb-10">
              <h2 className="text-xl md:text-2xl font-extrabold text-gray-900 tracking-tight">Security Settings</h2>
              <p className="text-gray-500 text-xs md:text-sm mt-1">Manage your admin access and passwords</p>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-[24px] md:rounded-3xl border border-gray-100 shadow-sm">
              <form onSubmit={handleUpdatePassword} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 mb-3">Change Admin Password</label>
                  <input 
                    type="password" 
                    placeholder="Enter new password" 
                    className="w-full px-4 py-4 rounded-2xl border border-gray-200 focus:ring-2 focus:ring-blue-900/10 focus:border-blue-900 outline-none transition-all text-sm"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <p className="mt-3 text-[10px] text-gray-400 font-bold uppercase tracking-widest italic">Updating default 'KAYOMBO123%' password</p>
                </div>
                
                <button 
                  type="submit"
                  className="w-full sm:w-auto rounded-full px-8 py-4 bg-blue-900 hover:bg-blue-800 text-white text-xs font-bold uppercase tracking-widest shadow-lg shadow-blue-900/20 flex items-center justify-center gap-2 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Changes
                </button>
                {saveStatus && <p className="text-[10px] font-bold text-blue-900 uppercase tracking-[0.2em] mt-4">{saveStatus}</p>}
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
