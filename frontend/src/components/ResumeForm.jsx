import React, { useState } from 'react';
import api from '../services/api';
import { useToast } from '../context/ToastContext';
import { Sparkles, Plus, Trash2, ChevronDown, ChevronUp, Briefcase, GraduationCap, Wrench, Palette, Wand2 } from 'lucide-react';

const ResumeForm = ({ resume, setResume }) => {
  const [aiLoading, setAiLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('ai');
  const [targetRole, setTargetRole] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const toast = useToast();

  const handleAutoFill = async () => {
    if (!targetRole) return toast.warning('Please enter a target role first!');
    if (!window.confirm('This will overwrite your existing resume content. Continue?')) return;
    setAiLoading(true);
    try {
      const res = await api.post('/ai/generate-full', { role: targetRole });
      if (res.data?.resumeData) {
        setResume({ ...resume, ...res.data.resumeData });
        toast.success('Resume auto-filled successfully!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to auto-generate resume.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleGetRecommendations = async () => {
    if (!targetRole) return toast.warning('Please enter a target role first!');
    setAiLoading(true);
    try {
      const res = await api.post('/ai/recommendations', { role: targetRole, resumeData: resume });
      if (res.data?.recommendations) {
        setRecommendations(res.data.recommendations);
        toast.success('Recommendations generated!');
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to get recommendations.');
    } finally {
      setAiLoading(false);
    }
  };

  const updatePersonalInfo = (field, value) => {
    setResume({
      ...resume,
      personalInfo: {
        ...resume.personalInfo,
        [field]: value
      }
    });
  };

  const handleArrayUpdate = (field, index, subField, value) => {
    const updatedArray = [...resume[field]];
    updatedArray[index][subField] = value;
    setResume({ ...resume, [field]: updatedArray });
  };

  const addItem = (field, defaultItem) => {
    setResume({ ...resume, [field]: [...resume[field], defaultItem] });
  };

  const removeItem = (field, index) => {
    const updatedArray = [...resume[field]];
    updatedArray.splice(index, 1);
    setResume({ ...resume, [field]: updatedArray });
  };

  const generateSummaryWithAI = async () => {
    setAiLoading(true);
    try {
      const currentRole = targetRole || resume.experience?.[0]?.title || 'Professional';
      const currentDraft = resume.personalInfo?.summary || '';
      
      const response = await api.post('/ai/generate-summary', { 
        title: currentRole,
        experience: resume.experience?.map(e => `${e.title} at ${e.company} doing ${e.description}`).join('. '),
        currentSummary: currentDraft
      });
      if (response.data?.summary) {
        updatePersonalInfo('summary', response.data.summary);
        toast.success('Summary generated with AI!');
      }
    } catch (error) {
      console.error('Failed to generate summary:', error);
      toast.error('Failed to generate summary.');
    } finally {
      setAiLoading(false);
    }
  };

  const improveBulletsWithAI = async (index) => {
    setAiLoading(true);
    try {
      const text = resume.experience[index].description;
      const role = resume.experience[index].title || 'Professional';
      if (!text) return;

      const response = await api.post('/ai/improve-bullets', { text, role });
      if (response.data?.improvedText) {
        handleArrayUpdate('experience', index, 'description', response.data.improvedText);
        toast.success('Bullets polished with AI!');
      }
    } catch (error) {
      console.error('Failed to improve bullets:', error);
      toast.error('Failed to improve bullets.');
    } finally {
      setAiLoading(false);
    }
  };

  const suggestSkillsWithAI = async () => {
    setAiLoading(true);
    try {
      const currentRole = resume.experience?.[0]?.title || 'Professional';
      const response = await api.post('/ai/suggest-skills', { role: currentRole });
      if (response.data?.skills) {
        const newSkills = response.data.skills.split(',').map(s => s.trim());
        setResume({ ...resume, skills: [...new Set([...resume.skills, ...newSkills])] });
        toast.success('Skills suggested by AI!');
      }
    } catch (error) {
      console.error('Failed to suggest skills:', error);
      toast.error('Failed to suggest skills.');
    } finally {
      setAiLoading(false);
    }
  };

  const sectionIcons = {
    ai: <Wand2 size={18} />,
    theme: <Palette size={18} />,
    personal: <span className="text-base">👤</span>,
    experience: <Briefcase size={18} />,
    education: <GraduationCap size={18} />,
    skills: <Wrench size={18} />,
  };

  const AccordionHeader = ({ title, tabKey }) => (
    <button
      className={`w-full flex justify-between items-center px-5 py-4 cursor-pointer transition-all duration-200 rounded-t-xl
        ${activeTab === tabKey 
          ? 'bg-brand-500/10 text-brand-300' 
          : 'text-surface-300 hover:bg-white/[0.03]'
        }`}
      onClick={() => setActiveTab(activeTab === tabKey ? null : tabKey)}
      aria-expanded={activeTab === tabKey}
    >
      <div className="flex items-center gap-3">
        <span className={activeTab === tabKey ? 'text-brand-400' : 'text-surface-500'}>
          {sectionIcons[tabKey]}
        </span>
        <h3 className="font-semibold text-[0.9375rem]">{title}</h3>
      </div>
      <span className={`transition-transform duration-200 ${activeTab === tabKey ? 'rotate-180' : ''}`}>
        <ChevronDown size={18} />
      </span>
    </button>
  );

  return (
    <div className="space-y-4">
      {/* AI Automations */}
      <div className="glass-card overflow-hidden">
        <AccordionHeader title="AI Automations & Recommendations ✨" tabKey="ai" />
        {activeTab === 'ai' && (
          <div className="p-5 border-t border-white/[0.06] animate-slide-down">
            <div className="mb-4">
              <label className="form-label">Target Job Role</label>
              <input 
                type="text" 
                placeholder="e.g. Senior Frontend Engineer" 
                className="input-field"
                value={targetRole} 
                onChange={(e) => setTargetRole(e.target.value)} 
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <button 
                onClick={handleAutoFill}
                disabled={aiLoading}
                className="btn-primary flex-1 !text-sm !py-2.5"
              >
                <Sparkles size={15} /> Auto-Fill Entire Resume
              </button>
              <button 
                onClick={handleGetRecommendations}
                disabled={aiLoading}
                className="btn-secondary flex-1 !text-sm !py-2.5"
              >
                <Sparkles size={15} /> Get AI Recommendations
              </button>
            </div>
            
            {recommendations.length > 0 && (
              <div className="mt-4 p-4 rounded-xl bg-brand-500/[0.06] border border-brand-500/10 animate-slide-up">
                <h4 className="font-bold text-brand-300 mb-2 text-sm">💡 AI Suggestions for this role:</h4>
                <ul className="text-sm text-surface-300 space-y-2 list-disc pl-5">
                  {recommendations.map((rec, i) => (
                    <li key={i} className="leading-relaxed">{rec}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Theme Settings */}
      <div className="glass-card overflow-hidden">
        <AccordionHeader title="Theme Settings" tabKey="theme" />
        {activeTab === 'theme' && (
          <div className="p-5 border-t border-white/[0.06] flex flex-col md:flex-row gap-3 animate-slide-down">
            {[
              { id: 'modern', label: 'Modern', color: 'brand' },
              { id: 'elegant', label: 'Elegant', color: 'purple' },
              { id: 'professional', label: 'Professional', color: 'emerald' },
            ].map(t => (
              <button 
                key={t.id}
                onClick={() => setResume({...resume, theme: t.id})}
                className={`flex-1 py-3.5 rounded-xl text-center font-bold transition-all duration-200 border-2 cursor-pointer
                  ${(resume.theme === t.id || (!resume.theme && t.id === 'modern'))
                    ? `border-${t.color}-500/40 bg-${t.color}-500/10 text-${t.color}-300 shadow-lg shadow-${t.color}-500/5`
                    : 'border-white/[0.08] bg-white/[0.02] text-surface-400 hover:border-white/[0.15] hover:text-surface-300'
                  }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Personal Information */}
      <div className="glass-card overflow-hidden">
        <AccordionHeader title="Personal Information" tabKey="personal" />
        {activeTab === 'personal' && (
          <div className="p-5 border-t border-white/[0.06] space-y-4 animate-slide-down">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="form-label">First Name</label>
                <input type="text" className="input-field" placeholder="John" value={resume.personalInfo?.firstName || ''} onChange={(e) => updatePersonalInfo('firstName', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Last Name</label>
                <input type="text" className="input-field" placeholder="Doe" value={resume.personalInfo?.lastName || ''} onChange={(e) => updatePersonalInfo('lastName', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input type="email" className="input-field" placeholder="john@example.com" value={resume.personalInfo?.email || ''} onChange={(e) => updatePersonalInfo('email', e.target.value)} />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input type="text" className="input-field" placeholder="+1 (555) 000-0000" value={resume.personalInfo?.phone || ''} onChange={(e) => updatePersonalInfo('phone', e.target.value)} />
              </div>
              <div className="sm:col-span-2">
                <label className="form-label">Address / Location</label>
                <input type="text" className="input-field" placeholder="City, State/Country" value={resume.personalInfo?.address || ''} onChange={(e) => updatePersonalInfo('address', e.target.value)} />
              </div>
              <div>
                <label className="form-label">LinkedIn URL</label>
                <input type="text" className="input-field" placeholder="linkedin.com/in/johndoe" value={resume.personalInfo?.linkedIn || ''} onChange={(e) => updatePersonalInfo('linkedIn', e.target.value)} />
              </div>
              <div>
                <label className="form-label">GitHub / Portfolio</label>
                <input type="text" className="input-field" placeholder="github.com/johndoe" value={resume.personalInfo?.github || ''} onChange={(e) => updatePersonalInfo('github', e.target.value)} />
              </div>
            </div>
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="form-label !mb-0">Professional Summary</label>
                <button 
                  onClick={generateSummaryWithAI} 
                  disabled={aiLoading}
                  className="btn-ai"
                >
                  <Sparkles size={13} /> Generate with AI
                </button>
              </div>
              <textarea 
                className="input-field !h-24 resize-none" 
                value={resume.personalInfo?.summary || ''} 
                onChange={(e) => updatePersonalInfo('summary', e.target.value)}
                placeholder="Briefly describe your professional background and key strengths..."
              />
            </div>
          </div>
        )}
      </div>

      {/* Experience */}
      <div className="glass-card overflow-hidden">
        <AccordionHeader title="Experience" tabKey="experience" />
        {activeTab === 'experience' && (
          <div className="p-5 border-t border-white/[0.06] space-y-5 animate-slide-down">
            {resume.experience?.map((exp, index) => (
              <div key={index} className="glass-card-light p-4 relative group">
                <button 
                  onClick={() => removeItem('experience', index)}
                  className="absolute top-3 right-3 text-surface-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  aria-label="Remove experience"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3 pr-8">
                  <div>
                    <label className="form-label text-xs">Job Title</label>
                    <input type="text" className="input-field !py-2 !text-sm" placeholder="Software Engineer" value={exp.title || ''} onChange={(e) => handleArrayUpdate('experience', index, 'title', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label text-xs">Company</label>
                    <input type="text" className="input-field !py-2 !text-sm" placeholder="Google" value={exp.company || ''} onChange={(e) => handleArrayUpdate('experience', index, 'company', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label text-xs">Start Date</label>
                    <input type="text" className="input-field !py-2 !text-sm" placeholder="Jan 2020" value={exp.startDate || ''} onChange={(e) => handleArrayUpdate('experience', index, 'startDate', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label text-xs">End Date</label>
                    <input type="text" className="input-field !py-2 !text-sm" placeholder="Present" value={exp.endDate || ''} onChange={(e) => handleArrayUpdate('experience', index, 'endDate', e.target.value)} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="form-label text-xs !mb-0">Description / Responsibilities</label>
                    <button 
                      onClick={() => improveBulletsWithAI(index)} 
                      disabled={aiLoading}
                      className="btn-ai !text-[11px]"
                    >
                      <Sparkles size={12} /> Polish with AI
                    </button>
                  </div>
                  <textarea 
                    className="input-field !h-20 !text-sm resize-none" 
                    value={exp.description || ''} 
                    onChange={(e) => handleArrayUpdate('experience', index, 'description', e.target.value)}
                    placeholder="- Developed a new feature...&#10;- Improved performance by..."
                  />
                </div>
              </div>
            ))}
            <button 
              onClick={() => addItem('experience', { title: '', company: '', location: '', startDate: '', endDate: '', description: '' })}
              className="flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium py-3 px-4 border border-dashed border-brand-500/20 hover:border-brand-500/40 rounded-xl w-full justify-center transition-all duration-200 hover:bg-brand-500/[0.04] cursor-pointer"
            >
              <Plus size={18} /> Add Experience
            </button>
          </div>
        )}
      </div>

      {/* Education */}
      <div className="glass-card overflow-hidden">
        <AccordionHeader title="Education" tabKey="education" />
        {activeTab === 'education' && (
          <div className="p-5 border-t border-white/[0.06] space-y-5 animate-slide-down">
            {resume.education?.map((edu, index) => (
              <div key={index} className="glass-card-light p-4 relative group">
                <button 
                  onClick={() => removeItem('education', index)}
                  className="absolute top-3 right-3 text-surface-600 hover:text-red-400 p-1.5 rounded-lg hover:bg-red-500/10 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
                  aria-label="Remove education"
                >
                  <Trash2 size={16} />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pr-8">
                  <div className="sm:col-span-2 md:col-span-1">
                    <label className="form-label text-xs">School / University</label>
                    <input type="text" className="input-field !py-2 !text-sm" placeholder="MIT" value={edu.school || ''} onChange={(e) => handleArrayUpdate('education', index, 'school', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label text-xs">Degree</label>
                    <input type="text" className="input-field !py-2 !text-sm" placeholder="B.S." value={edu.degree || ''} onChange={(e) => handleArrayUpdate('education', index, 'degree', e.target.value)} />
                  </div>
                  <div>
                    <label className="form-label text-xs">Field of Study</label>
                    <input type="text" className="input-field !py-2 !text-sm" placeholder="Computer Science" value={edu.fieldOfStudy || ''} onChange={(e) => handleArrayUpdate('education', index, 'fieldOfStudy', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="form-label text-xs">Start</label>
                      <input type="text" className="input-field !py-2 !text-sm" placeholder="2018" value={edu.startDate || ''} onChange={(e) => handleArrayUpdate('education', index, 'startDate', e.target.value)} />
                    </div>
                    <div>
                      <label className="form-label text-xs">End</label>
                      <input type="text" className="input-field !py-2 !text-sm" placeholder="2022" value={edu.endDate || ''} onChange={(e) => handleArrayUpdate('education', index, 'endDate', e.target.value)} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <button 
              onClick={() => addItem('education', { school: '', degree: '', fieldOfStudy: '', startDate: '', endDate: '' })}
              className="flex items-center gap-2 text-brand-400 hover:text-brand-300 font-medium py-3 px-4 border border-dashed border-brand-500/20 hover:border-brand-500/40 rounded-xl w-full justify-center transition-all duration-200 hover:bg-brand-500/[0.04] cursor-pointer"
            >
              <Plus size={18} /> Add Education
            </button>
          </div>
        )}
      </div>

      {/* Skills */}
      <div className="glass-card overflow-hidden">
        <AccordionHeader title="Skills" tabKey="skills" />
        {activeTab === 'skills' && (
          <div className="p-5 border-t border-white/[0.06] animate-slide-down">
            <div className="flex justify-between items-center mb-2">
              <label className="form-label !mb-0">Comma separated list of skills</label>
              <button 
                onClick={suggestSkillsWithAI} 
                disabled={aiLoading}
                className="btn-ai"
              >
                <Sparkles size={13} /> AI Suggestions
              </button>
            </div>
            <textarea 
              className="input-field !h-24 resize-none" 
              value={(resume.skills || []).join(', ')} 
              onChange={(e) => setResume({...resume, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s !== '')})}
              placeholder="React, Node.js, Project Management, Graphic Design..."
            />
            <div className="mt-4 flex flex-wrap gap-2">
              {(resume.skills || []).filter(s => s).map((skill, index) => (
                <span key={index} className="px-3 py-1 bg-brand-500/10 text-brand-300 rounded-full text-xs font-medium border border-brand-500/15">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeForm;
