import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, Download, Palette, ArrowRight, Zap, Shield } from 'lucide-react';

const Home = () => {
  const features = [
    {
      icon: <Sparkles size={24} />,
      title: 'AI-Powered Content',
      desc: 'Generate professional summaries, polish bullet points, and get smart skill suggestions powered by AI.',
    },
    {
      icon: <Palette size={24} />,
      title: 'Premium Templates',
      desc: 'Choose from Modern, Elegant, and Professional themes designed to impress recruiters.',
    },
    {
      icon: <Download size={24} />,
      title: 'PDF Export',
      desc: 'Export your resume as a pixel-perfect PDF ready for any job application.',
    },
  ];

  const stats = [
    { value: '10K+', label: 'Resumes Created' },
    { value: '3', label: 'Pro Templates' },
    { value: '95%', label: 'Satisfaction' },
  ];

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--gradient-dark)' }}>
      {/* Navbar placeholder for Home */}
      <nav className="w-full px-6 py-5 flex justify-between items-center max-w-7xl mx-auto">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--gradient-brand)' }}>
            <FileText size={20} className="text-white" />
          </div>
          <span className="text-lg font-bold text-white tracking-tight">
            AI Resume<span className="gradient-text"> Builder</span>
          </span>
        </Link>
        <div className="flex items-center gap-3">
          <Link to="/login" className="text-sm font-medium text-surface-400 hover:text-white px-4 py-2 transition-colors">
            Login
          </Link>
          <Link to="/signup" className="btn-primary !py-2.5 !px-5 !text-sm !rounded-xl">
            Get Started <ArrowRight size={16} />
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex-1 flex flex-col items-center justify-center px-6 py-20 relative overflow-hidden">
        {/* Background gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-brand-600/20 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[128px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-4xl mx-auto animate-slide-up">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-500/10 border border-brand-500/20 text-brand-300 text-sm font-medium mb-8">
            <Zap size={14} />
            Powered by AI
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6">
            <span className="text-white">Build Your Perfect</span>
            <br />
            <span className="gradient-text">Resume with AI</span>
          </h1>

          <p className="text-lg sm:text-xl text-surface-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create professional, ATS-optimized resumes in minutes. 
            Let AI write your content, choose a beautiful template, 
            and export to PDF — all for free.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link to="/signup" className="btn-primary !py-3.5 !px-8 !text-base !rounded-xl w-full sm:w-auto">
              <Sparkles size={18} /> Start Building — Free
            </Link>
            <Link to="/login" className="btn-secondary !py-3.5 !px-8 !text-base !rounded-xl w-full sm:w-auto">
              <Shield size={18} /> Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-center gap-8 sm:gap-16">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-xs sm:text-sm text-surface-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-7xl mx-auto w-full">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Everything you need to <span className="gradient-text">land the job</span>
          </h2>
          <p className="text-surface-400 max-w-xl mx-auto">
            Our AI-powered tools help you create the perfect resume in minutes, not hours.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 stagger-children">
          {features.map((f, i) => (
            <div key={i} className="glass-card p-7 hover:border-brand-500/20 transition-all duration-300 group">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 text-brand-400 bg-brand-500/10 group-hover:scale-110 transition-transform duration-300">
                {f.icon}
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-surface-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-20">
        <div className="max-w-3xl mx-auto text-center glass-card p-10 sm:p-14 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Ready to build your dream resume?
          </h2>
          <p className="text-surface-400 mb-8 max-w-lg mx-auto">
            Join thousands of professionals who've already created standout resumes with our AI builder.
          </p>
          <Link to="/signup" className="btn-primary !py-3.5 !px-8 !text-base !rounded-xl inline-flex">
            <Sparkles size={18} /> Get Started for Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: 'var(--gradient-brand)' }}>
              <FileText size={14} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-surface-400">AI Resume Builder</span>
          </div>
          <p className="text-xs text-surface-600">
            © {new Date().getFullYear()} AI Resume Builder. Built with ❤️ and AI.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
