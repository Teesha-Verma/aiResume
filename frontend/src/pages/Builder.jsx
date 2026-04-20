import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ResumeForm from '../components/ResumeForm';
import ResumePreview from '../components/ResumePreview';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Save, Download, ArrowLeft, Check } from 'lucide-react';

const Builder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [resume, setResume] = useState({
    title: 'My Resume',
    personalInfo: { firstName: '', lastName: '', email: '', phone: '', address: '', linkedIn: '', github: '', portfolio: '', summary: '' },
    experience: [],
    education: [],
    skills: [],
    projects: []
  });

  useEffect(() => {
    const fetchResume = async () => {
      if (!id) { setLoading(false); return; }
      try {
        const response = await api.get(`/resumes/${id}`);
        setResume(response.data);
      } catch (error) {
        console.error('Failed to fetch resume:', error);
        toast.error('Failed to load resume.');
      } finally {
        setLoading(false);
      }
    };
    fetchResume();
  }, [id]);

  const handleSave = async () => {
    setSaving(true);
    try {
      if (id) {
        await api.put(`/resumes/${id}`, resume);
      } else {
        const res = await api.post('/resumes', resume);
        navigate(`/builder/${res.data._id}`);
      }
      setSaveSuccess(true);
      toast.success('Resume saved successfully!');
      setTimeout(() => setSaveSuccess(false), 2000);
    } catch (error) {
      console.error('Failed to save resume:', error);
      toast.error('Failed to save resume.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownload = async () => {
    try {
      setSaving(true);
      const { toPng } = await import('html-to-image');
      const { jsPDF } = await import('jspdf');
      
      const element = document.getElementById('resume-preview-content');
      
      // Temporarily set a fixed width for perfect rendering
      const originalStyle = element.style.cssText;
      element.style.width = '816px'; 
      element.style.minHeight = '1056px';

      const dataUrl = await toPng(element, { 
        quality: 1.0, 
        pixelRatio: 2,
        backgroundColor: '#ffffff'
      });
      
      element.style.cssText = originalStyle;

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: 'letter'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(dataUrl, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`${resume.title || 'Resume'}.pdf`);
      toast.success('PDF downloaded!');
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      toast.error('Error generating PDF. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--gradient-dark)' }}>
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden" style={{ background: '#0f172a' }}>
      <Navbar />
      
      {/* Toolbar */}
      <div className="flex-none border-b border-white/[0.06] px-4 sm:px-6 py-3 flex justify-between items-center z-10"
        style={{ background: 'rgba(15, 23, 42, 0.8)', backdropFilter: 'blur(12px)' }}
      >
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')} 
            className="p-2 text-surface-500 hover:text-surface-300 hover:bg-white/[0.04] rounded-lg transition-all duration-200 cursor-pointer"
            aria-label="Back to dashboard"
          >
            <ArrowLeft size={20} />
          </button>
          <input 
            type="text" 
            value={resume.title} 
            onChange={(e) => setResume({...resume, title: e.target.value})}
            className="text-lg font-bold text-white border-none outline-none bg-transparent hover:bg-white/[0.03] focus:bg-white/[0.05] px-3 py-1.5 rounded-lg w-48 sm:w-64 transition-colors"
            placeholder="Resume Title"
          />
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <button 
            onClick={handleSave} 
            disabled={saving}
            className={`btn-secondary !py-2 !px-3 sm:!px-4 !text-sm !rounded-lg
              ${saveSuccess ? '!border-emerald-500/30 !text-emerald-300 !bg-emerald-500/10' : ''}
            `}
          >
            {saveSuccess ? <Check size={16} /> : <Save size={16} />}
            <span className="hidden sm:inline">{saving ? 'Saving...' : saveSuccess ? 'Saved!' : 'Save'}</span>
          </button>
          <button 
            onClick={handleDownload} 
            disabled={saving}
            className="btn-primary !py-2 !px-3 sm:!px-4 !text-sm !rounded-lg"
          >
            <Download size={16} />
            <span className="hidden sm:inline">Download PDF</span>
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
        {/* Form Section - Scrollable */}
        <div className="w-full md:w-[45%] lg:w-[42%] flex-shrink-0 overflow-y-auto p-4 sm:p-6"
          style={{ background: '#0f172a' }}
        >
          <ResumeForm resume={resume} setResume={setResume} />
        </div>

        {/* Divider */}
        <div className="hidden md:block w-px bg-white/[0.06]" />

        {/* Preview Section - Scrollable */}
        <div className="w-full md:flex-1 overflow-y-auto p-4 sm:p-8 flex justify-center items-start"
          style={{ background: '#1e293b' }}
        >
          <div className="resume-preview-container max-w-full w-full mx-auto pb-10" style={{ maxWidth: '800px' }}>
            <ResumePreview resume={resume} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Builder;
