import React from 'react';

interface FounderVisionaryTemplateProps {
  data: any;
  templateName?: string;
}

export function FounderVisionaryTemplate({ data, templateName }: FounderVisionaryTemplateProps) {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
    certifications = [],
    languages = [],
    references = [],
  } = data || {};

  return (
    <div className="bg-white rounded-lg shadow-md border border-amber-300 p-8 max-w-4xl mx-auto">
      {/* Top Section: Name and Personal Information (Full Width) */}
      <div className="text-center mb-8 border-b-2 border-amber-200 pb-6">
        <h1 className="text-4xl font-extrabold text-amber-600 tracking-tight uppercase mb-2">
          {personalInfo.fullName || 'Your Name'}
        </h1>
        <div className="text-xl text-gray-700 font-semibold mb-4">
          {personalInfo.jobTitle || 'Professional Title'}
        </div>
        <div className="text-sm text-gray-600 space-y-1">
          {personalInfo.email && <div>{personalInfo.email}</div>}
          {personalInfo.phone && <div>{personalInfo.phone}</div>}
          {personalInfo.location && <div>{personalInfo.location}</div>}
          {(personalInfo.linkedIn || personalInfo.website) && (
            <div className="flex justify-center gap-4 mt-2">
              {personalInfo.linkedIn && (
                <a href={personalInfo.linkedIn} className="text-amber-700 underline" target="_blank" rel="noopener noreferrer">
                  LinkedIn
                </a>
              )}
              {personalInfo.website && (
                <a href={personalInfo.website} className="text-amber-700 underline" target="_blank" rel="noopener noreferrer">
                  Portfolio
                </a>
              )}
            </div>
          )}
        </div>
        {personalInfo.summary && (
          <div className="mt-4 text-gray-700 text-xs leading-relaxed max-w-4xl mx-auto px-4">
            {personalInfo.summary}
          </div>
        )}
      </div>

      {/* Two Columns Below */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column: Skills + Languages + Education + Certifications */}
        <div className="space-y-6">
          {/* Skills */}
          <section>
            <h2 className="text-xl font-bold text-amber-700 border-b-2 border-amber-200 pb-1 mb-2 uppercase tracking-wide">Skills</h2>
            {skills.length === 0 ? (
              <div className="text-gray-400">No skills listed.</div>
            ) : (
              <ul className="flex flex-wrap gap-2">
                {skills.map((skill: string, idx: number) => (
                  <li key={idx} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold">{skill}</li>
                ))}
              </ul>
            )}
          </section>
          {/* Languages */}
          <section>
            <h2 className="text-lg font-bold text-amber-700 border-b border-amber-200 pb-1 mb-2 uppercase tracking-wide">Languages</h2>
            {languages.length === 0 ? (
              <div className="text-gray-400">No languages listed.</div>
            ) : (
              <ul className="space-y-1">
                {languages.map((lang: any) => (
                  <li key={lang.id} className="text-gray-700 text-sm">
                    {lang.language} <span className="text-xs text-gray-500">({lang.proficiency})</span>
                  </li>
                ))}
              </ul>
            )}
          </section>
          {/* Education */}
          <section>
            <h2 className="text-lg font-bold text-amber-700 border-b border-amber-200 pb-1 mb-2 uppercase tracking-wide">Education</h2>
            {education.length === 0 ? (
              <div className="text-gray-400">No education listed.</div>
            ) : (
              <ul className="space-y-3">
                {education.map((edu: any) => (
                  <li key={edu.id}>
                    <div className="font-semibold text-gray-800">{edu.degree} <span className="text-amber-600">@ {edu.institution}</span></div>
                    <div className="text-sm text-gray-500">{edu.field} | {edu.startDate} - {edu.endDate}</div>
                    {edu.gpa && <div className="text-xs text-gray-400">GPA: {edu.gpa}</div>}
                  </li>
                ))}
              </ul>
            )}
          </section>
          {/* Certifications */}
          <section>
            <h2 className="text-lg font-bold text-amber-700 border-b border-amber-200 pb-1 mb-2 uppercase tracking-wide">Certifications</h2>
            {certifications.length === 0 ? (
              <div className="text-gray-400">No certifications listed.</div>
            ) : (
              <ul className="space-y-2">
                {certifications.map((cert: any) => (
                  <li key={cert.id}>
                    <div className="font-semibold text-gray-800">{cert.name}</div>
                    <div className="text-xs text-gray-500">{cert.issuer} | {cert.date}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
        {/* Right Column: Experience Only */}
        <div className="space-y-6">
          {/* Experience */}
          <section>
            <h2 className="text-xl font-bold text-amber-700 border-b-2 border-amber-200 pb-1 mb-2 uppercase tracking-wide">Experience</h2>
            {experience.length === 0 ? (
              <div className="text-gray-400">No experience listed.</div>
            ) : (
              <ul className="space-y-4">
                {experience.map((exp: any) => (
                  <li key={exp.id} className="">
                    <div className="font-semibold text-lg text-gray-800">{exp.position} <span className="text-amber-600">@ {exp.company}</span></div>
                    <div className="text-sm text-gray-500">{exp.location} | {exp.startDate} - {exp.endDate || 'Present'}</div>
                    <div className="text-gray-700 mt-1 text-sm leading-relaxed">{exp.description}</div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
      {/* References (Full Width Below) */}
      {references.length > 0 && (
        <div className="mt-8 border-t-2 border-amber-200 pt-6">
          <section>
            <h2 className="text-lg font-bold text-amber-700 border-b border-amber-200 pb-1 mb-2 uppercase tracking-wide">References</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map((ref: any) => (
                <div key={ref.id} className="text-sm">
                  <div className="font-semibold text-gray-800">{ref.name}</div>
                  <div className="text-xs text-gray-500">{ref.title}, {ref.company}</div>
                  <div className="text-xs text-gray-500">{ref.email} | {ref.phone}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
} 