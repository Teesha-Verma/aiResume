import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Navbar from '../components/Navbar';
import SkeletonCard from '../components/ui/SkeletonCard';
import { useToast } from '../context/ToastContext';
import { Plus, Edit2, Trash2, FileText, LayoutTemplate, Sparkles } from 'lucide-react';

const Dashboard = () => {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/resumes');
        setResumes(response.data);
      } catch (error) {
        console.error('Failed to fetch resumes:', error);
        toast.error('Failed to load resumes.');
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        await api.delete(`/resumes/${id}`);
        setResumes(resumes.filter(resume => resume._id !== id));
        toast.success('Resume deleted.');
      } catch (error) {
        console.error('Failed to delete resume:', error);
        toast.error('Failed to delete resume.');
      }
    }
  };

  const handleCreateNew = async (theme = 'modern') => {
    try {
      const response = await api.post('/resumes', { title: `Untitled Resume (${theme})`, theme });
      navigate(`/builder/${response.data._id}`);
    } catch (error) {
      console.error('Failed to create resume:', error);
      toast.error('Failed to create resume.');
    }
  };

  const templates = [
    { id: 'modern', name: 'Modern', desc: 'Clean, bold, and contemporary design.', gradient: 'from-brand-500/20 to-cyan-500/10', accent: 'brand' },
    { id: 'elegant', name: 'Elegant', desc: 'Sophisticated serif fonts and classic borders.', gradient: 'from-purple-500/20 to-pink-500/10', accent: 'purple' },
    { id: 'professional', name: 'Professional', desc: 'Compact and traditional for corporate roles.', gradient: 'from-emerald-500/20 to-teal-500/10', accent: 'emerald' },
  ];

  const themeColors = {
    modern: '#6366f1',
    elegant: '#a855f7',
    professional: '#10b981',
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-dark)' }}>
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Templates Section */}
        <div className="mb-12 animate-slide-up">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-brand-500/10">
              <LayoutTemplate size={20} className="text-brand-400" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Start from a Template</h2>
              <p className="text-sm text-surface-500">Choose a theme and begin building</p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger-children">
            {templates.map(tpl => (
              <button
                key={tpl.id}
                onClick={() => handleCreateNew(tpl.id)}
                className="glass-card group text-left p-6 hover:border-brand-500/20 transition-all duration-300 cursor-pointer relative overflow-hidden"
              >
                {/* Gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${tpl.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{tpl.name}</h3>
                    <div className="w-4 h-4 rounded-full" style={{ background: themeColors[tpl.id] }} />
                  </div>
                  <p className="text-sm text-surface-400 mb-5 leading-relaxed">{tpl.desc}</p>
                  <div className="flex items-center gap-2 text-sm font-semibold text-brand-400 group-hover:text-brand-300 transition-colors">
                    <Plus size={16} /> Create Resume
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* My Resumes */}
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white mb-1">My Resumes</h2>
            <p className="text-sm text-surface-500">{resumes.length} resume{resumes.length !== 1 ? 's' : ''} saved</p>
          </div>
        </div>

        {loading ? (
          <SkeletonCard count={3} />
        ) : resumes.length === 0 ? (
          <div className="text-center py-20 glass-card animate-fade-in">
            <FileText size={48} className="mx-auto text-surface-600 mb-5" />
            <h3 className="text-xl font-semibold text-surface-300 mb-2">No resumes yet</h3>
            <p className="text-surface-500 mb-6">Pick a template above to create your first resume!</p>
            <button
              onClick={() => handleCreateNew('modern')}
              className="btn-primary !py-3 !px-6 !rounded-xl mx-auto"
            >
              <Sparkles size={18} /> Create Your First Resume
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 stagger-children">
            {resumes.map(resume => (
              <div key={resume._id} className="glass-card overflow-hidden group hover:border-brand-500/15 transition-all duration-300">
                {/* Card preview header */}
                <div className="h-28 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${themeColors[resume.theme] || themeColors.modern}15, transparent)` }}>
                  <div className="absolute inset-0 flex flex-col p-4">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-surface-500 mb-2">
                      {resume.theme || 'modern'} theme
                    </span>
                    <div className="space-y-1.5">
                      <div className="h-2 w-1/3 bg-white/[0.06] rounded" />
                      <div className="h-1.5 w-full bg-white/[0.04] rounded" />
                      <div className="h-1.5 w-5/6 bg-white/[0.04] rounded" />
                      <div className="h-1.5 w-2/3 bg-white/[0.04] rounded" />
                    </div>
                  </div>
                </div>
                {/* Card body */}
                <div className="p-5 flex justify-between items-start border-t border-white/[0.04]">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-white mb-1 truncate" title={resume.title}>
                      {resume.title || 'Untitled Resume'}
                    </h3>
                    <p className="text-xs text-surface-500">
                      Updated {new Date(resume.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-1.5 ml-3 flex-shrink-0">
                    <Link 
                      to={`/builder/${resume._id}`}
                      className="p-2 text-brand-400 bg-brand-500/10 rounded-lg hover:bg-brand-500/20 transition-all duration-200"
                      title="Edit"
                    >
                      <Edit2 size={15} />
                    </Link>
                    <button 
                      onClick={() => handleDelete(resume._id)}
                      className="p-2 text-red-400 bg-red-500/10 rounded-lg hover:bg-red-500/20 transition-all duration-200 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
