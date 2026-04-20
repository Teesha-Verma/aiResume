import React from 'react';

const ResumePreview = ({ resume }) => {
  const { personalInfo = {}, experience = [], education = [], skills = [], theme = 'modern' } = resume || {};

  const formatText = (text) => {
    if (!text) return null;
    return text.split('\n').map((line, i) => {
      const isBullet = line.trim().startsWith('-');
      const content = isBullet ? line.trim().substring(1).trim() : line;
      
      if (isBullet) {
        return (
          <li key={i} className="ml-4 list-disc leading-relaxed text-gray-700">
            {content}
          </li>
        );
      }
      return (
        <p key={i} className="mb-1 leading-relaxed text-gray-700">
          {content}
        </p>
      );
    });
  };

  const renderModern = () => (
    <div id="resume-preview-content" className="bg-white px-8 py-10 min-h-[1056px] w-[816px] text-gray-900 shadow-lg text-left" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="border-b-2 border-gray-800 pb-5 mb-5">
        <h1 className="text-4xl font-bold uppercase tracking-widest text-gray-900 mb-2">
          {personalInfo.firstName || 'First'} {personalInfo.lastName || 'Last'}
        </h1>
        <div className="flex flex-wrap gap-y-1 gap-x-3 text-sm font-medium text-gray-600">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.phone && <span>| {personalInfo.phone}</span>}
          {personalInfo.address && <span>| {personalInfo.address}</span>}
          {personalInfo.linkedIn && <span>| {personalInfo.linkedIn}</span>}
          {personalInfo.github && <span>| {personalInfo.github}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">Summary</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{personalInfo.summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">Experience</h2>
          <div className="space-y-4">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-start mb-1">
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{exp.title}</h3>
                    <div className="text-sm font-semibold text-blue-700">{exp.company}</div>
                  </div>
                  <div className="text-sm text-gray-500 font-medium">
                    {exp.startDate} - {exp.endDate}
                  </div>
                </div>
                <div className="mt-1.5 text-sm text-gray-700">
                  <ul className="list-inside">{formatText(exp.description)}</ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-3">Education</h2>
          <div className="space-y-3">
            {education.map((edu, index) => (
              <div key={index} className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-gray-900">{edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}</h3>
                  <div className="text-sm font-medium text-blue-700">{edu.school}</div>
                </div>
                <div className="text-sm text-gray-500 font-medium">
                  {edu.startDate} - {edu.endDate}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-5">
          <h2 className="text-lg font-bold uppercase tracking-widest text-gray-800 border-b border-gray-300 pb-1 mb-2">Skills</h2>
          <div className="flex flex-wrap text-sm font-medium text-gray-700">
            {skills.map((skill, index) => (
              <React.Fragment key={index}>
                <span className="bg-gray-100 rounded px-2 py-0.5 m-0.5 border border-gray-200">{skill}</span>
              </React.Fragment>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderElegant = () => (
    <div id="resume-preview-content" className="bg-white px-10 py-12 min-h-[1056px] w-[816px] text-gray-900 shadow-lg text-center" style={{ fontFamily: 'Georgia, serif' }}>
      <h1 className="text-5xl font-normal tracking-wide text-gray-900 mb-3" style={{ color: '#2c3e50' }}>
        {personalInfo.firstName || 'First Name'} {personalInfo.lastName || 'Last Name'}
      </h1>
      <div className="flex flex-wrap justify-center gap-2 text-sm text-gray-600 mb-8 border-t border-b border-gray-200 py-3">
        {personalInfo.email && <span>{personalInfo.email}</span>}
        {personalInfo.phone && <span>• {personalInfo.phone}</span>}
        {personalInfo.address && <span>• {personalInfo.address}</span>}
        {personalInfo.linkedIn && <span>• {personalInfo.linkedIn}</span>}
        {personalInfo.github && <span>• {personalInfo.github}</span>}
      </div>

      {personalInfo.summary && (
        <div className="mb-8 text-left">
          <p className="text-sm text-gray-700 italic leading-loose text-center max-w-2xl mx-auto">
            {personalInfo.summary}
          </p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-8 text-left">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 text-center border-b border-gray-300 pb-2" style={{ color: '#2c3e50' }}>Experience</h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-lg" style={{ color: '#2c3e50' }}>{exp.company}</h3>
                  <span className="text-sm text-gray-500 italic">{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="text-md italic text-gray-600 mb-2">{exp.title}</div>
                <div className="text-sm text-gray-700 font-sans">
                  <ul className="list-inside">{formatText(exp.description)}</ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-8 text-left">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 text-center border-b border-gray-300 pb-2" style={{ color: '#2c3e50' }}>Education</h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between items-baseline">
                  <h3 className="font-bold text-lg" style={{ color: '#2c3e50' }}>{edu.school}</h3>
                  <span className="text-sm text-gray-500 italic">{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-sm text-gray-700 font-sans mt-0.5">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-8 text-left">
          <h2 className="text-xl font-bold uppercase tracking-widest mb-4 text-center border-b border-gray-300 pb-2" style={{ color: '#2c3e50' }}>Skills</h2>
          <p className="text-sm leading-relaxed text-center font-sans">
            {skills.join('  •  ')}
          </p>
        </div>
      )}
    </div>
  );

  const renderProfessional = () => (
    <div id="resume-preview-content" className="bg-white px-8 py-10 min-h-[1056px] w-[816px] text-gray-900 shadow-lg text-left" style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-1 leading-tight">
          {personalInfo.firstName || 'First'} {personalInfo.lastName || 'Last'}
        </h1>
        <div className="text-[13px] text-gray-700 mt-1 space-x-2 flex flex-wrap justify-center">
          {personalInfo.address && <span>{personalInfo.address} |</span>}
          {personalInfo.phone && <span>{personalInfo.phone} |</span>}
          {personalInfo.email && <span>{personalInfo.email} |</span>}
          {personalInfo.linkedIn && <span>{personalInfo.linkedIn}</span>}
        </div>
      </div>

      {personalInfo.summary && (
        <div className="mb-4">
          <p className="text-[13px] text-gray-800 leading-relaxed text-justify">{personalInfo.summary}</p>
        </div>
      )}

      {experience && experience.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[15px] font-bold uppercase text-gray-900 border-b-[1.5px] border-black pb-0.5 mb-2">Relevant Experience</h2>
          <div className="space-y-3">
            {experience.map((exp, index) => (
              <div key={index}>
                <div className="flex justify-between font-bold text-[14px] text-gray-900">
                  <span>{exp.company}</span>
                  <span>{exp.startDate} - {exp.endDate}</span>
                </div>
                <div className="italic text-[13px] text-gray-800 mb-1">{exp.title}</div>
                <div className="text-[13px] text-gray-800 ml-1">
                  <ul className="list-inside">{formatText(exp.description)}</ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {education && education.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[15px] font-bold uppercase text-gray-900 border-b-[1.5px] border-black pb-0.5 mb-2">Education</h2>
          <div className="space-y-2">
            {education.map((edu, index) => (
              <div key={index}>
                <div className="flex justify-between font-bold text-[14px] text-gray-900">
                  <span>{edu.school}</span>
                  <span>{edu.startDate} - {edu.endDate}</span>
                </div>
                <div className="text-[13px] text-gray-800">
                  {edu.degree} {edu.fieldOfStudy ? `in ${edu.fieldOfStudy}` : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skills && skills.length > 0 && (
        <div className="mb-4">
          <h2 className="text-[15px] font-bold uppercase text-gray-900 border-b-[1.5px] border-black pb-0.5 mb-2">Highlights & Skills</h2>
          <div className="text-[13px] text-gray-800">
            <span className="font-bold">Core Competencies: </span>
            {skills.join(', ')}
          </div>
        </div>
      )}
    </div>
  );

  // Return exactly the correct markup layout depending on user's selected theme
  if (theme === 'elegant') return renderElegant();
  if (theme === 'professional') return renderProfessional();
  return renderModern();
};

export default ResumePreview;
