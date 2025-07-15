import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Save, Download, Eye, CheckCircle, Zap, Star, Mail, Phone, MapPin, Globe, Linkedin, Award, Calendar, Building } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { getSampleDataForTemplate } from '@/data/sampleCVData';
import CVPreview from '@/components/cv-builder/CVPreview';
import { cvOperations, CVData as DBCVData } from '@/lib/supabase';
import { toast } from 'sonner';
import { CVData } from '@/lib/cv/types';
import CVTemplateSelector from '@/components/cv/CVTemplateSelector';

interface Template {
  id: string;
  name: string;
  description: string;
  preview: string;
  category: 'professional' | 'creative' | 'minimal' | 'executive' | 'technical';
  isPremium?: boolean;
  atsScore: number;
  popularity: number;
  features: string[];
}

const templates: Template[] = [
  // Professional Templates
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    description: 'Clean, contemporary design perfect for business and tech roles',
    preview: '/api/placeholder/300/400',
    category: 'professional',
    atsScore: 95,
    popularity: 1,
    features: ['ATS Optimized', 'Clean Layout', 'Professional Fonts']
  },
  {
    id: 'corporate-executive',
    name: 'Corporate Executive',
    description: 'Sophisticated design for senior management positions',
    preview: '/api/placeholder/300/400',
    category: 'professional',
    atsScore: 92,
    popularity: 2,
    features: ['Executive Style', 'ATS Compliant', 'Leadership Focus']
  },
  {
    id: 'finance-professional',
    name: 'Finance Professional',
    description: 'Traditional format ideal for banking and finance roles',
    preview: '/api/placeholder/300/400',
    category: 'professional',
    atsScore: 94,
    popularity: 3,
    features: ['Conservative Design', 'ATS Friendly', 'Numbers Focus']
  },
  {
    id: 'consulting-expert',
    name: 'Consulting Expert',
    description: 'Strategic layout perfect for consulting positions',
    preview: '/api/placeholder/300/400',
    category: 'professional',
    atsScore: 93,
    popularity: 4,
    features: ['Strategic Layout', 'Problem-Solving Focus', 'ATS Optimized']
  },
  {
    id: 'sales-leader',
    name: 'Sales Leader',
    description: 'Results-driven template for sales professionals',
    preview: '/api/placeholder/300/400',
    category: 'professional',
    atsScore: 91,
    popularity: 5,
    features: ['Results Focused', 'Achievement Highlight', 'ATS Compliant']
  },
  // Technical Templates
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    description: 'Tech-focused template for developers and engineers',
    preview: '/api/placeholder/300/400',
    category: 'technical',
    atsScore: 96,
    popularity: 6,
    features: ['Tech Stack Highlight', 'Project Showcase', 'ATS Optimized']
  },
  {
    id: 'data-scientist',
    name: 'Data Scientist',
    description: 'Analytics-focused design for data professionals',
    preview: '/api/placeholder/300/400',
    category: 'technical',
    atsScore: 94,
    popularity: 7,
    features: ['Skills Matrix', 'Project Portfolio', 'ATS Friendly']
  },
  {
    id: 'devops-engineer',
    name: 'DevOps Engineer',
    description: 'Infrastructure-focused template for DevOps roles',
    preview: '/api/placeholder/300/400',
    category: 'technical',
    atsScore: 93,
    popularity: 8,
    features: ['Tech Tools Focus', 'Automation Highlight', 'ATS Compliant']
  },
  {
    id: 'product-manager',
    name: 'Product Manager',
    description: 'Product-focused template for PM roles',
    preview: '/api/placeholder/300/400',
    category: 'technical',
    atsScore: 92,
    popularity: 9,
    features: ['Product Focus', 'Metrics Driven', 'ATS Optimized']
  },
  {
    id: 'cybersecurity-specialist',
    name: 'Cybersecurity Specialist',
    description: 'Security-focused template for cybersecurity professionals',
    preview: '/api/placeholder/300/400',
    category: 'technical',
    atsScore: 94,
    popularity: 10,
    features: ['Security Focus', 'Certifications Highlight', 'ATS Friendly']
  },
  // Creative Templates
  {
    id: 'creative-designer',
    name: 'Creative Designer',
    description: 'Visually striking template for design professionals',
    preview: '/api/placeholder/300/400',
    category: 'creative',
    atsScore: 85,
    popularity: 11,
    isPremium: true,
    features: ['Visual Appeal', 'Portfolio Integration', 'Creative Layout']
  },
  {
    id: 'marketing-specialist',
    name: 'Marketing Specialist',
    description: 'Brand-focused template for marketing professionals',
    preview: '/api/placeholder/300/400',
    category: 'creative',
    atsScore: 88,
    popularity: 12,
    features: ['Brand Focus', 'Campaign Highlight', 'ATS Compatible']
  },
  {
    id: 'content-creator',
    name: 'Content Creator',
    description: 'Story-driven template for content professionals',
    preview: '/api/placeholder/300/400',
    category: 'creative',
    atsScore: 86,
    popularity: 13,
    features: ['Content Focus', 'Social Media Integration', 'Creative Flair']
  },
  {
    id: 'ux-designer',
    name: 'UX Designer',
    description: 'User-centered template for UX/UI designers',
    preview: '/api/placeholder/300/400',
    category: 'creative',
    atsScore: 87,
    popularity: 14,
    isPremium: true,
    features: ['User-Centered', 'Design Process', 'Portfolio Ready']
  },
  // Minimal Templates
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Simple, elegant design that focuses on content',
    preview: '/api/placeholder/300/400',
    category: 'minimal',
    atsScore: 97,
    popularity: 15,
    features: ['Ultra Clean', 'Content Focus', 'Maximum ATS Score']
  },
  {
    id: 'scandinavian-minimal',
    name: 'Scandinavian Minimal',
    description: 'Nordic-inspired clean design',
    preview: '/api/placeholder/300/400',
    category: 'minimal',
    atsScore: 96,
    popularity: 16,
    features: ['Nordic Style', 'White Space', 'ATS Perfect']
  },
  {
    id: 'simple-elegance',
    name: 'Simple Elegance',
    description: 'Refined simplicity for any industry',
    preview: '/api/placeholder/300/400',
    category: 'minimal',
    atsScore: 95,
    popularity: 17,
    features: ['Timeless Design', 'Universal Appeal', 'ATS Optimized']
  },
  // Executive Templates
  {
    id: 'c-suite-executive',
    name: 'C-Suite Executive',
    description: 'Premium template for C-level executives',
    preview: '/api/placeholder/300/400',
    category: 'executive',
    atsScore: 90,
    popularity: 18,
    isPremium: true,
    features: ['Executive Presence', 'Leadership Focus', 'Premium Design']
  },
  {
    id: 'board-member',
    name: 'Board Member',
    description: 'Distinguished template for board positions',
    preview: '/api/placeholder/300/400',
    category: 'executive',
    atsScore: 89,
    popularity: 19,
    isPremium: true,
    features: ['Distinguished Look', 'Governance Focus', 'Premium Quality']
  },
  {
    id: 'senior-director',
    name: 'Senior Director',
    description: 'Authoritative template for senior leadership',
    preview: '/api/placeholder/300/400',
    category: 'executive',
    atsScore: 91,
    popularity: 20,
    features: ['Authority Design', 'Strategic Focus', 'ATS Compliant']
  }
];

// Template Preview Component
const TemplatePreview: React.FC<{ templateId: string; className?: string }> = ({ templateId, className = "" }) => {
  const sampleData = {
    personalInfo: {
      fullName: 'John Smith',
      email: 'john.smith@email.com',
      phone: '+1 (555) 123-4567',
      location: 'New York, NY',
      linkedIn: 'linkedin.com/in/johnsmith',
      website: 'johnsmith.dev',
      summary: 'Experienced professional with 5+ years in technology and business development.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Corp',
        position: 'Senior Developer',
        location: 'New York, NY',
        startDate: '2022-01',
        endDate: '',
        current: true,
        description: '• Led development of key features\n• Improved system performance by 40%'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Technology',
        degree: 'Bachelor of Science',
        field: 'Computer Science',
        startDate: '2016-09',
        endDate: '2020-05',
        gpa: '3.8'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2023-06',
        expiryDate: '2026-06'
      }
    ]
  };

  // Render different template previews based on templateId
  const renderTemplatePreview = () => {
    switch (templateId) {
      case 'modern-professional':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="border-b-2 border-slate-700 pb-3 mb-3">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-medium mb-1">Senior Software Engineer</div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1">
                  <Mail className="w-2 h-2 text-slate-500" />
                  <span className="truncate">{sampleData.personalInfo.email}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="w-2 h-2 text-slate-500" />
                  <span>{sampleData.personalInfo.phone}</span>
                </div>
              </div>
            </div>
            <div className="mb-3">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-200 pb-1">Professional Summary</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="mb-3">
              <h2 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider border-b border-slate-200 pb-1">Professional Experience</h2>
              <div className="space-y-2">
                {sampleData.experience.slice(0, 1).map(exp => (
                  <div key={exp.id} className="border-l-2 border-slate-300 pl-2">
                    <h3 className="font-semibold text-slate-900 text-xs">{exp.position}</h3>
                    <div className="text-xs text-slate-700 font-medium mb-1">{exp.company} | {exp.location}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      
      case 'corporate-executive':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Playfair Display, serif' }}>
            <div className="text-center mb-4 border-b-2 border-slate-800 pb-3">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-medium uppercase tracking-widest">SENIOR EXECUTIVE</div>
              <div className="text-xs text-slate-500 mt-1">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Executive Summary</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Leadership</h2>
                <div className="text-xs text-slate-700">Senior Developer</div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Expertise</h2>
                <div className="text-xs text-slate-700">
                  {sampleData.skills.slice(0, 3).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'finance-professional':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Georgia, serif' }}>
            <div className="bg-slate-800 text-white p-3 -m-4 mb-4 rounded-t text-center">
              <h1 className="text-lg font-bold">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-200 font-medium">FINANCE PROFESSIONAL</div>
            </div>
            <div className="mt-2">
              <div className="grid grid-cols-2 gap-2 text-xs mb-3 text-slate-600">
                <div>📧 {sampleData.personalInfo.email}</div>
                <div>📱 {sampleData.personalInfo.phone}</div>
              </div>
              <h2 className="text-sm font-bold text-slate-800 mb-1 border-b border-slate-300 pb-1">Professional Experience</h2>
              <div className="text-xs text-slate-700 mb-3">
                <strong>Senior Developer</strong> - Tech Corp
              </div>
              <h2 className="text-sm font-bold text-slate-800 mb-1 border-b border-slate-300 pb-1">Key Competencies</h2>
              <div className="text-xs text-slate-700">
                {sampleData.skills.slice(0, 4).join(' • ')}
              </div>
            </div>
          </div>
        );

      case 'software-engineer':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <div className="mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-semibold tracking-wide">SOFTWARE ENGINEER</div>
              <div className="text-xs text-slate-500 mt-1 font-mono">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Technical Stack</h2>
              <div className="text-xs text-slate-700 font-mono">
                {sampleData.skills.slice(0, 4).join(' | ')}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Experience</h2>
              <div className="text-xs text-slate-700 font-mono">
                <strong>Senior Developer</strong> - Tech Corp
              </div>
            </div>
          </div>
        );

      case 'creative-designer':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-medium">CREATIVE DESIGNER</div>
            </div>
            <div className="mb-4 border-l-4 border-slate-300 pl-3">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider">Portfolio Overview</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Skills</h2>
                <div className="text-xs text-slate-700">
                  {sampleData.skills.slice(0, 3).join(' • ')}
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Style</h2>
                <div className="text-xs text-slate-700">Modern & Creative</div>
              </div>
            </div>
          </div>
        );

      case 'minimal-clean':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-500 font-light">{sampleData.personalInfo.email}</div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider border-b-2 border-slate-200 pb-1">Experience</h2>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Senior Developer</strong> at Tech Corp
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider border-b-2 border-slate-200 pb-1">Skills</h2>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {sampleData.skills.slice(0, 3).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'c-suite-executive':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Crimson Text, serif' }}>
            <div className="text-center mb-4 border-b-2 border-slate-800 pb-3">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-light uppercase tracking-widest">CHIEF EXECUTIVE OFFICER</div>
              <div className="text-xs text-slate-500 mt-1">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4 border-l-4 border-slate-400 pl-3">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider">Executive Profile</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Leadership</h2>
                <div className="text-xs text-slate-700">Strategic Vision</div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Expertise</h2>
                <div className="text-xs text-slate-700">
                  {sampleData.skills.slice(0, 2).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'data-scientist':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Roboto, sans-serif' }}>
            <div className="mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-semibold tracking-wide">DATA SCIENTIST</div>
              <div className="text-xs text-slate-500 mt-1">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Analytics Stack</h2>
              <div className="text-xs text-slate-700">
                {sampleData.skills.slice(0, 4).join(' | ')}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Experience</h2>
              <div className="text-xs text-slate-700">
                <strong>Senior Developer</strong> - Tech Corp
              </div>
            </div>
          </div>
        );

      case 'marketing-specialist':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Montserrat, sans-serif' }}>
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-medium">MARKETING SPECIALIST</div>
            </div>
            <div className="mb-4 border-l-4 border-slate-300 pl-3">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider">Brand Strategy</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Campaigns</h2>
                <div className="text-xs text-slate-700">Digital & Social</div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Tools</h2>
                <div className="text-xs text-slate-700">
                  {sampleData.skills.slice(0, 2).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'ux-designer':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-semibold tracking-wide">UX/UI DESIGNER</div>
              <div className="text-xs text-slate-500 mt-1">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Design Tools</h2>
              <div className="text-xs text-slate-700">
                {sampleData.skills.slice(0, 4).join(' • ')}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Process</h2>
              <div className="text-xs text-slate-700">
                <strong>User-Centered Design</strong> - Research to Prototype
              </div>
            </div>
          </div>
        );

      case 'scandinavian-minimal':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-500 font-light">{sampleData.personalInfo.email}</div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider border-b-2 border-slate-200 pb-1">Experience</h2>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Senior Developer</strong> at Tech Corp
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider border-b-2 border-slate-200 pb-1">Skills</h2>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {sampleData.skills.slice(0, 3).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'consulting-expert':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="flex justify-between items-start mb-4 border-b-2 border-slate-700 pb-3">
              <div>
                <h1 className="text-lg font-bold text-slate-900">{sampleData.personalInfo.fullName}</h1>
                <div className="text-xs text-slate-600 font-semibold">STRATEGIC CONSULTANT</div>
              </div>
              <div className="text-right text-xs text-slate-600">
                <div>{sampleData.personalInfo.phone}</div>
                <div>{sampleData.personalInfo.email}</div>
              </div>
            </div>
            <div className="mb-4 bg-slate-50 p-2 rounded">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider">Strategic Overview</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <h3 className="font-bold text-slate-800">Expertise</h3>
                <div className="text-slate-700">Technology</div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Location</h3>
                <div className="text-slate-700">New York</div>
              </div>
              <div>
                <h3 className="font-bold text-slate-800">Experience</h3>
                <div className="text-slate-700">5+ Years</div>
              </div>
            </div>
          </div>
        );

      case 'sales-leader':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="text-center mb-4 border-b-2 border-slate-700 pb-3">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs bg-slate-100 rounded px-2 py-1 inline-block text-slate-700 font-medium">SALES LEADER</div>
            </div>
            <div className="mb-4 bg-slate-50 p-2 rounded">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider">Results Overview</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Achievements</h2>
                <div className="text-xs text-slate-700">Revenue Growth</div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Skills</h2>
                <div className="text-xs text-slate-700">
                  {sampleData.skills.slice(0, 2).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'devops-engineer':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'JetBrains Mono, monospace' }}>
            <div className="mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-semibold tracking-wide">DEVOPS ENGINEER</div>
              <div className="text-xs text-slate-500 mt-1 font-mono">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Infrastructure</h2>
              <div className="text-xs text-slate-700 font-mono">
                {sampleData.skills.slice(0, 4).join(' | ')}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Experience</h2>
              <div className="text-xs text-slate-700 font-mono">
                <strong>Senior Developer</strong> - Tech Corp
              </div>
            </div>
          </div>
        );

      case 'product-manager':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-semibold tracking-wide">PRODUCT MANAGER</div>
              <div className="text-xs text-slate-500 mt-1">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Product Focus</h2>
              <div className="text-xs text-slate-700">
                {sampleData.skills.slice(0, 4).join(' • ')}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Experience</h2>
              <div className="text-xs text-slate-700">
                <strong>Senior Developer</strong> - Tech Corp
              </div>
            </div>
          </div>
        );

      case 'cybersecurity-specialist':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Roboto, sans-serif' }}>
            <div className="mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-semibold tracking-wide">CYBERSECURITY SPECIALIST</div>
              <div className="text-xs text-slate-500 mt-1">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Security Focus</h2>
              <div className="text-xs text-slate-700">
                {sampleData.skills.slice(0, 4).join(' | ')}
              </div>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Experience</h2>
              <div className="text-xs text-slate-700">
                <strong>Senior Developer</strong> - Tech Corp
              </div>
            </div>
          </div>
        );

      case 'content-creator':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Poppins, sans-serif' }}>
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-medium">CONTENT CREATOR</div>
            </div>
            <div className="mb-4 border-l-4 border-slate-300 pl-3">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider">Content Focus</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Platforms</h2>
                <div className="text-xs text-slate-700">Social Media</div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Skills</h2>
                <div className="text-xs text-slate-700">
                  {sampleData.skills.slice(0, 2).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'simple-elegance':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Georgia, serif' }}>
            <div className="text-center mb-4">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-500 font-light">{sampleData.personalInfo.email}</div>
            </div>
            <div className="space-y-4">
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider border-b border-slate-300 pb-1">Experience</h2>
                <div className="text-xs text-slate-700 leading-relaxed">
                  <strong>Senior Developer</strong> at Tech Corp
                </div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2 uppercase tracking-wider border-b border-slate-300 pb-1">Skills</h2>
                <div className="text-xs text-slate-700 leading-relaxed">
                  {sampleData.skills.slice(0, 3).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'board-member':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Crimson Text, serif' }}>
            <div className="text-center mb-4 border-b-2 border-slate-800 pb-3">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-light uppercase tracking-widest">BOARD MEMBER</div>
              <div className="text-xs text-slate-500 mt-1">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4 border-l-4 border-slate-400 pl-3">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider">Governance Profile</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Leadership</h2>
                <div className="text-xs text-slate-700">Strategic Oversight</div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Expertise</h2>
                <div className="text-xs text-slate-700">
                  {sampleData.skills.slice(0, 2).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      case 'senior-director':
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="text-center mb-4 border-b-2 border-slate-700 pb-3">
              <h1 className="text-lg font-bold text-slate-900 mb-1 tracking-wide">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600 font-medium uppercase tracking-widest">SENIOR DIRECTOR</div>
              <div className="text-xs text-slate-500 mt-1">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-4 border-l-4 border-slate-400 pl-3">
              <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider">Strategic Leadership</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Authority</h2>
                <div className="text-xs text-slate-700">Strategic Focus</div>
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-800 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Expertise</h2>
                <div className="text-xs text-slate-700">
                  {sampleData.skills.slice(0, 2).join(' • ')}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className={`bg-white p-4 shadow-sm rounded border ${className}`} style={{ fontFamily: 'Inter, sans-serif' }}>
            <div className="mb-3">
              <h1 className="text-lg font-bold text-slate-900 mb-1">{sampleData.personalInfo.fullName}</h1>
              <div className="text-xs text-slate-600">{sampleData.personalInfo.email}</div>
            </div>
            <div className="mb-3">
              <h2 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Summary</h2>
              <p className="text-xs text-slate-700 leading-tight">{sampleData.personalInfo.summary}</p>
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 mb-1 uppercase tracking-wider border-b border-slate-300 pb-1">Experience</h2>
              <div className="text-xs text-slate-700">
                <strong>Senior Developer</strong> - Tech Corp
              </div>
            </div>
          </div>
        );
    }
  };

  return renderTemplatePreview();
};

const CVForm = ({ cvData, onDataChange }: { cvData: CVData; onDataChange: (data: CVData) => void }) => {
  const updatePersonalInfo = (personalInfo: CVData['personalInfo']) => {
    onDataChange({ ...cvData, personalInfo });
  };

  const updateExperience = (experience: CVData['experience']) => {
    onDataChange({ ...cvData, experience });
  };

  const updateEducation = (education: CVData['education']) => {
    onDataChange({ ...cvData, education });
  };

  const updateSkills = (skills: CVData['skills']) => {
    onDataChange({ ...cvData, skills });
  };

  const updateCertifications = (certifications: CVData['certifications']) => {
    onDataChange({ ...cvData, certifications });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <span>Personal Information</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={cvData.personalInfo.fullName}
                  onChange={(e) => updatePersonalInfo({ ...cvData.personalInfo, fullName: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email</label>
                <input
                  type="email"
                  value={cvData.personalInfo.email}
                  onChange={(e) => updatePersonalInfo({ ...cvData.personalInfo, email: e.target.value })}
                  className="w-full p-2 border rounded-md"
                  placeholder="john@example.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Professional Summary</label>
              <textarea
                value={cvData.personalInfo.summary}
                onChange={(e) => updatePersonalInfo({ ...cvData.personalInfo, summary: e.target.value })}
                className="w-full p-2 border rounded-md h-24"
                placeholder="Brief professional summary..."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</span>
            <span>Work Experience</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cvData.experience.map((exp, index) => (
              <div key={exp.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={exp.company}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index] = { ...exp, company: e.target.value };
                      updateExperience(newExp);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Company Name"
                  />
                  <input
                    type="text"
                    value={exp.position}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index] = { ...exp, position: e.target.value };
                      updateExperience(newExp);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Job Title"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <input
                    type="date"
                    value={exp.startDate}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index] = { ...exp, startDate: e.target.value };
                      updateExperience(newExp);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={exp.endDate}
                    onChange={(e) => {
                      const newExp = [...cvData.experience];
                      newExp[index] = { ...exp, endDate: e.target.value };
                      updateExperience(newExp);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="End Date"
                    disabled={exp.current}
                  />
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => {
                        const newExp = [...cvData.experience];
                        newExp[index] = { ...exp, current: e.target.checked };
                        updateExperience(newExp);
                      }}
                      className="mr-2"
                    />
                    <label className="text-sm">Current Position</label>
                  </div>
                </div>
                <textarea
                  value={exp.description}
                  onChange={(e) => {
                    const newExp = [...cvData.experience];
                    newExp[index] = { ...exp, description: e.target.value };
                    updateExperience(newExp);
                  }}
                  className="w-full p-2 border rounded-md mt-4 h-20"
                  placeholder="Job description and achievements..."
                />
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                const newExp = [...cvData.experience, {
                  id: Date.now().toString(),
                  company: '',
                  position: '',
                  location: '',
                  startDate: new Date().toISOString().split('T')[0], // Today's date as default
                  endDate: '',
                  current: true,
                  description: ''
                }];
                updateExperience(newExp);
              }}
              className="w-full"
            >
              + Add Experience
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</span>
            <span>Education</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cvData.education.map((edu, index) => (
              <div key={edu.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={edu.institution}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, institution: e.target.value };
                      updateEducation(newEdu);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="University Name"
                  />
                  <input
                    type="text"
                    value={edu.degree}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, degree: e.target.value };
                      updateEducation(newEdu);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Degree"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                  <input
                    type="text"
                    value={edu.field}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, field: e.target.value };
                      updateEducation(newEdu);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Field of Study"
                  />
                  <input
                    type="date"
                    value={edu.startDate}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, startDate: e.target.value };
                      updateEducation(newEdu);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    value={edu.endDate}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, endDate: e.target.value };
                      updateEducation(newEdu);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="End Date"
                  />
                </div>
                <div className="mt-4">
                  <input
                    type="text"
                    value={edu.gpa || ''}
                    onChange={(e) => {
                      const newEdu = [...cvData.education];
                      newEdu[index] = { ...edu, gpa: e.target.value };
                      updateEducation(newEdu);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="GPA (optional)"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                const newEdu = [...cvData.education, {
                  id: Date.now().toString(),
                  institution: '',
                  degree: '',
                  field: '',
                  startDate: new Date().toISOString().split('T')[0], // Today's date as default
                  endDate: new Date().toISOString().split('T')[0] // Today's date as default
                }];
                updateEducation(newEdu);
              }}
              className="w-full"
            >
              + Add Education
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</span>
            <span>Skills</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {cvData.skills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => {
                  const newSkills = cvData.skills.filter((_, i) => i !== index);
                  updateSkills(newSkills);
                }}>
                  {skill} ×
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add a skill"
                className="flex-1 p-2 border rounded-md"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                    updateSkills([...cvData.skills, e.currentTarget.value.trim()]);
                    e.currentTarget.value = '';
                  }
                }}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <span className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">5</span>
            <span>Certifications</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cvData.certifications.map((cert, index) => (
              <div key={cert.id} className="border rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    value={cert.name}
                    onChange={(e) => {
                      const newCert = [...cvData.certifications];
                      newCert[index] = { ...cert, name: e.target.value };
                      updateCertifications(newCert);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Certification Name"
                  />
                  <input
                    type="text"
                    value={cert.issuer}
                    onChange={(e) => {
                      const newCert = [...cvData.certifications];
                      newCert[index] = { ...cert, issuer: e.target.value };
                      updateCertifications(newCert);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Issuing Organization"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <input
                    type="date"
                    value={cert.date}
                    onChange={(e) => {
                      const newCert = [...cvData.certifications];
                      newCert[index] = { ...cert, date: e.target.value };
                      updateCertifications(newCert);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Date Obtained"
                  />
                  <input
                    type="date"
                    value={cert.expiryDate || ''}
                    onChange={(e) => {
                      const newCert = [...cvData.certifications];
                      newCert[index] = { ...cert, expiryDate: e.target.value };
                      updateCertifications(newCert);
                    }}
                    className="w-full p-2 border rounded-md"
                    placeholder="Expiry Date (optional)"
                  />
                </div>
              </div>
            ))}
            <Button
              variant="outline"
              onClick={() => {
                const newCert = [...cvData.certifications, {
                  id: Date.now().toString(),
                  name: '',
                  issuer: '',
                  date: new Date().toISOString().split('T')[0], // Today's date as default
                  expiryDate: ''
                }];
                updateCertifications(newCert);
              }}
              className="w-full"
            >
              + Add Certification
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// --- Mapping functions for CVData <-> backend content object ---
function mapCVDataToBackendContent(cvData: CVData) {
  return {
    full_name: cvData.personalInfo.fullName,
    email: cvData.personalInfo.email,
    phone: cvData.personalInfo.phone,
    location: cvData.personalInfo.location,
    linkedin_url: cvData.personalInfo.linkedIn,
    portfolio_url: cvData.personalInfo.website,
    summary: cvData.personalInfo.summary,
    experience: cvData.experience,
    education: cvData.education,
    skills: cvData.skills,
    certifications: cvData.certifications,
    projects: cvData.projects || [],
    languages: cvData.languages || [],
    references: cvData.references || [],
    isSampleDatabase: cvData.isSampleDatabase || false
  };
}

function mapBackendContentToCVData(content: any): CVData {
  return {
    personalInfo: {
      fullName: content.full_name || '',
      email: content.email || '',
      phone: content.phone || '',
      location: content.location || '',
      linkedIn: content.linkedin_url || '',
      website: content.portfolio_url || '',
      summary: content.summary || ''
    },
    experience: content.experience || [],
    education: content.education || [],
    skills: content.skills || [],
    certifications: content.certifications || [],
    projects: content.projects || [],
    languages: content.languages || [],
    references: content.references || [],
    isSampleDatabase: content.isSampleDatabase || false
  };
}

const CVBuilderPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cvId } = useParams<{ cvId?: string }>();
  const [currentStep, setCurrentStep] = useState<'template' | 'form' | 'preview'>('template');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [atsScore, setAtsScore] = useState<number>(0);
  const [humanizedScore, setHumanizedScore] = useState<number>(0);
  const [showPreview, setShowPreview] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [useSampleData, setUseSampleData] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [cvData, setCvData] = useState<CVData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedIn: '',
      website: '',
      summary: ''
    },
    experience: [],
    education: [],
    skills: [],
    certifications: []
  });
  const [showPrintModal, setShowPrintModal] = useState(false);

  // Load existing CV if editing
  React.useEffect(() => {
    if (cvId) {
      loadExistingCV(cvId);
    }
  }, [cvId]);

  const loadExistingCV = async (id: string) => {
    try {
      setIsLoading(true);
      const dbCV = await cvOperations.getCV(id);
      if (dbCV && dbCV.content) {
        setCvData(mapBackendContentToCVData(dbCV.content));
        setSelectedTemplate(dbCV.template_id || 'modern-professional');
        setAtsScore(dbCV.ats_score || 0);
        setIsEditing(true);
        setCurrentStep('form');
      }
    } catch (error) {
      console.error('Error loading CV:', error);
      toast.error('Failed to load CV for editing');
    } finally {
      setIsLoading(false);
    }
  };

  // Toggle between sample and empty data
  const toggleSampleData = () => {
    setUseSampleData(!useSampleData);
    if (!useSampleData) {
      // Use sample data for the currently selected template
      const sampleData = getSampleDataForTemplate(selectedTemplate || 'basic-modern');
      setCvData(sampleData);
    } else {
      // Clear all fields
      setCvData({
        personalInfo: { fullName: '', email: '', phone: '', location: '', linkedIn: '', website: '', summary: '' },
        experience: [],
        education: [],
        skills: [],
        certifications: [],
        projects: [],
        languages: [],
        references: [],
      });
    }
  };

  // Data test function for development
  const handleDataTest = () => {
    const testCVData = {
      personalInfo: {
        fullName: 'TEST USER',
        email: 'test.user@test.com',
        phone: '+1 (555) 000-0000',
        location: 'Test City',
        linkedIn: 'https://linkedin.com/in/test-user',
        website: 'https://testuser.com',
        summary: 'THIS IS TEST DATA. If you see this, the Data Test button is working.'
      },
      experience: [
        {
          id: '1',
          company: 'Test Company',
          position: 'Test Engineer',
          location: 'Test City',
          startDate: '2020-01-01',
          endDate: '2022-01-01',
          current: false,
          description: 'TEST EXPERIENCE DATA.'
        }
      ],
      education: [
        {
          id: '1',
          institution: 'Test University',
          degree: 'BSc Test Science',
          field: 'Testing',
          startDate: '2016-09-01',
          endDate: '2020-05-15',
          gpa: '4.0'
        }
      ],
      skills: ['TESTING', 'DEBUGGING', 'QA'],
      certifications: [
        {
          id: '1',
          name: 'Certified Test Professional',
          issuer: 'Test Org',
          date: '2021-01-01',
          expiryDate: '2024-01-01'
        }
      ],
      projects: [
        { id: '1', name: 'Test Project', description: 'This is a test project.', technologies: 'TestTech', url: 'https://testproject.com' }
      ],
      languages: [
        { id: '1', language: 'English', proficiency: 'Native' }
      ],
      references: [
        { id: '1', name: 'Test Ref', title: 'Manager', company: 'Test Company', email: 'ref@test.com', phone: '+1 (555) 111-1111' }
      ],
      isSampleDatabase: false
    };
    setCvData(testCVData);
    console.log('=== DATA TEST (TEST DATA IN USE) ===');
    console.log('Current CV Data:', testCVData);
    alert('Test data loaded! If you see TEST USER and TEST EXPERIENCE, the Data Test button is working.');
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setCurrentStep('form'); // Immediately go to live preview (form) after selection
    if (useSampleData) {
      const sampleData = getSampleDataForTemplate(templateId);
      setCvData(sampleData);
    }
  };

  const handleBackToTemplates = () => {
    setCurrentStep('template');
  };

  const handleAnalyzeCV = async () => {
    setIsAnalyzing(true);
    // Simulate ATS and humanized analysis
    setTimeout(() => {
      const mockAtsScore = Math.floor(Math.random() * 20) + 80; // 80-100
      const mockHumanScore = Math.floor(Math.random() * 25) + 75; // 75-100
      setAtsScore(mockAtsScore);
      setHumanizedScore(mockHumanScore);
      setIsAnalyzing(false);
    }, 2000);
  };

  const handleGenerateWithAI = async () => {
    setIsGenerating(true);
    // Simulate AI generation
    setTimeout(() => {
      const aiGeneratedData: CVData = {
        personalInfo: {
          fullName: cvData.personalInfo.fullName || 'John Doe',
          email: cvData.personalInfo.email || 'john.doe@email.com',
          phone: cvData.personalInfo.phone || '+1 (555) 123-4567',
          location: cvData.personalInfo.location || 'New York, NY',
          linkedIn: cvData.personalInfo.linkedIn || 'linkedin.com/in/johndoe',
          website: cvData.personalInfo.website || 'johndoe.dev',
          summary: 'Experienced software engineer with 5+ years developing scalable web applications. Proficient in React, Node.js, and cloud technologies. Strong problem-solving skills with a passion for creating efficient, user-friendly solutions.'
        },
        experience: [
          {
            id: '1',
            company: 'Tech Solutions Inc.',
            position: 'Senior Software Engineer',
            location: 'New York, NY',
            startDate: '2022-03',
            endDate: '',
            current: true,
            description: '• Led development of microservices architecture serving 1M+ users\n• Improved application performance by 40% through code optimization\n• Mentored junior developers and conducted code reviews\n• Collaborated with product teams to deliver features on schedule'
          }
        ],
        education: [
          {
            id: '1',
            institution: 'University of Technology',
            degree: 'Bachelor of Science',
            field: 'Computer Science',
            startDate: '2016-09',
            endDate: '2020-05',
            gpa: '3.8'
          }
        ],
        skills: [
          'JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 
          'Docker', 'MongoDB', 'PostgreSQL', 'Git', 'Agile/Scrum', 'REST APIs'
        ],
        certifications: [
          {
            id: '1',
            name: 'AWS Certified Solutions Architect',
            issuer: 'Amazon Web Services',
            date: '2023-06',
            expiryDate: '2026-06'
          }
        ]
      };
      setCvData(aiGeneratedData);
      setIsGenerating(false);
    }, 3000);
  };

  const handleSaveCV = async () => {
    if (!user) {
      toast.error('Please log in to save your CV');
      return;
    }
    try {
      setIsLoading(true);
      // Backend payload, not a CVData object
      const dbCVData = {
        title: cvData.personalInfo.fullName || 'Untitled CV',
        content: mapCVDataToBackendContent(cvData),
        is_public: false,
        template_id: selectedTemplate,
        ats_score: atsScore,
        content_type: 'builder',
      };
      let savedCV;
      if (isEditing && cvId) {
        // Cast to any for backend compatibility
        savedCV = await cvOperations.updateCV(cvId, dbCVData as any);
        toast.success('CV updated successfully!');
      } else {
        // Cast to any for backend compatibility
        savedCV = await cvOperations.createCV(dbCVData as any);
        toast.success('CV created successfully!');
      }
      console.log('CV saved to database:', savedCV);
      navigate('/cvs');
    } catch (error: any) {
      console.error('Error saving CV:', error);
      toast.error(`Failed to save CV: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadCV = () => {
    // TODO: Implement PDF download
    console.log('Downloading CV:', cvData);
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'template':
        return (
          <CVTemplateSelector
            onSelectTemplate={handleTemplateSelect}
            userTier="elite"
            showAllTemplates={true}
          />
        );
      case 'form':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              {/* Test Controls - Will be removed after testing */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h3 className="text-sm font-semibold text-yellow-800 mb-2">🧪 TEST CONTROLS (Will be removed)</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDataTest}
                    className="bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200"
                  >
                    Data Test
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={toggleSampleData}
                    className={useSampleData ? "bg-green-100 text-green-800 border-green-300" : "bg-gray-100 text-gray-800 border-gray-300"}
                  >
                    {useSampleData ? '✓ Sample Data ON' : 'Sample Data OFF'}
                  </Button>
                </div>
              </div>
              
              <CVForm cvData={cvData} onDataChange={setCvData} />
            </div>
            <div className="hidden lg:block">
              <CVPreview cvData={cvData} templateId={selectedTemplate} />
            </div>
          </div>
        );
      case 'preview':
        return <CVPreview cvData={cvData} templateId={selectedTemplate} />;
      default:
        return null;
    }
  };

  // Helper to open print modal after state update
  const openPrintModalAfterState = () => setTimeout(() => setShowPrintModal(true), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header with Cleaner Button Design */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Side - Navigation and Title */}
            <div className="flex items-center space-x-6">
              <Button
                variant="ghost"
                onClick={() => navigate('/dashboard')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-all duration-200 font-medium"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
              
              <div className="h-6 w-px bg-gray-200"></div>
              
              <h1 className="text-xl font-semibold text-gray-900">
                {isEditing ? 'Edit CV' : 'CV Builder'}
              </h1>
            </div>
            
            {/* Right Side - Action Buttons */}
            {currentStep !== 'template' && (
              <div className="flex items-center space-x-4">
                {/* Mobile Preview Button */}
                <Button
                  variant="outline"
                  onClick={() => setShowPreview(!showPreview)}
                  className="lg:hidden border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200 font-medium"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
                
                {/* Primary Action Buttons */}
                <div className="flex items-center space-x-3">
                  {/* AI Generate Button */}
                  <Button
                    onClick={handleGenerateWithAI}
                    disabled={isGenerating}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-0 hover:from-blue-700 hover:to-indigo-700 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        AI Generate
                      </>
                    )}
                  </Button>
                  
                  {/* ATS Check Button */}
                  <Button
                    onClick={handleAnalyzeCV}
                    disabled={isAnalyzing}
                    className="bg-emerald-600 text-white border-0 hover:bg-emerald-700 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                  >
                    {isAnalyzing ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4 mr-2" />
                        ATS Check
                      </>
                    )}
                  </Button>
                </div>
                
                {/* Secondary Action Buttons */}
                <div className="flex items-center space-x-3">
                  <div className="h-6 w-px bg-gray-200"></div>
                  
                  {/* Save Button */}
                  <Button 
                    variant="outline"
                    onClick={handleSaveCV}
                    disabled={isLoading}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200 font-medium"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin w-4 h-4 mr-2 border-2 border-gray-500 border-t-transparent rounded-full" />
                        {isEditing ? 'Updating...' : 'Saving...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        {isEditing ? 'Update CV' : 'Save CV'}
                      </>
                    )}
                  </Button>
                  
                  {/* Print Button */}
                  <Button 
                    variant="outline"
                    onClick={openPrintModalAfterState}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:border-gray-300 transition-all duration-200 font-medium"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Print
                  </Button>
                  
                  {/* Download Button */}
                  <Button 
                    onClick={handleDownloadCV}
                    className="bg-slate-700 text-white border-0 hover:bg-slate-800 shadow-sm hover:shadow-md transition-all duration-200 font-medium"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download PDF
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Enhanced ATS and Humanized Scores Display */}
      {(atsScore > 0 || humanizedScore > 0) && currentStep !== 'template' && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-center space-x-12">
              {atsScore > 0 && (
                <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-blue-100">
                  <div className="text-sm font-medium text-gray-700">ATS Score:</div>
                  <div className={`text-lg font-bold ${
                    atsScore >= 90 ? 'text-emerald-600' : 
                    atsScore >= 80 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {atsScore}%
                  </div>
                  <Badge className={
                    atsScore >= 90 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                    atsScore >= 80 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-red-100 text-red-800 border-red-200'
                  }>
                    {atsScore >= 90 ? 'Excellent' : atsScore >= 80 ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>
              )}
              
              {humanizedScore > 0 && (
                <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 shadow-sm border border-blue-100">
                  <div className="text-sm font-medium text-gray-700">Human Appeal:</div>
                  <div className={`text-lg font-bold ${
                    humanizedScore >= 90 ? 'text-emerald-600' : 
                    humanizedScore >= 80 ? 'text-amber-600' : 'text-red-600'
                  }`}>
                    {humanizedScore}%
                  </div>
                  <Badge className={
                    humanizedScore >= 90 ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 
                    humanizedScore >= 80 ? 'bg-amber-100 text-amber-800 border-amber-200' : 'bg-red-100 text-red-800 border-red-200'
                  }>
                    {humanizedScore >= 90 ? 'Excellent' : humanizedScore >= 80 ? 'Good' : 'Needs Work'}
                  </Badge>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 font-medium">
                {isEditing ? 'Loading CV for editing...' : 'Loading...'}
              </p>
            </div>
          </div>
        ) : (
          renderCurrentStep()
        )}
      </div>

      {/* Mobile Preview Modal */}
      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="absolute inset-4 bg-white rounded-lg overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b">
              <h3 className="text-lg font-semibold">CV Preview</h3>
              <Button variant="ghost" onClick={() => setShowPreview(false)}>
                ×
              </Button>
            </div>
            <div className="p-4 overflow-auto h-full">
              <CVPreview cvData={cvData} templateId={selectedTemplate} />
            </div>
          </div>
        </div>
      )}

      {showPrintModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center print:bg-transparent print:static print:block">
          {/* For print, render ONLY the .cv-preview, no modal/flex/form/controls */}
          <CVPreview cvData={cvData} templateId={selectedTemplate} minimal={true} showWatermark={true} />
        </div>
      )}
    </div>
  );
};

export default CVBuilderPage; 