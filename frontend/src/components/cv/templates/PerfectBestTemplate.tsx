import React from 'react';

export function PerfectBestTemplate({ data }: { data: any }) {
  const { personalInfo = {}, experience = [], education = [], skills = [], certifications = [], languages = [], references = [] } = data || {};
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-8 rounded shadow border max-w-4xl mx-auto font-[Inter]">
      {/* Left Column: Personal Info, Skills, Languages, Certifications */}
      <div className="space-y-6">
        <div>
          <div className="text-2xl font-bold mb-1 text-emerald-900">{personalInfo.fullName}</div>
          <div className="text-sm mb-2 text-gray-700">{personalInfo.email}</div>
          <div className="italic mb-2 text-gray-600">{personalInfo.summary}</div>
        </div>
        {skills.length > 0 && (
          <div>
            <div className="font-bold text-emerald-700 mb-1 uppercase tracking-wide text-sm">Skills</div>
            <div className="flex flex-wrap gap-1 mb-2">
              {skills.map((skill: string, idx: number) => (
                <span key={idx} className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded text-xs font-medium">{skill}</span>
              ))}
            </div>
          </div>
        )}
        {languages.length > 0 && (
          <div>
            <div className="font-bold text-emerald-700 mb-1 uppercase tracking-wide text-sm">Languages</div>
            <ul className="list-disc pl-5 text-xs text-gray-700">
              {languages.map((lang: any, idx: number) => (
                <li key={idx}>{lang.language} ({lang.proficiency})</li>
              ))}
            </ul>
          </div>
        )}
        {certifications.length > 0 && (
          <div>
            <div className="font-bold text-emerald-700 mb-1 uppercase tracking-wide text-sm">Certifications</div>
            <ul className="list-disc pl-5 text-xs text-gray-700">
              {certifications.map((cert: any, idx: number) => (
                <li key={idx}>{cert.name} - {cert.issuer} ({cert.date})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      {/* Right Column: Experience, Education, References */}
      <div className="space-y-6">
        {experience.length > 0 && (
          <div>
            <div className="font-bold text-emerald-700 mb-1 uppercase tracking-wide text-sm">Experience</div>
            <ul className="list-disc pl-5 text-xs text-gray-700 space-y-2">
              {experience.map((exp: any, idx: number) => (
                <li key={idx}>
                  <div className="font-semibold text-emerald-700">{exp.position}</div>
                  <div className="text-gray-600">{exp.company} | {exp.location} | {exp.startDate} - {exp.endDate}</div>
                  <div>{exp.description}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {education.length > 0 && (
          <div>
            <div className="font-bold text-emerald-700 mb-1 uppercase tracking-wide text-sm">Education</div>
            <ul className="list-disc pl-5 text-xs text-gray-700 space-y-2">
              {education.map((edu: any, idx: number) => (
                <li key={idx}>
                  <div className="font-semibold text-emerald-700">{edu.degree} in {edu.field}</div>
                  <div className="text-gray-600">{edu.institution} | {edu.startDate} - {edu.endDate}</div>
                  <div>GPA: {edu.gpa}</div>
                </li>
              ))}
            </ul>
          </div>
        )}
        {references.length > 0 && (
          <div>
            <div className="font-bold text-emerald-700 mb-1 uppercase tracking-wide text-sm">References</div>
            <ul className="list-disc pl-5 text-xs text-gray-700">
              {references.map((ref: any, idx: number) => (
                <li key={idx}>{ref.name} - {ref.title}, {ref.company} ({ref.email}, {ref.phone})</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
} 