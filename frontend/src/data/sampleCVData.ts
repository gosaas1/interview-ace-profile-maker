import { CVData } from '@/lib/cv/types';
import { cvTemplates } from './cvTemplates';

export interface SampleCVData {
  [templateId: string]: CVData;
}

export const sampleCVData: SampleCVData = {
  'basic-modern': {
    personalInfo: {
      fullName: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedIn: 'https://linkedin.com/in/sarah-johnson-dev',
      website: 'https://sarah-johnson.dev',
      summary: 'Experienced software engineer with 6+ years developing scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Led multiple cross-functional teams to deliver high-impact products serving millions of users.'
    },
    experience: [
      {
        id: '1',
        company: 'TechCorp Inc.',
        position: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-01-15',
        endDate: '',
        current: true,
        description: 'Lead development of customer-facing web applications using React, Node.js, and AWS. Mentored 3 junior developers and improved team productivity by 40% through code reviews and best practices implementation. Architected microservices handling 10M+ daily requests.'
      },
      {
        id: '2',
        company: 'StartupXYZ',
        position: 'Full Stack Developer',
        location: 'San Francisco, CA',
        startDate: '2020-03-01',
        endDate: '2021-12-31',
        current: false,
        description: 'Built and maintained e-commerce platform from scratch using MERN stack. Implemented payment processing, inventory management, and analytics dashboard. Reduced page load times by 60% through performance optimization.'
      },
      {
        id: '3',
        company: 'Digital Solutions Ltd.',
        position: 'Frontend Developer',
        location: 'San Francisco, CA',
        startDate: '2018-06-01',
        endDate: '2020-02-28',
        current: false,
        description: 'Developed responsive web applications using React, TypeScript, and Redux. Collaborated with UX designers to create intuitive user interfaces. Implemented automated testing reducing bugs by 35%.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        field: 'Computer Science',
        startDate: '2014-09-01',
        endDate: '2018-05-15',
        gpa: '3.8'
      }
    ],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Python', 'AWS', 'Docker', 'PostgreSQL', 'MongoDB', 'Git', 'Agile', 'Scrum', 'Team Leadership', 'Code Review', 'System Design'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Solutions Architect',
        issuer: 'Amazon Web Services',
        date: '2021-06-15',
        expiryDate: '2024-06-15'
      },
      {
        id: '2',
        name: 'Google Cloud Professional Developer',
        issuer: 'Google Cloud',
        date: '2020-09-20',
        expiryDate: '2023-09-20'
      },
      {
        id: '3',
        name: 'Certified Scrum Master (CSM)',
        issuer: 'Scrum Alliance',
        date: '2019-03-10',
        expiryDate: '2022-03-10'
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'professional-clean': {
    personalInfo: {
      fullName: 'David Martinez',
      email: 'david.martinez@email.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      linkedIn: 'https://linkedin.com/in/david-martinez-marketing',
      website: 'https://davidmartinez.marketing',
      summary: 'Strategic marketing leader with 8+ years driving brand growth and customer acquisition. Proven track record of increasing revenue by 150% through data-driven campaigns and innovative digital strategies. Expert in building high-performing teams and cross-functional partnerships.'
    },
    experience: [
      {
        id: '1',
        company: 'Global Brands Inc.',
        position: 'Marketing Director',
        location: 'New York, NY',
        startDate: '2021-03-01',
        endDate: '',
        current: true,
        description: 'Lead marketing strategy for $50M+ revenue division. Launched 15+ successful campaigns resulting in 200% increase in qualified leads. Manage team of 8 marketing professionals and $2M annual budget. Implemented marketing automation reducing cost per acquisition by 45%.'
      },
      {
        id: '2',
        company: 'Innovation Media',
        position: 'Senior Marketing Manager',
        location: 'New York, NY',
        startDate: '2019-01-15',
        endDate: '2021-02-28',
        current: false,
        description: 'Developed and executed integrated marketing campaigns across digital and traditional channels. Increased brand awareness by 80% and customer retention by 35%. Led rebranding initiative that improved brand perception scores by 60%.'
      },
      {
        id: '3',
        company: 'Creative Agency Pro',
        position: 'Digital Marketing Specialist',
        location: 'New York, NY',
        startDate: '2016-08-01',
        endDate: '2018-12-31',
        current: false,
        description: 'Managed social media strategy and content marketing for 20+ clients. Increased average engagement rates by 120% and generated $1M+ in attributed revenue. Specialized in B2B lead generation and conversion optimization.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Northwestern University',
        degree: 'MBA in Marketing',
        field: 'Marketing',
        startDate: '2014-09-01',
        endDate: '2016-05-15',
        gpa: '3.9'
      },
      {
        id: '2',
        institution: 'University of Texas at Austin',
        degree: 'Bachelor of Business Administration',
        field: 'Business Administration',
        startDate: '2010-09-01',
        endDate: '2014-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['Digital Marketing', 'Brand Strategy', 'Content Marketing', 'Social Media Marketing', 'Marketing Automation', 'Google Analytics', 'HubSpot', 'Salesforce', 'A/B Testing', 'SEO/SEM', 'Team Leadership', 'Budget Management', 'Data Analysis'],
    certifications: [
      {
        id: '1',
        name: 'Google Analytics Certified',
        issuer: 'Google',
        date: '2020-05-10',
        expiryDate: '2023-05-10'
      },
      {
        id: '2',
        name: 'HubSpot Content Marketing Certification',
        issuer: 'HubSpot',
        date: '2019-11-20',
        expiryDate: '2022-11-20'
      },
      {
        id: '3',
        name: 'Facebook Blueprint Certified',
        issuer: 'Facebook',
        date: '2018-07-15',
        expiryDate: '2021-07-15'
      },
      {
        id: '4',
        name: 'Salesforce Marketing Cloud Specialist',
        issuer: 'Salesforce',
        date: '2017-09-05',
        expiryDate: '2020-09-05'
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'creative-modern': {
    personalInfo: {
      fullName: 'Alex Rivera',
      email: 'alex.rivera@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Los Angeles, CA',
      linkedIn: 'https://linkedin.com/in/alex-rivera-design',
      website: 'https://alexrivera.design',
      summary: 'Award-winning creative director with 7+ years crafting compelling brand experiences and user-centered designs. Led creative teams for Fortune 500 companies, increasing user engagement by 180% through innovative design solutions. Passionate about bridging the gap between creativity and technology.'
    },
    experience: [
      {
        id: '1',
        company: 'Design Studio Pro',
        position: 'Creative Director',
        location: 'Los Angeles, CA',
        startDate: '2022-02-01',
        endDate: '',
        current: true,
        description: 'Direct creative vision for 25+ client projects annually. Lead multidisciplinary team of 12 designers, developers, and strategists. Increased client retention by 90% through exceptional creative execution and strategic thinking. Won 5 industry awards for campaign excellence.'
      },
      {
        id: '2',
        company: 'Tech Innovators Inc.',
        position: 'Senior UX Designer',
        location: 'Los Angeles, CA',
        startDate: '2020-05-01',
        endDate: '2022-01-31',
        current: false,
        description: 'Redesigned core product interface serving 2M+ users, resulting in 40% increase in user satisfaction and 25% reduction in support tickets. Established design system and conducted user research to inform product decisions. Mentored junior designers and led design sprints.'
      },
      {
        id: '3',
        company: 'Creative Collective',
        position: 'Visual Designer',
        location: 'Los Angeles, CA',
        startDate: '2017-09-01',
        endDate: '2020-04-30',
        current: false,
        description: 'Created visual identities and marketing materials for startups and established brands. Developed brand guidelines and design systems ensuring consistency across all touchpoints. Collaborated with developers to ensure pixel-perfect implementation.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Art Center College of Design',
        degree: 'Bachelor of Fine Arts in Graphic Design',
        field: 'Graphic Design',
        startDate: '2013-09-01',
        endDate: '2017-05-15',
        gpa: '3.8'
      }
    ],
    skills: ['UX/UI Design', 'Brand Identity', 'Creative Direction', 'Design Systems', 'User Research', 'Prototyping', 'Adobe Creative Suite', 'Figma', 'Sketch', 'InVision', 'Design Thinking', 'Team Leadership', 'Client Communication'],
    certifications: [
      {
        id: '1',
        name: 'Google UX Design Professional Certificate',
        issuer: 'Google',
        date: '2021-03-15',
        expiryDate: '2024-03-15'
      },
      {
        id: '2',
        name: 'Adobe Certified Expert (ACE)',
        issuer: 'Adobe',
        date: '2020-08-20',
        expiryDate: '2023-08-20'
      },
      {
        id: '3',
        name: 'Nielsen Norman Group UX Certification',
        issuer: 'Nielsen Norman Group',
        date: '2019-11-10',
        expiryDate: '2022-11-10'
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'executive-formal': {
    personalInfo: {
      fullName: 'Robert Thompson',
      email: 'robert.thompson@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      linkedIn: 'https://linkedin.com/in/robert-thompson-cto',
      website: 'https://robertthompson.tech',
      summary: 'Visionary technology leader with 15+ years driving digital transformation and innovation at Fortune 500 companies. Led technology strategy for $2B+ revenue organizations, reducing operational costs by 40% while improving system reliability to 99.9%. Expert in scaling engineering teams and implementing cutting-edge technologies.'
    },
    experience: [
      {
        id: '1',
        company: 'Fortune 500 Tech Corp',
        position: 'Chief Technology Officer',
        location: 'Seattle, WA',
        startDate: '2020-01-01',
        endDate: '',
        current: true,
        description: 'Lead technology strategy for $2B+ revenue organization with 500+ engineering team. Implemented cloud migration reducing infrastructure costs by 60% and improving system reliability to 99.9%. Established AI/ML initiatives generating $50M+ in new revenue streams. Led digital transformation improving customer satisfaction by 45%.'
      },
      {
        id: '2',
        company: 'Innovation Labs Inc.',
        position: 'VP of Engineering',
        location: 'Seattle, WA',
        startDate: '2017-03-01',
        endDate: '2019-12-31',
        current: false,
        description: 'Scaled engineering team from 50 to 200+ developers across 4 countries. Implemented agile methodologies reducing time-to-market by 40%. Led development of flagship product serving 10M+ users. Established engineering excellence programs improving code quality and team productivity.'
      },
      {
        id: '3',
        company: 'Tech Solutions Group',
        position: 'Senior Engineering Manager',
        location: 'Seattle, WA',
        startDate: '2014-06-01',
        endDate: '2017-02-28',
        current: false,
        description: 'Managed 25-person engineering team delivering enterprise software solutions. Implemented DevOps practices reducing deployment time by 80%. Led successful migration from monolithic to microservices architecture. Improved team velocity by 60% through process optimization.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Stanford University',
        degree: 'Master of Science in Computer Science',
        field: 'Computer Science',
        startDate: '2012-09-01',
        endDate: '2014-05-15',
        gpa: '3.9'
      },
      {
        id: '2',
        institution: 'University of Washington',
        degree: 'Bachelor of Science in Computer Engineering',
        field: 'Computer Engineering',
        startDate: '2008-09-01',
        endDate: '2012-05-15',
        gpa: '3.8'
      }
    ],
    skills: ['Technology Strategy', 'Digital Transformation', 'Cloud Architecture', 'AI/ML', 'Team Leadership', 'Budget Management', 'Vendor Management', 'Risk Assessment', 'Innovation Management', 'Stakeholder Communication'],
    certifications: [
      {
        id: '1',
        name: 'AWS Solutions Architect Professional',
        issuer: 'Amazon Web Services',
        date: '2021-04-15',
        expiryDate: '2024-04-15'
      },
      {
        id: '2',
        name: 'Google Cloud Professional Cloud Architect',
        issuer: 'Google Cloud',
        date: '2020-09-10',
        expiryDate: '2023-09-10'
      },
      {
        id: '3',
        name: 'Certified Information Systems Security Professional (CISSP)',
        issuer: 'ISC²',
        date: '2019-06-20',
        expiryDate: '2022-06-20'
      },
      {
        id: '4',
        name: 'Project Management Professional (PMP)',
        issuer: 'Project Management Institute',
        date: '2018-03-05',
        expiryDate: '2021-03-05'
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'minimalist-clean': {
    personalInfo: {
      fullName: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      linkedIn: 'https://linkedin.com/in/emma-wilson-ux',
      website: 'https://emmawilson.design',
      summary: 'UX/UI designer with 5+ years creating user-centered digital experiences. Specialized in mobile app design and user research. Led design teams for products serving 2M+ users. Passionate about accessibility and inclusive design principles.'
    },
    experience: [
      {
        id: '1',
        company: 'Design Studio X',
        position: 'Senior UX Designer',
        location: 'Seattle, WA',
        startDate: '2021-06-01',
        endDate: '',
        current: true,
        description: 'Lead UX design for mobile applications with 2M+ active users. Conduct user research, create wireframes, and collaborate with development teams. Improved user satisfaction scores by 45% through iterative design improvements.'
      },
      {
        id: '2',
        company: 'Tech Startup Inc.',
        position: 'Product Designer',
        location: 'Seattle, WA',
        startDate: '2019-03-01',
        endDate: '2021-05-31',
        current: false,
        description: 'Designed complete user experience for SaaS platform from concept to launch. Created design system and component library. Conducted usability testing and implemented feedback-driven improvements.'
      },
      {
        id: '3',
        company: 'Creative Agency',
        position: 'Junior Designer',
        location: 'Seattle, WA',
        startDate: '2017-09-01',
        endDate: '2019-02-28',
        current: false,
        description: 'Created visual designs for web and mobile applications. Collaborated with senior designers on large-scale projects. Developed skills in user research and prototyping.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Washington',
        degree: 'Bachelor of Design',
        field: 'Interaction Design',
        startDate: '2013-09-01',
        endDate: '2017-06-15',
        gpa: '3.8'
      }
    ],
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility', 'Mobile Design', 'Web Design', 'User Testing', 'Information Architecture'],
    certifications: [
      {
        id: '1',
        name: 'Google UX Design Certificate',
        issuer: 'Google',
        date: '2020-08-15',
        expiryDate: '2023-08-15'
      },
      {
        id: '2',
        name: 'Accessibility Fundamentals',
        issuer: 'Deque University',
        date: '2019-11-20',
        expiryDate: '2022-11-20'
      }
    ],
    projects: [
      { id: '1', name: 'Mobile Banking App', description: 'Redesigned mobile banking experience improving task completion by 60%', technologies: 'Figma, Prototyping', url: 'https://dribbble.com/sample/banking-app' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'French', proficiency: 'Intermediate' }
    ],
    references: [
      { id: '1', name: 'Michael Chen', title: 'Design Director', company: 'Design Studio X', email: 'michael.chen@designstudio.com', phone: '+1 (555) 777-8888' }
    ],
    isSampleDatabase: false
  },

  'harvard-classic': {
    personalInfo: {
      fullName: 'Harvard Classic Test',
      email: 'harvard.classic@email.com',
      phone: '+1 (555) 987-6543',
      location: 'Boston, MA',
      linkedIn: 'https://linkedin.com/in/harvard-classic',
      website: 'https://harvardclassic.com',
      summary: 'Test CV for Harvard Classic template. Professional, proven, and ATS-optimized.'
    },
    experience: [
      {
        id: '1',
        company: 'Big Finance Co.',
        position: 'Analyst',
        location: 'Boston, MA',
        startDate: '2021-01-01',
        endDate: '',
        current: true,
        description: 'Analyzed financial data and created reports for executive leadership.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Harvard University',
        degree: 'BA in Economics',
        field: 'Economics',
        startDate: '2017-09-01',
        endDate: '2021-05-15',
        gpa: '3.95'
      }
    ],
    skills: ['Excel', 'Financial Modeling', 'Data Analysis', 'Presentation'],
    certifications: [
      {
        id: '1',
        name: 'CFA Level 1',
        issuer: 'CFA Institute',
        date: '2022-06-01',
        expiryDate: ''
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'modern-professional': {
    personalInfo: {
      fullName: 'Modern Pro Test',
      email: 'modern.pro@email.com',
      phone: '+1 (555) 222-3333',
      location: 'Seattle, WA',
      linkedIn: 'https://linkedin.com/in/modern-pro',
      website: 'https://modernpro.com',
      summary: 'Test CV for Modern Professional template. Clean, modern, and highly customizable.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Innovators',
        position: 'Lead Developer',
        location: 'Seattle, WA',
        startDate: '2020-05-01',
        endDate: '',
        current: true,
        description: 'Led a team of developers building scalable SaaS products.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Washington',
        degree: 'BS in Computer Engineering',
        field: 'Computer Engineering',
        startDate: '2016-09-01',
        endDate: '2020-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Cloud'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon',
        date: '2021-08-01',
        expiryDate: ''
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'attractive-clean': {
    personalInfo: {
      fullName: 'Attractive Clean Test',
      email: 'attractive.clean@email.com',
      phone: '+1 (555) 444-5555',
      location: 'Austin, TX',
      linkedIn: 'https://linkedin.com/in/attractive-clean',
      website: 'https://attractiveclean.com',
      summary: 'Test CV for Attractive Clean template. Modern fonts and subtle accents.'
    },
    experience: [
      {
        id: '1',
        company: 'Design Studio',
        position: 'UI Designer',
        location: 'Austin, TX',
        startDate: '2019-03-01',
        endDate: '',
        current: true,
        description: 'Designed user interfaces for web and mobile apps.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'UT Austin',
        degree: 'BFA in Design',
        field: 'Design',
        startDate: '2015-09-01',
        endDate: '2019-05-15',
        gpa: '3.6'
      }
    ],
    skills: ['Figma', 'Sketch', 'Adobe XD', 'UI/UX'],
    certifications: [
      {
        id: '1',
        name: 'Certified UX Designer',
        issuer: 'Interaction Design Foundation',
        date: '2020-10-01',
        expiryDate: ''
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'simple-clean': {
    personalInfo: {
      fullName: 'Simple Clean Test',
      email: 'simple.clean@email.com',
      phone: '+1 (555) 333-4444',
      location: 'Portland, OR',
      linkedIn: 'https://linkedin.com/in/simple-clean',
      website: 'https://simpleclean.com',
      summary: 'Test CV for Simple Clean template. Minimalist design focusing on content.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Solutions',
        position: 'Software Engineer',
        location: 'Portland, OR',
        startDate: '2021-06-01',
        endDate: '',
        current: true,
        description: 'Developed scalable software solutions using modern technologies.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Portland State University',
        degree: 'BS in Computer Science',
        field: 'Computer Science',
        startDate: '2017-09-01',
        endDate: '2021-05-15',
        gpa: '3.8'
      }
    ],
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2022-03-01',
        expiryDate: '2025-03-01'
      }
    ],
    projects: [
      { id: '1', name: 'Task Management App', description: 'Built a task management application...', technologies: 'React, Node.js, MongoDB', url: 'https://github.com/sample/task-app' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'French', proficiency: 'Intermediate' }
    ],
    references: [
      { id: '1', name: 'John Smith', title: 'Senior Engineer', company: 'Tech Solutions', email: 'john.smith@techsolutions.com', phone: '+1 (555) 222-3333' }
    ],
    isSampleDatabase: false
  },

  'perfect-resume': {
    personalInfo: {
      fullName: 'Perfect Resume Test',
      email: 'perfect.resume@email.com',
      phone: '+1 (555) 555-6666',
      location: 'Chicago, IL',
      linkedIn: 'https://linkedin.com/in/perfect-resume',
      website: 'https://perfectresume.com',
      summary: 'Test CV for Perfect Resume template. Balanced clarity, design, and structure.'
    },
    experience: [
      {
        id: '1',
        company: 'Global Corp',
        position: 'Project Manager',
        location: 'Chicago, IL',
        startDate: '2020-01-01',
        endDate: '',
        current: true,
        description: 'Managed multiple projects with budgets over $1M and teams of 10+ people.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Chicago',
        degree: 'MBA',
        field: 'Business Administration',
        startDate: '2018-09-01',
        endDate: '2020-05-15',
        gpa: '3.9'
      }
    ],
    skills: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Strategic Planning'],
    certifications: [
      {
        id: '1',
        name: 'PMP Certification',
        issuer: 'Project Management Institute',
        date: '2021-06-01',
        expiryDate: '2024-06-01'
      }
    ],
    projects: [
      { id: '1', name: 'Digital Transformation', description: 'Led digital transformation initiative...', technologies: 'Change Management, Technology Integration', url: 'https://github.com/sample/transformation' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'German', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Sarah Johnson', title: 'Director', company: 'Global Corp', email: 'sarah.johnson@globalcorp.com', phone: '+1 (555) 777-8888' }
    ],
    isSampleDatabase: false
  },

  'unique-clean': {
    personalInfo: {
      fullName: 'Unique Clean Test',
      email: 'unique.clean@email.com',
      phone: '+1 (555) 666-7777',
      location: 'Miami, FL',
      linkedIn: 'https://linkedin.com/in/unique-clean',
      website: 'https://uniqueclean.com',
      summary: 'Test CV for Unique Clean template. Modern fonts with creative flair.'
    },
    experience: [
      {
        id: '1',
        company: 'Creative Agency',
        position: 'Creative Director',
        location: 'Miami, FL',
        startDate: '2019-08-01',
        endDate: '',
        current: true,
        description: 'Led creative direction for major brand campaigns and digital projects.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Miami Art Institute',
        degree: 'BFA in Graphic Design',
        field: 'Graphic Design',
        startDate: '2015-09-01',
        endDate: '2019-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['Creative Direction', 'Brand Strategy', 'Adobe Creative Suite', 'Digital Marketing'],
    certifications: [
      {
        id: '1',
        name: 'Adobe Certified Expert',
        issuer: 'Adobe',
        date: '2020-12-01',
        expiryDate: '2023-12-01'
      }
    ],
    projects: [
      { id: '1', name: 'Brand Identity Design', description: 'Created comprehensive brand identity...', technologies: 'Adobe Creative Suite, Brand Strategy', url: 'https://github.com/sample/brand-design' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Native' }
    ],
    references: [
      { id: '1', name: 'Carlos Rodriguez', title: 'CEO', company: 'Creative Agency', email: 'carlos.rodriguez@creativeagency.com', phone: '+1 (555) 999-0000' }
    ],
    isSampleDatabase: false
  },

  'creative-clean': {
    personalInfo: {
      fullName: 'Creative Clean Test',
      email: 'creative.clean@email.com',
      phone: '+1 (555) 777-8888',
      location: 'Los Angeles, CA',
      linkedIn: 'https://linkedin.com/in/creative-clean',
      website: 'https://creativeclean.com',
      summary: 'Test CV for Creative Clean template. Professional design that increases interview chances.'
    },
    experience: [
      {
        id: '1',
        company: 'Design Studio LA',
        position: 'Senior Designer',
        location: 'Los Angeles, CA',
        startDate: '2021-03-01',
        endDate: '',
        current: true,
        description: 'Created innovative design solutions for Fortune 500 clients.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Art Center College',
        degree: 'BFA in Design',
        field: 'Design',
        startDate: '2017-09-01',
        endDate: '2021-05-15',
        gpa: '3.8'
      }
    ],
    skills: ['UI/UX Design', 'Brand Design', 'Prototyping', 'User Research', 'Design Systems'],
    certifications: [
      {
        id: '1',
        name: 'Google UX Design Certificate',
        issuer: 'Google',
        date: '2022-01-01',
        expiryDate: '2025-01-01'
      }
    ],
    projects: [
      { id: '1', name: 'Mobile App Design', description: 'Designed user experience for mobile app...', technologies: 'Figma, Prototyping, User Research', url: 'https://github.com/sample/mobile-design' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Italian', proficiency: 'Intermediate' }
    ],
    references: [
      { id: '1', name: 'Maria Garcia', title: 'Design Director', company: 'Design Studio LA', email: 'maria.garcia@designstudiola.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'business-resume': {
    personalInfo: {
      fullName: 'Business Resume Test',
      email: 'business.resume@email.com',
      phone: '+1 (555) 888-9999',
      location: 'New York, NY',
      linkedIn: 'https://linkedin.com/in/business-resume',
      website: 'https://businessresume.com',
      summary: 'Test CV for Business Resume template. Professional and polished layout for corporate roles.'
    },
    experience: [
      {
        id: '1',
        company: 'Fortune 500 Corp',
        position: 'Business Analyst',
        location: 'New York, NY',
        startDate: '2020-09-01',
        endDate: '',
        current: true,
        description: 'Analyzed business processes and provided strategic recommendations to senior management.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'NYU Stern',
        degree: 'MBA',
        field: 'Business Administration',
        startDate: '2018-09-01',
        endDate: '2020-05-15',
        gpa: '3.9'
      }
    ],
    skills: ['Business Analysis', 'Data Analysis', 'Process Improvement', 'Strategic Planning', 'Stakeholder Management'],
    certifications: [
      {
        id: '1',
        name: 'CBAP Certification',
        issuer: 'IIBA',
        date: '2021-09-01',
        expiryDate: '2024-09-01'
      }
    ],
    projects: [
      { id: '1', name: 'Process Optimization', description: 'Optimized business processes resulting in 30% efficiency improvement...', technologies: 'Business Analysis, Process Mapping', url: 'https://github.com/sample/process-optimization' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Mandarin', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'David Chen', title: 'Senior Manager', company: 'Fortune 500 Corp', email: 'david.chen@fortune500.com', phone: '+1 (555) 333-4444' }
    ],
    isSampleDatabase: false
  },

  'minimalist-formal': {
    personalInfo: {
      fullName: 'Minimalist Formal Test',
      email: 'minimalist.formal@email.com',
      phone: '+1 (555) 111-2222',
      location: 'San Francisco, CA',
      linkedIn: 'https://linkedin.com/in/minimalist-formal',
      website: 'https://minimalistformal.com',
      summary: 'Test CV for Minimalist Formal template. Clean, professional, and minimalist.'
    },
    experience: [
      {
        id: '1',
        company: 'TechCorp Inc.',
        position: 'Junior Software Engineer',
        location: 'San Francisco, CA',
        startDate: '2022-01-01',
        endDate: '',
        current: true,
        description: 'Developed and maintained web applications using React and Node.js.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of California, Berkeley',
        degree: 'Bachelor of Science in Computer Science',
        field: 'Computer Science',
        startDate: '2018-09-01',
        endDate: '2022-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon',
        date: '2022-01-01',
        expiryDate: '2025-01-01'
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'simple-creative': {
    personalInfo: {
      fullName: 'Simple Creative Test',
      email: 'simple.creative@email.com',
      phone: '+1 (555) 222-3333',
      location: 'Los Angeles, CA',
      linkedIn: 'https://linkedin.com/in/simple-creative',
      website: 'https://simplecreative.com',
      summary: 'Test CV for Simple Creative template. Clean, creative, and minimal.'
    },
    experience: [
      {
        id: '1',
        company: 'Design Studio LA',
        position: 'Junior Designer',
        location: 'Los Angeles, CA',
        startDate: '2021-01-01',
        endDate: '',
        current: true,
        description: 'Designed user interfaces and marketing materials for clients.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Art Center College of Design',
        degree: 'Bachelor of Fine Arts in Graphic Design',
        field: 'Graphic Design',
        startDate: '2019-09-01',
        endDate: '2023-05-15',
        gpa: '3.6'
      }
    ],
    skills: ['Figma', 'Adobe XD', 'UI/UX', 'Brand Design'],
    certifications: [
      {
        id: '1',
        name: 'Certified UX Designer',
        issuer: 'Interaction Design Foundation',
        date: '2021-01-01',
        expiryDate: '2024-01-01'
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'perfect-clean-cv': {
    personalInfo: {
      fullName: 'Perfect Clean CV Test',
      email: 'perfect.clean.cv@email.com',
      phone: '+1 (555) 333-4444',
      location: 'Boston, MA',
      linkedIn: 'https://linkedin.com/in/perfect-clean-cv',
      website: 'https://perfectcleancv.com',
      summary: 'Test CV for Perfect Clean CV template. Clean, professional, and minimal.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Solutions',
        position: 'Software Engineer',
        location: 'Boston, MA',
        startDate: '2021-01-01',
        endDate: '',
        current: true,
        description: 'Developed scalable software solutions using modern technologies.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Massachusetts Institute of Technology',
        degree: 'Master of Science in Data Science',
        field: 'Data Science',
        startDate: '2018-09-01',
        endDate: '2022-05-15',
        gpa: '3.9'
      }
    ],
    skills: ['Python', 'R', 'SQL', 'Machine Learning', 'Deep Learning', 'Statistical Analysis', 'Data Visualization', 'Big Data', 'AWS', 'Docker', 'Git', 'Jupyter', 'Pandas', 'Scikit-learn', 'TensorFlow'],
    certifications: [
      {
        id: '1',
        name: 'AWS Machine Learning Specialty',
        issuer: 'Amazon Web Services',
        date: '2021-09-01',
        expiryDate: '2024-09-01'
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'modern-cv': {
    personalInfo: {
      fullName: 'Modern CV Test',
      email: 'modern.cv@email.com',
      phone: '+1 (555) 444-5555',
      location: 'Austin, TX',
      linkedIn: 'https://linkedin.com/in/modern-cv',
      website: 'https://moderncv.com',
      summary: 'Test CV for Modern CV template. Modern, clean, and highly customizable.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Innovators',
        position: 'Lead Developer',
        location: 'Austin, TX',
        startDate: '2020-01-01',
        endDate: '',
        current: true,
        description: 'Led a team of developers building scalable SaaS products.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Texas at Austin',
        degree: 'BS in Computer Science',
        field: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Cloud'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon',
        date: '2021-08-01',
        expiryDate: ''
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'creative-professional': {
    personalInfo: {
      fullName: 'Creative Professional Test',
      email: 'creative.professional@email.com',
      phone: '+1 (555) 555-6666',
      location: 'Miami, FL',
      linkedIn: 'https://linkedin.com/in/creative-professional',
      website: 'https://creativeprofessional.com',
      summary: 'Test CV for Creative Professional template. Creative, professional, and highly customizable.'
    },
    experience: [
      {
        id: '1',
        company: 'Creative Agency',
        position: 'Senior Designer',
        location: 'Miami, FL',
        startDate: '2019-01-01',
        endDate: '',
        current: true,
        description: 'Led creative direction for major brand campaigns and digital projects.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Miami Art Institute',
        degree: 'BFA in Graphic Design',
        field: 'Graphic Design',
        startDate: '2015-09-01',
        endDate: '2019-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['Creative Direction', 'Brand Strategy', 'Adobe Creative Suite', 'Digital Marketing'],
    certifications: [
      {
        id: '1',
        name: 'Adobe Certified Expert',
        issuer: 'Adobe',
        date: '2020-12-01',
        expiryDate: '2023-12-01'
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Native' }
    ],
    references: [
      { id: '1', name: 'Carlos Rodriguez', title: 'CEO', company: 'Creative Agency', email: 'carlos.rodriguez@creativeagency.com', phone: '+1 (555) 999-0000' }
    ],
    isSampleDatabase: false
  },

  'attractive-cv': {
    personalInfo: {
      fullName: 'Attractive CV Test',
      email: 'attractive.cv@email.com',
      phone: '+1 (555) 666-7777',
      location: 'Austin, TX',
      linkedIn: 'https://linkedin.com/in/attractive-cv',
      website: 'https://attractivecv.com',
      summary: 'Test CV for Attractive CV template. Modern fonts and subtle accents.'
    },
    experience: [
      {
        id: '1',
        company: 'Design Studio',
        position: 'UI Designer',
        location: 'Austin, TX',
        startDate: '2019-03-01',
        endDate: '',
        current: true,
        description: 'Designed user interfaces for web and mobile apps.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'UT Austin',
        degree: 'BFA in Design',
        field: 'Design',
        startDate: '2015-09-01',
        endDate: '2019-05-15',
        gpa: '3.6'
      }
    ],
    skills: ['Figma', 'Sketch', 'Adobe XD', 'UI/UX'],
    certifications: [
      {
        id: '1',
        name: 'Certified UX Designer',
        issuer: 'Interaction Design Foundation',
        date: '2020-10-01',
        expiryDate: ''
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'simple-creative-cv': {
    personalInfo: {
      fullName: 'Simple Creative CV Test',
      email: 'simple.creative.cv@email.com',
      phone: '+1 (555) 777-8888',
      location: 'Portland, OR',
      linkedIn: 'https://linkedin.com/in/simple-creative-cv',
      website: 'https://simplecreativecv.com',
      summary: 'Test CV for Simple Creative CV template. Minimalist design focusing on content.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Solutions',
        position: 'Software Engineer',
        location: 'Portland, OR',
        startDate: '2021-06-01',
        endDate: '',
        current: true,
        description: 'Developed scalable software solutions using modern technologies.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Portland State University',
        degree: 'BS in Computer Science',
        field: 'Computer Science',
        startDate: '2017-09-01',
        endDate: '2021-05-15',
        gpa: '3.8'
      }
    ],
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2022-03-01',
        expiryDate: '2025-03-01'
      }
    ],
    projects: [
      { id: '1', name: 'Task Management App', description: 'Built a task management application...', technologies: 'React, Node.js, MongoDB', url: 'https://github.com/sample/task-app' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'French', proficiency: 'Intermediate' }
    ],
    references: [
      { id: '1', name: 'John Smith', title: 'Senior Engineer', company: 'Tech Solutions', email: 'john.smith@techsolutions.com', phone: '+1 (555) 222-3333' }
    ],
    isSampleDatabase: false
  },

  'perfect-resume-cv': {
    personalInfo: {
      fullName: 'Perfect Resume CV Test',
      email: 'perfect.resume.cv@email.com',
      phone: '+1 (555) 888-9999',
      location: 'Chicago, IL',
      linkedIn: 'https://linkedin.com/in/perfect-resume-cv',
      website: 'https://perfectresumecv.com',
      summary: 'Test CV for Perfect Resume CV template. Balanced clarity, design, and structure.'
    },
    experience: [
      {
        id: '1',
        company: 'Global Corp',
        position: 'Project Manager',
        location: 'Chicago, IL',
        startDate: '2020-01-01',
        endDate: '',
        current: true,
        description: 'Managed multiple projects with budgets over $1M and teams of 10+ people.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Chicago',
        degree: 'MBA',
        field: 'Business Administration',
        startDate: '2018-09-01',
        endDate: '2020-05-15',
        gpa: '3.9'
      }
    ],
    skills: ['Project Management', 'Agile', 'Scrum', 'Leadership', 'Strategic Planning'],
    certifications: [
      {
        id: '1',
        name: 'PMP Certification',
        issuer: 'Project Management Institute',
        date: '2021-06-01',
        expiryDate: '2024-06-01'
      }
    ],
    projects: [
      { id: '1', name: 'Digital Transformation', description: 'Led digital transformation initiative...', technologies: 'Change Management, Technology Integration', url: 'https://github.com/sample/transformation' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'German', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Sarah Johnson', title: 'Director', company: 'Global Corp', email: 'sarah.johnson@globalcorp.com', phone: '+1 (555) 777-8888' }
    ],
    isSampleDatabase: false
  },

  'unique-cv': {
    personalInfo: {
      fullName: 'Unique CV Test',
      email: 'unique.cv@email.com',
      phone: '+1 (555) 999-0000',
      location: 'Miami, FL',
      linkedIn: 'https://linkedin.com/in/unique-cv',
      website: 'https://uniquecv.com',
      summary: 'Test CV for Unique CV template. Modern fonts with creative flair.'
    },
    experience: [
      {
        id: '1',
        company: 'Creative Agency',
        position: 'Creative Director',
        location: 'Miami, FL',
        startDate: '2019-08-01',
        endDate: '',
        current: true,
        description: 'Led creative direction for major brand campaigns and digital projects.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Miami Art Institute',
        degree: 'BFA in Graphic Design',
        field: 'Graphic Design',
        startDate: '2015-09-01',
        endDate: '2019-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['Creative Direction', 'Brand Strategy', 'Adobe Creative Suite', 'Digital Marketing'],
    certifications: [
      {
        id: '1',
        name: 'Adobe Certified Expert',
        issuer: 'Adobe',
        date: '2020-12-01',
        expiryDate: '2023-12-01'
      }
    ],
    projects: [
      { id: '1', name: 'Brand Identity Design', description: 'Created comprehensive brand identity...', technologies: 'Adobe Creative Suite, Brand Strategy', url: 'https://github.com/sample/brand-design' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Native' }
    ],
    references: [
      { id: '1', name: 'Carlos Rodriguez', title: 'CEO', company: 'Creative Agency', email: 'carlos.rodriguez@creativeagency.com', phone: '+1 (555) 999-0000' }
    ],
    isSampleDatabase: false
  },

  'creative-cv': {
    personalInfo: {
      fullName: 'Creative CV Test',
      email: 'creative.cv@email.com',
      phone: '+1 (555) 111-2222',
      location: 'Los Angeles, CA',
      linkedIn: 'https://linkedin.com/in/creative-cv',
      website: 'https://creativecv.com',
      summary: 'Test CV for Creative CV template. Professional design that increases interview chances.'
    },
    experience: [
      {
        id: '1',
        company: 'Design Studio LA',
        position: 'Senior Designer',
        location: 'Los Angeles, CA',
        startDate: '2021-03-01',
        endDate: '',
        current: true,
        description: 'Created innovative design solutions for Fortune 500 clients.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Art Center College',
        degree: 'BFA in Design',
        field: 'Design',
        startDate: '2017-09-01',
        endDate: '2021-05-15',
        gpa: '3.8'
      }
    ],
    skills: ['UI/UX Design', 'Brand Design', 'Prototyping', 'User Research', 'Design Systems'],
    certifications: [
      {
        id: '1',
        name: 'Google UX Design Certificate',
        issuer: 'Google',
        date: '2022-01-01',
        expiryDate: '2025-01-01'
      }
    ],
    projects: [
      { id: '1', name: 'Mobile App Design', description: 'Designed user experience for mobile app...', technologies: 'Figma, Prototyping, User Research', url: 'https://github.com/sample/mobile-design' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Italian', proficiency: 'Intermediate' }
    ],
    references: [
      { id: '1', name: 'Maria Garcia', title: 'Design Director', company: 'Design Studio LA', email: 'maria.garcia@designstudiola.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },

  'business-cv': {
    personalInfo: {
      fullName: 'Business CV Test',
      email: 'business.cv@email.com',
      phone: '+1 (555) 222-3333',
      location: 'New York, NY',
      linkedIn: 'https://linkedin.com/in/business-cv',
      website: 'https://businesscv.com',
      summary: 'Test CV for Business CV template. Professional and polished layout for corporate roles.'
    },
    experience: [
      {
        id: '1',
        company: 'Fortune 500 Corp',
        position: 'Business Analyst',
        location: 'New York, NY',
        startDate: '2020-09-01',
        endDate: '',
        current: true,
        description: 'Analyzed business processes and provided strategic recommendations to senior management.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'NYU Stern',
        degree: 'MBA',
        field: 'Business Administration',
        startDate: '2018-09-01',
        endDate: '2020-05-15',
        gpa: '3.9'
      }
    ],
    skills: ['Business Analysis', 'Data Analysis', 'Process Improvement', 'Strategic Planning', 'Stakeholder Management'],
    certifications: [
      {
        id: '1',
        name: 'CBAP Certification',
        issuer: 'IIBA',
        date: '2021-09-01',
        expiryDate: '2024-09-01'
      }
    ],
    projects: [
      { id: '1', name: 'Process Optimization', description: 'Optimized business processes resulting in 30% efficiency improvement...', technologies: 'Business Analysis, Process Mapping', url: 'https://github.com/sample/process-optimization' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Mandarin', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'David Chen', title: 'Senior Manager', company: 'Fortune 500 Corp', email: 'david.chen@fortune500.com', phone: '+1 (555) 333-4444' }
    ],
    isSampleDatabase: false
  },
  'finance-professional': {
    personalInfo: {
      fullName: 'Finance Pro Test',
      email: 'finance.pro@email.com',
      phone: '+1 (555) 888-1111',
      location: 'London, UK',
      linkedIn: 'https://linkedin.com/in/finance-pro',
      website: 'https://financepro.com',
      summary: 'Test CV for Finance Professional template. Black header, finance keywords, and UK location.'
    },
    experience: [
      {
        id: '1',
        company: 'Big Bank PLC',
        position: 'Senior Financial Analyst',
        location: 'London, UK',
        startDate: '2019-01-01',
        endDate: '',
        current: true,
        description: 'Analyzed investment portfolios and managed risk for high-net-worth clients.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'London School of Economics',
        degree: 'MSc Finance',
        field: 'Finance',
        startDate: '2016-09-01',
        endDate: '2018-06-15',
        gpa: '3.9'
      }
    ],
    skills: ['Financial Analysis', 'Risk Management', 'Excel', 'Portfolio Management'],
    certifications: [
      {
        id: '1',
        name: 'CFA Level 2',
        issuer: 'CFA Institute',
        date: '2022-06-01',
        expiryDate: ''
      }
    ],
    projects: [
      { id: '1', name: 'Risk Model', description: 'Developed a risk assessment model for investment portfolios.', technologies: 'Python, Excel', url: 'https://github.com/sample/risk-model' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'French', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Anna Smith', title: 'Director', company: 'Big Bank PLC', email: 'anna.smith@bigbank.com', phone: '+44 20 1234 5678' }
    ],
    isSampleDatabase: false
  },
  'executive-modern': {
    personalInfo: {
      fullName: 'Executive Modern Test',
      email: 'executive.modern@email.com',
      phone: '+1 (555) 222-4444',
      location: 'New York, NY',
      linkedIn: 'https://linkedin.com/in/executive-modern',
      website: 'https://executivemodern.com',
      summary: 'Test CV for Executive Modern template. Two-column layout, executive keywords.'
    },
    experience: [
      {
        id: '1',
        company: 'Global Holdings',
        position: 'Chief Operating Officer',
        location: 'New York, NY',
        startDate: '2017-01-01',
        endDate: '',
        current: true,
        description: 'Oversaw operations for a multinational corporation.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Harvard Business School',
        degree: 'MBA',
        field: 'Business Administration',
        startDate: '2012-09-01',
        endDate: '2014-06-15',
        gpa: '3.8'
      }
    ],
    skills: ['Leadership', 'Operations', 'Strategy', 'Mergers & Acquisitions'],
    certifications: [
      {
        id: '1',
        name: 'PMP',
        issuer: 'PMI',
        date: '2015-05-01',
        expiryDate: '2025-05-01'
      }
    ],
    projects: [
      { id: '1', name: 'Global Expansion', description: 'Led global expansion into 5 new markets.', technologies: 'Strategy, Operations', url: 'https://github.com/sample/global-expansion' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'John Lee', title: 'CEO', company: 'Global Holdings', email: 'john.lee@global.com', phone: '+1 (555) 333-5555' }
    ],
    isSampleDatabase: false
  },
  'creative-portfolio': {
    personalInfo: {
      fullName: 'Creative Portfolio Test',
      email: 'creative.portfolio@email.com',
      phone: '+1 (555) 333-6666',
      location: 'San Francisco, CA',
      linkedIn: 'https://linkedin.com/in/creative-portfolio',
      website: 'https://creativeportfolio.com',
      summary: 'Test CV for Creative Portfolio template. Modern, clean, and highly customizable.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Innovators',
        position: 'Lead Developer',
        location: 'San Francisco, CA',
        startDate: '2020-01-01',
        endDate: '',
        current: true,
        description: 'Led a team of developers building scalable SaaS products.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of California, Berkeley',
        degree: 'BS in Computer Science',
        field: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Cloud'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon',
        date: '2021-08-01',
        expiryDate: ''
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },
  'minimalist': {
    personalInfo: {
      fullName: 'Minimalist Test',
      email: 'minimalist@email.com',
      phone: '+1 (555) 444-7777',
      location: 'Portland, OR',
      linkedIn: 'https://linkedin.com/in/minimalist',
      website: 'https://minimalist.com',
      summary: 'Test CV for Minimalist template. Clean, professional, and minimalist.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Solutions',
        position: 'Software Engineer',
        location: 'Portland, OR',
        startDate: '2021-01-01',
        endDate: '',
        current: true,
        description: 'Developed scalable software solutions using modern technologies.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Portland State University',
        degree: 'BS in Computer Science',
        field: 'Computer Science',
        startDate: '2017-09-01',
        endDate: '2021-05-15',
        gpa: '3.8'
      }
    ],
    skills: ['Python', 'JavaScript', 'React', 'Node.js', 'PostgreSQL'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon Web Services',
        date: '2022-03-01',
        expiryDate: '2025-03-01'
      }
    ],
    projects: [
      { id: '1', name: 'Task Management App', description: 'Built a task management application...', technologies: 'React, Node.js, MongoDB', url: 'https://github.com/sample/task-app' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'French', proficiency: 'Intermediate' }
    ],
    references: [
      { id: '1', name: 'John Smith', title: 'Senior Engineer', company: 'Tech Solutions', email: 'john.smith@techsolutions.com', phone: '+1 (555) 222-3333' }
    ],
    isSampleDatabase: false
  },
  'aesthetic-style': {
    personalInfo: {
      fullName: 'Aesthetic Style Test',
      email: 'aesthetic.style@email.com',
      phone: '+1 (555) 555-8888',
      location: 'Austin, TX',
      linkedIn: 'https://linkedin.com/in/aesthetic-style',
      website: 'https://aestheticstyle.com',
      summary: 'Test CV for Aesthetic Style template. Modern, clean, and highly customizable.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Innovators',
        position: 'Lead Developer',
        location: 'Austin, TX',
        startDate: '2020-01-01',
        endDate: '',
        current: true,
        description: 'Led a team of developers building scalable SaaS products.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Texas at Austin',
        degree: 'BS in Computer Science',
        field: 'Computer Science',
        startDate: '2016-09-01',
        endDate: '2020-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'Cloud'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon',
        date: '2021-08-01',
        expiryDate: ''
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },
  'minimal-clean': {
    personalInfo: {
      fullName: 'Emma Wilson',
      email: 'emma.wilson@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      linkedIn: 'https://linkedin.com/in/emma-wilson-ux',
      website: 'https://emmawilson.design',
      summary: 'UX/UI designer with 5+ years creating user-centered digital experiences. Specialized in mobile app design and user research. Led design teams for products serving 2M+ users. Passionate about accessibility and inclusive design principles.'
    },
    experience: [
      {
        id: '1',
        company: 'Design Studio X',
        position: 'Senior UX Designer',
        location: 'Seattle, WA',
        startDate: '2021-06-01',
        endDate: '',
        current: true,
        description: 'Lead UX design for mobile applications with 2M+ active users. Conduct user research, create wireframes, and collaborate with development teams. Improved user satisfaction scores by 45% through iterative design improvements.'
      },
      {
        id: '2',
        company: 'Tech Startup Inc.',
        position: 'Product Designer',
        location: 'Seattle, WA',
        startDate: '2019-03-01',
        endDate: '2021-05-31',
        current: false,
        description: 'Designed complete user experience for SaaS platform from concept to launch. Created design system and component library. Conducted usability testing and implemented feedback-driven improvements.'
      },
      {
        id: '3',
        company: 'Creative Agency',
        position: 'Junior Designer',
        location: 'Seattle, WA',
        startDate: '2017-09-01',
        endDate: '2019-02-28',
        current: false,
        description: 'Created visual designs for web and mobile applications. Collaborated with senior designers on large-scale projects. Developed skills in user research and prototyping.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Washington',
        degree: 'Bachelor of Design',
        field: 'Interaction Design',
        startDate: '2013-09-01',
        endDate: '2017-06-15',
        gpa: '3.8'
      }
    ],
    skills: ['Figma', 'Sketch', 'Adobe Creative Suite', 'User Research', 'Wireframing', 'Prototyping', 'Design Systems', 'Accessibility', 'Mobile Design', 'Web Design', 'User Testing', 'Information Architecture'],
    certifications: [
      {
        id: '1',
        name: 'Google UX Design Certificate',
        issuer: 'Google',
        date: '2020-08-15',
        expiryDate: '2023-08-15'
      },
      {
        id: '2',
        name: 'Accessibility Fundamentals',
        issuer: 'Deque University',
        date: '2019-11-20',
        expiryDate: '2022-11-20'
      }
    ],
    projects: [
      { id: '1', name: 'Mobile Banking App', description: 'Redesigned mobile banking experience improving task completion by 60%', technologies: 'Figma, Prototyping', url: 'https://dribbble.com/sample/banking-app' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'French', proficiency: 'Intermediate' }
    ],
    references: [
      { id: '1', name: 'Michael Chen', title: 'Design Director', company: 'Design Studio X', email: 'michael.chen@designstudio.com', phone: '+1 (555) 777-8888' }
    ],
    isSampleDatabase: false
  },
  'professional-simple': {
    personalInfo: {
      fullName: 'Simple Professional Test',
      email: 'simple.professional@email.com',
      phone: '+1 (555) 999-0000',
      location: 'New York, NY',
      linkedIn: 'https://linkedin.com/in/simple-professional',
      website: 'https://simpleprofessional.com',
      summary: 'Test CV for Simple Professional template. Clean, professional, and minimalist.'
    },
    experience: [
      {
        id: '1',
        company: 'Tech Innovators',
        position: 'Junior Software Engineer',
        location: 'New York, NY',
        startDate: '2021-01-01',
        endDate: '',
        current: true,
        description: 'Developed and maintained web applications using React and Node.js.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'New York University',
        degree: 'BS in Computer Science',
        field: 'Computer Science',
        startDate: '2018-09-01',
        endDate: '2021-05-15',
        gpa: '3.7'
      }
    ],
    skills: ['JavaScript', 'React', 'Node.js', 'AWS'],
    certifications: [
      {
        id: '1',
        name: 'AWS Certified Developer',
        issuer: 'Amazon',
        date: '2021-08-01',
        expiryDate: ''
      }
    ],
    projects: [
      { id: '1', name: 'E-Commerce Platform', description: 'Built a scalable e-commerce app...', technologies: 'React, Node.js, AWS', url: 'https://github.com/sample/ecommerce' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Spanish', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jane Doe', title: 'Manager', company: 'TechCorp', email: 'jane.doe@techcorp.com', phone: '+1 (555) 111-2222' }
    ],
    isSampleDatabase: false
  },
  'stunning-cv': {
    personalInfo: {
      fullName: 'Stella Carter',
      email: 'stella.carter@executive.com',
      phone: '+1 (555) 888-9999',
      location: 'New York, NY',
      linkedIn: 'https://linkedin.com/in/stella-carter',
      website: 'https://stellacarter.com',
      summary: 'C-level executive with 20+ years of experience leading global teams and driving business transformation in Fortune 500 companies. Expert in M&A, digital strategy, and operational excellence.'
    },
    experience: [
      {
        id: '1',
        company: 'Global Holdings',
        position: 'Chief Executive Officer',
        location: 'New York, NY',
        startDate: '2015-01-01',
        endDate: '',
        current: true,
        description: 'Led a $2B global enterprise through digital transformation, resulting in 40% revenue growth and 30% cost reduction. Oversaw 10,000+ employees across 15 countries.'
      },
      {
        id: '2',
        company: 'Tech Innovators',
        position: 'Chief Operating Officer',
        location: 'San Francisco, CA',
        startDate: '2010-06-01',
        endDate: '2014-12-31',
        current: false,
        description: 'Implemented operational excellence programs, increasing productivity by 25% and reducing time-to-market for new products.'
      },
      {
        id: '3',
        company: 'Finance Group',
        position: 'VP of Strategy',
        location: 'London, UK',
        startDate: '2005-03-01',
        endDate: '2010-05-31',
        current: false,
        description: 'Developed and executed M&A strategy, completing 12 successful acquisitions.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Harvard Business School',
        degree: 'MBA',
        field: 'Business Administration',
        startDate: '2002-09-01',
        endDate: '2004-06-15',
        gpa: '3.9'
      },
      {
        id: '2',
        institution: 'University of Oxford',
        degree: 'BA Economics',
        field: 'Economics',
        startDate: '1998-09-01',
        endDate: '2001-06-15',
        gpa: '3.8'
      }
    ],
    skills: ['Leadership', 'Mergers & Acquisitions', 'Digital Strategy', 'Operational Excellence', 'Global Expansion', 'Change Management', 'Board Relations', 'Financial Analysis', 'Public Speaking'],
    certifications: [
      { id: '1', name: 'Certified M&A Professional', issuer: 'M&A Institute', date: '2012-05-01', expiryDate: '' },
      { id: '2', name: 'Six Sigma Black Belt', issuer: 'ASQ', date: '2010-09-01', expiryDate: '' }
    ],
    projects: [
      { id: '1', name: 'Global Digital Transformation', description: 'Led a company-wide digital transformation initiative.', technologies: 'Cloud, AI, ERP', url: 'https://stellacarter.com/projects/digital' },
      { id: '2', name: 'M&A Integration', description: 'Integrated 12 acquired companies into a unified global operation.', technologies: 'M&A, Integration', url: 'https://stellacarter.com/projects/ma' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'French', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'John Lee', title: 'Chairman', company: 'Global Holdings', email: 'john.lee@global.com', phone: '+1 (555) 333-5555' },
      { id: '2', name: 'Maria Gomez', title: 'CFO', company: 'Tech Innovators', email: 'maria.gomez@techinnovators.com', phone: '+1 (555) 444-6666' }
    ],
    isSampleDatabase: false
  },
  'founder-visionary': {
    personalInfo: {
      fullName: 'Ava Patel',
      email: 'ava.patel@visionary.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedIn: 'https://linkedin.com/in/ava-patel',
      website: 'https://avapatel.com',
      summary: 'Serial founder and visionary leader with 15+ years building and scaling tech startups. Expert in fundraising, product strategy, and global expansion.'
    },
    experience: [
      {
        id: '1',
        company: 'NextGen AI',
        position: 'Founder & CEO',
        location: 'San Francisco, CA',
        startDate: '2017-04-01',
        endDate: '',
        current: true,
        description: 'Founded and scaled an AI SaaS company to $100M ARR. Raised $50M in venture funding and led global expansion to 10 countries.'
      },
      {
        id: '2',
        company: 'HealthTech Solutions',
        position: 'Co-Founder & CTO',
        location: 'New York, NY',
        startDate: '2012-01-01',
        endDate: '2017-03-31',
        current: false,
        description: 'Built a telemedicine platform used by 1M+ patients. Led product and engineering teams.'
      },
      {
        id: '3',
        company: 'Startup Accelerator',
        position: 'Mentor',
        location: 'Remote',
        startDate: '2018-01-01',
        endDate: '',
        current: true,
        description: 'Mentored 30+ early-stage founders on fundraising, go-to-market, and product development.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Stanford University',
        degree: 'MS Computer Science',
        field: 'Artificial Intelligence',
        startDate: '2008-09-01',
        endDate: '2010-06-15',
        gpa: '3.9'
      },
      {
        id: '2',
        institution: 'UC Berkeley',
        degree: 'BS Electrical Engineering',
        field: 'Electrical Engineering',
        startDate: '2004-09-01',
        endDate: '2008-06-15',
        gpa: '3.8'
      }
    ],
    skills: ['Fundraising', 'Product Strategy', 'AI/ML', 'Global Expansion', 'Team Building', 'Public Speaking', 'Board Relations', 'Growth Hacking'],
    certifications: [
      { id: '1', name: 'Certified Scrum Product Owner', issuer: 'Scrum Alliance', date: '2015-05-01', expiryDate: '' },
      { id: '2', name: 'Executive Leadership Program', issuer: 'Harvard Business School', date: '2019-09-01', expiryDate: '' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Hindi', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Elon Musk', title: 'CEO', company: 'SpaceX', email: 'elon@spacex.com', phone: '+1 (555) 999-8888' },
      { id: '2', name: 'Susan Lee', title: 'Partner', company: 'VC Partners', email: 'susan.lee@vcpartners.com', phone: '+1 (555) 777-6666' }
    ],
    isSampleDatabase: false
  },
  'executive-premium': {
    personalInfo: {
      fullName: 'Michael Grant',
      email: 'michael.grant@executive.com',
      phone: '+1 (555) 222-3333',
      location: 'Chicago, IL',
      linkedIn: 'https://linkedin.com/in/michael-grant',
      website: 'https://michaelgrant.com',
      summary: 'Executive leader with 18+ years in finance and operations, specializing in scaling global businesses and driving profitability.'
    },
    experience: [
      {
        id: '1',
        company: 'FinServe Global',
        position: 'Chief Financial Officer',
        location: 'Chicago, IL',
        startDate: '2016-01-01',
        endDate: '',
        current: true,
        description: 'Oversaw financial strategy for a $5B multinational. Led IPO and M&A activities, increasing shareholder value by 60%.'
      },
      {
        id: '2',
        company: 'RetailTech Inc.',
        position: 'VP of Operations',
        location: 'New York, NY',
        startDate: '2010-05-01',
        endDate: '2015-12-31',
        current: false,
        description: 'Implemented operational improvements, reducing costs by $20M annually.'
      },
      {
        id: '3',
        company: 'Consulting Partners',
        position: 'Senior Consultant',
        location: 'Boston, MA',
        startDate: '2005-06-01',
        endDate: '2010-04-30',
        current: false,
        description: 'Advised Fortune 500 clients on financial restructuring and growth strategies.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'University of Chicago Booth School of Business',
        degree: 'MBA',
        field: 'Finance',
        startDate: '2002-09-01',
        endDate: '2004-06-15',
        gpa: '3.8'
      },
      {
        id: '2',
        institution: 'Northwestern University',
        degree: 'BS Economics',
        field: 'Economics',
        startDate: '1998-09-01',
        endDate: '2002-06-15',
        gpa: '3.7'
      }
    ],
    skills: ['Financial Strategy', 'IPO', 'M&A', 'Operational Excellence', 'Risk Management', 'Leadership', 'Global Expansion', 'Cost Reduction'],
    certifications: [
      { id: '1', name: 'Chartered Financial Analyst (CFA)', issuer: 'CFA Institute', date: '2008-06-01', expiryDate: '' },
      { id: '2', name: 'Six Sigma Black Belt', issuer: 'ASQ', date: '2012-09-01', expiryDate: '' }
    ],
    projects: [
      { id: '1', name: 'IPO Launch', description: 'Led successful IPO for FinServe Global.', technologies: 'Finance, Legal, Compliance', url: 'https://michaelgrant.com/projects/ipo' },
      { id: '2', name: 'Cost Optimization', description: 'Reduced operational costs by $20M.', technologies: 'Operations, Analytics', url: 'https://michaelgrant.com/projects/cost' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'German', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Linda Brown', title: 'CEO', company: 'FinServe Global', email: 'linda.brown@finserve.com', phone: '+1 (555) 444-5555' },
      { id: '2', name: 'James Smith', title: 'Partner', company: 'Consulting Partners', email: 'james.smith@consulting.com', phone: '+1 (555) 666-7777' }
    ],
    isSampleDatabase: false
  },
  'creative-designer': {
    personalInfo: {
      fullName: 'Lena Kim',
      email: 'lena.kim@creativedesigner.com',
      phone: '+1 (555) 333-4444',
      location: 'Los Angeles, CA',
      linkedIn: 'https://linkedin.com/in/lena-kim',
      website: 'https://lenakim.com',
      summary: 'Award-winning creative director with 12+ years in branding, UX/UI, and digital product design. Led creative teams for global brands and startups.'
    },
    experience: [
      {
        id: '1',
        company: 'BrandLab',
        position: 'Creative Director',
        location: 'Los Angeles, CA',
        startDate: '2016-02-01',
        endDate: '',
        current: true,
        description: 'Directed creative vision for 50+ global campaigns. Won 8 industry awards for design excellence.'
      },
      {
        id: '2',
        company: 'UX Studio',
        position: 'Lead UX Designer',
        location: 'San Francisco, CA',
        startDate: '2012-06-01',
        endDate: '2016-01-31',
        current: false,
        description: 'Designed digital products for Fortune 500 clients, increasing user engagement by 200%.'
      },
      {
        id: '3',
        company: 'Freelance',
        position: 'Designer',
        location: 'Remote',
        startDate: '2009-01-01',
        endDate: '2012-05-31',
        current: false,
        description: 'Delivered branding and web design for 30+ startups.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Rhode Island School of Design',
        degree: 'MFA Graphic Design',
        field: 'Graphic Design',
        startDate: '2007-09-01',
        endDate: '2009-06-15',
        gpa: '3.9'
      },
      {
        id: '2',
        institution: 'UCLA',
        degree: 'BA Design Media Arts',
        field: 'Design',
        startDate: '2003-09-01',
        endDate: '2007-06-15',
        gpa: '3.8'
      }
    ],
    skills: ['Branding', 'UX/UI', 'Art Direction', 'Team Leadership', 'Adobe Creative Suite', 'Figma', 'Prototyping', 'User Research'],
    certifications: [
      { id: '1', name: 'Certified UX Professional', issuer: 'Nielsen Norman Group', date: '2015-04-01', expiryDate: '' },
      { id: '2', name: 'Adobe Certified Expert', issuer: 'Adobe', date: '2013-09-01', expiryDate: '' }
    ],
    projects: [
      { id: '1', name: 'Brand Redesign', description: 'Led rebranding for a Fortune 100 company.', technologies: 'Branding, Design', url: 'https://lenakim.com/projects/brand' },
      { id: '2', name: 'Mobile App UX', description: 'Designed award-winning mobile app.', technologies: 'UX, Mobile', url: 'https://lenakim.com/projects/app' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Korean', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Alex Chen', title: 'CEO', company: 'BrandLab', email: 'alex.chen@brandlab.com', phone: '+1 (555) 555-6666' },
      { id: '2', name: 'Maria Lopez', title: 'Creative Lead', company: 'UX Studio', email: 'maria.lopez@uxstudio.com', phone: '+1 (555) 777-8888' }
    ],
    isSampleDatabase: false
  },
  'consultant-elite': {
    personalInfo: {
      fullName: 'Sophie Laurent',
      email: 'sophie.laurent@consultantelite.com',
      phone: '+33 1 23 45 67 89',
      location: 'Paris, France',
      linkedIn: 'https://linkedin.com/in/sophie-laurent',
      website: 'https://sophielaurent.com',
      summary: 'Elite management consultant with 15+ years advising Fortune 500 companies on strategy, transformation, and M&A.'
    },
    experience: [
      {
        id: '1',
        company: 'McKinsey & Company',
        position: 'Partner',
        location: 'Paris, France',
        startDate: '2014-01-01',
        endDate: '',
        current: true,
        description: 'Led global strategy projects for top-tier clients. Managed teams of 20+ consultants.'
      },
      {
        id: '2',
        company: 'BCG',
        position: 'Principal',
        location: 'London, UK',
        startDate: '2008-06-01',
        endDate: '2013-12-31',
        current: false,
        description: 'Drove digital transformation and M&A integration for multinational clients.'
      },
      {
        id: '3',
        company: 'Accenture',
        position: 'Consultant',
        location: 'New York, NY',
        startDate: '2005-09-01',
        endDate: '2008-05-31',
        current: false,
        description: 'Delivered operational improvement projects for Fortune 100 companies.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'HEC Paris',
        degree: 'MBA',
        field: 'Business Administration',
        startDate: '2003-09-01',
        endDate: '2005-06-15',
        gpa: '3.9'
      },
      {
        id: '2',
        institution: 'Sciences Po',
        degree: 'BA Political Science',
        field: 'Political Science',
        startDate: '2000-09-01',
        endDate: '2003-06-15',
        gpa: '3.8'
      }
    ],
    skills: ['Strategy', 'M&A', 'Digital Transformation', 'Leadership', 'Change Management', 'Client Relations', 'Analytics'],
    certifications: [
      { id: '1', name: 'Certified Management Consultant', issuer: 'ICMCI', date: '2010-04-01', expiryDate: '' },
      { id: '2', name: 'Six Sigma Black Belt', issuer: 'ASQ', date: '2012-09-01', expiryDate: '' }
    ],
    projects: [
      { id: '1', name: 'Global Strategy Rollout', description: 'Implemented global strategy for a Fortune 100 company.', technologies: 'Strategy, Analytics', url: 'https://sophielaurent.com/projects/strategy' },
      { id: '2', name: 'M&A Integration', description: 'Integrated two multinational companies post-merger.', technologies: 'M&A, Integration', url: 'https://sophielaurent.com/projects/ma' }
    ],
    languages: [
      { id: '1', language: 'French', proficiency: 'Native' },
      { id: '2', language: 'English', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Jean Dupont', title: 'CEO', company: 'Global Corp', email: 'jean.dupont@global.com', phone: '+33 1 23 45 67 00' },
      { id: '2', name: 'Emily Clark', title: 'Partner', company: 'BCG', email: 'emily.clark@bcg.com', phone: '+44 20 1234 5678' }
    ],
    isSampleDatabase: false
  },
  'research-scientist': {
    personalInfo: {
      fullName: 'Dr. Emily Zhang',
      email: 'emily.zhang@researchlab.com',
      phone: '+1 (555) 555-8888',
      location: 'Boston, MA',
      linkedIn: 'https://linkedin.com/in/emily-zhang',
      website: 'https://emilyzhang.com',
      summary: 'Senior research scientist with 15+ years in biomedical research, published in Nature and Science, and leader of multi-institutional projects.'
    },
    experience: [
      {
        id: '1',
        company: 'Harvard Medical School',
        position: 'Principal Investigator',
        location: 'Boston, MA',
        startDate: '2015-01-01',
        endDate: '',
        current: true,
        description: 'Led NIH-funded research on cancer genomics. Managed a team of 12 scientists.'
      },
      {
        id: '2',
        company: 'MIT',
        position: 'Research Scientist',
        location: 'Cambridge, MA',
        startDate: '2010-06-01',
        endDate: '2014-12-31',
        current: false,
        description: 'Developed novel CRISPR-based gene editing techniques.'
      },
      {
        id: '3',
        company: 'Genentech',
        position: 'Postdoctoral Fellow',
        location: 'San Francisco, CA',
        startDate: '2007-09-01',
        endDate: '2010-05-31',
        current: false,
        description: 'Published 8 papers on protein engineering and drug discovery.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Stanford University',
        degree: 'PhD Bioengineering',
        field: 'Bioengineering',
        startDate: '2003-09-01',
        endDate: '2007-06-15',
        gpa: '4.0'
      },
      {
        id: '2',
        institution: 'Tsinghua University',
        degree: 'BS Biology',
        field: 'Biology',
        startDate: '1999-09-01',
        endDate: '2003-06-15',
        gpa: '3.9'
      }
    ],
    skills: ['Genomics', 'CRISPR', 'Bioinformatics', 'Project Leadership', 'Scientific Writing', 'Grant Management', 'Team Management'],
    certifications: [
      { id: '1', name: 'NIH Grant PI', issuer: 'NIH', date: '2016-01-01', expiryDate: '' },
      { id: '2', name: 'Certified Project Manager', issuer: 'PMI', date: '2018-09-01', expiryDate: '' }
    ],
    projects: [
      { id: '1', name: 'Cancer Genomics Initiative', description: 'Led multi-institutional cancer genomics project.', technologies: 'Genomics, Bioinformatics', url: 'https://emilyzhang.com/projects/cancer' },
      { id: '2', name: 'CRISPR Gene Editing', description: 'Developed new CRISPR techniques.', technologies: 'CRISPR, Gene Editing', url: 'https://emilyzhang.com/projects/crispr' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'Mandarin', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Dr. Alan Turing', title: 'Director', company: 'Harvard Medical School', email: 'alan.turing@harvard.edu', phone: '+1 (555) 111-2222' },
      { id: '2', name: 'Dr. Grace Hopper', title: 'Lab Head', company: 'MIT', email: 'grace.hopper@mit.edu', phone: '+1 (555) 333-4444' }
    ],
    isSampleDatabase: false
  },
  'harvard-elite': {
    personalInfo: {
      fullName: 'Dr. William Carter',
      email: 'william.carter@harvard.edu',
      phone: '+1 (555) 111-2222',
      location: 'Cambridge, MA',
      linkedIn: 'https://linkedin.com/in/william-carter',
      website: 'https://williamcarter.com',
      summary: 'Elite academic leader with 25+ years in higher education, published author, and former dean at top universities.'
    },
    experience: [
      {
        id: '1',
        company: 'Harvard University',
        position: 'Dean of Faculty',
        location: 'Cambridge, MA',
        startDate: '2010-01-01',
        endDate: '',
        current: true,
        description: 'Oversaw academic programs and faculty development for 2,000+ staff.'
      },
      {
        id: '2',
        company: 'Yale University',
        position: 'Professor of History',
        location: 'New Haven, CT',
        startDate: '2000-09-01',
        endDate: '2009-12-31',
        current: false,
        description: 'Taught graduate and undergraduate courses, published 5 books.'
      },
      {
        id: '3',
        company: 'Oxford University',
        position: 'Visiting Scholar',
        location: 'Oxford, UK',
        startDate: '1995-09-01',
        endDate: '2000-08-31',
        current: false,
        description: 'Conducted research in European history and mentored PhD students.'
      }
    ],
    education: [
      {
        id: '1',
        institution: 'Harvard University',
        degree: 'PhD History',
        field: 'History',
        startDate: '1988-09-01',
        endDate: '1994-06-15',
        gpa: '4.0'
      },
      {
        id: '2',
        institution: 'Princeton University',
        degree: 'BA History',
        field: 'History',
        startDate: '1984-09-01',
        endDate: '1988-06-15',
        gpa: '3.9'
      }
    ],
    skills: ['Academic Leadership', 'Research', 'Teaching', 'Publishing', 'Faculty Development', 'Grant Writing', 'Public Speaking'],
    certifications: [
      { id: '1', name: 'Fulbright Scholar', issuer: 'US State Department', date: '2005-01-01', expiryDate: '' },
      { id: '2', name: 'Certified Academic Leader', issuer: 'AACU', date: '2012-09-01', expiryDate: '' }
    ],
    projects: [
      { id: '1', name: 'Faculty Development Initiative', description: 'Launched faculty mentoring and development program.', technologies: 'Education, Leadership', url: 'https://williamcarter.com/projects/faculty' },
      { id: '2', name: 'History Textbook Series', description: 'Authored a 3-volume history textbook.', technologies: 'Publishing, Research', url: 'https://williamcarter.com/projects/textbook' }
    ],
    languages: [
      { id: '1', language: 'English', proficiency: 'Native' },
      { id: '2', language: 'French', proficiency: 'Professional' }
    ],
    references: [
      { id: '1', name: 'Dr. Susan Lee', title: 'Provost', company: 'Harvard University', email: 'susan.lee@harvard.edu', phone: '+1 (555) 333-4444' },
      { id: '2', name: 'Dr. John Smith', title: 'Dean', company: 'Yale University', email: 'john.smith@yale.edu', phone: '+1 (555) 555-6666' }
    ],
    isSampleDatabase: false
  }
};

export const getTemplateNames = (): Record<string, string> => ({
  'basic-modern': 'Basic Modern',
  'professional-clean': 'Professional Clean',
  'creative-modern': 'Creative Modern',
  'executive-formal': 'Executive Formal',
  'minimalist-clean': 'Minimalist Clean',
  'minimal-clean': 'Minimal Clean',
  'professional-simple': 'Professional Simple',
  'classic-elegant': 'Classic Elegant',
  'modern-minimal': 'Modern Minimal',
  'harvard-classic': 'Harvard Classic',
  'modern-professional': 'Modern Professional',
  'creative-clean': 'Creative Clean',
  'attractive-cv': 'Attractive CV'
});

export const getSampleDataForTemplate = (templateId: string): CVData => {
  // If we have specific sample data for this template, use it
  if (sampleCVData[templateId]) {
    return sampleCVData[templateId];
  }
  
  // Otherwise, use a default template based on the category
  const template = cvTemplates.find(t => t.id === templateId);
  if (template) {
    switch (template.category) {
      case 'professional':
      case 'executive':
        return sampleCVData['professional-clean'];
      case 'creative':
        return sampleCVData['creative-modern'];
      case 'minimal':
      case 'minimalist':
        return sampleCVData['minimalist'];
      case 'academic':
        return sampleCVData['executive-formal'];
      default:
        return sampleCVData['basic-modern'];
    }
  }
  
  // Fallback to basic modern
  return sampleCVData['basic-modern'];
};

export const getSampleDatabase = (): CVData[] =>
  Object.values(sampleCVData).map(cv => ({ ...cv, isSampleDatabase: true })); 