import { CVData } from '@/lib/supabase';

export interface SampleCVData {
  [templateId: string]: Partial<CVData>;
}

export const sampleCVData: SampleCVData = {
  'basic-modern': {
    title: 'Sarah Johnson - Senior Software Engineer',
    content: {
      full_name: 'Sarah Johnson',
      job_title: 'Senior Software Engineer',
      email: 'sarah.johnson@email.com',
      phone: '+1 (555) 123-4567',
      location: 'San Francisco, CA',
      linkedin_url: 'https://linkedin.com/in/sarah-johnson-dev',
      portfolio_url: 'https://sarah-johnson.dev',
      summary: 'Experienced software engineer with 6+ years developing scalable web applications. Passionate about clean code, user experience, and mentoring junior developers. Led multiple cross-functional teams to deliver high-impact products serving millions of users.',
      experiences: [
        {
          company: 'TechCorp Inc.',
          role: 'Senior Software Engineer',
          duration: 'Jan 2022 - Present',
          description: 'Lead development of customer-facing web applications using React, Node.js, and AWS. Mentored 3 junior developers and improved team productivity by 40% through code reviews and best practices implementation. Architected microservices handling 10M+ daily requests.'
        },
        {
          company: 'StartupXYZ',
          role: 'Full Stack Developer',
          duration: 'Mar 2020 - Dec 2021',
          description: 'Built and maintained e-commerce platform from scratch using MERN stack. Implemented payment processing, inventory management, and analytics dashboard. Reduced page load times by 60% through performance optimization.'
        },
        {
          company: 'Digital Solutions Ltd.',
          role: 'Frontend Developer',
          duration: 'Jun 2018 - Feb 2020',
          description: 'Developed responsive web applications using React, TypeScript, and Redux. Collaborated with UX designers to create intuitive user interfaces. Implemented automated testing reducing bugs by 35%.'
        }
      ],
      education: [
        {
          institution: 'University of California, Berkeley',
          degree: 'Bachelor of Science in Computer Science',
          year: '2018',
          gpa: '3.8'
        }
      ],
      projects: [
        {
          name: 'AI-Powered Task Manager',
          description: 'Built a productivity app using React, Node.js, and OpenAI API that intelligently categorizes and prioritizes tasks. Implemented real-time collaboration features and achieved 95% user satisfaction rating.',
          technologies: 'React, Node.js, MongoDB, OpenAI API, Socket.io',
          url: 'https://github.com/sarah-johnson/ai-task-manager'
        },
        {
          name: 'E-commerce Analytics Dashboard',
          description: 'Created comprehensive analytics dashboard for online retailers using D3.js and Python. Processes 1M+ transactions daily and provides actionable insights that increased client revenue by 25%.',
          technologies: 'React, D3.js, Python, PostgreSQL, AWS',
          url: 'https://github.com/sarah-johnson/ecommerce-analytics'
        }
      ],
      skills: 'JavaScript, TypeScript, React, Node.js, Python, AWS, Docker, PostgreSQL, MongoDB, Git, Agile, Scrum, Team Leadership, Code Review, System Design',
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Intermediate' },
        { language: 'French', proficiency: 'Basic' }
      ],
      certifications: 'AWS Certified Solutions Architect, Google Cloud Professional Developer, Certified Scrum Master (CSM)',
      references: [
        {
          name: 'Michael Chen',
          title: 'Engineering Manager',
          company: 'TechCorp Inc.',
          email: 'michael.chen@techcorp.com',
          phone: '+1 (555) 987-6543'
        },
        {
          name: 'Emily Rodriguez',
          title: 'Product Manager',
          company: 'StartupXYZ',
          email: 'emily.rodriguez@startupxyz.com',
          phone: '+1 (555) 456-7890'
        }
      ]
    },
    is_public: false
  },

  'professional-clean': {
    title: 'David Martinez - Marketing Director',
    content: {
      full_name: 'David Martinez',
      job_title: 'Marketing Director',
      email: 'david.martinez@email.com',
      phone: '+1 (555) 234-5678',
      location: 'New York, NY',
      linkedin_url: 'https://linkedin.com/in/david-martinez-marketing',
      portfolio_url: 'https://davidmartinez.marketing',
      summary: 'Strategic marketing leader with 8+ years driving brand growth and customer acquisition. Proven track record of increasing revenue by 150% through data-driven campaigns and innovative digital strategies. Expert in building high-performing teams and cross-functional partnerships.',
      experiences: [
        {
          company: 'Global Brands Inc.',
          role: 'Marketing Director',
          duration: 'Mar 2021 - Present',
          description: 'Lead marketing strategy for $50M+ revenue division. Launched 15+ successful campaigns resulting in 200% increase in qualified leads. Manage team of 8 marketing professionals and $2M annual budget. Implemented marketing automation reducing cost per acquisition by 45%.'
        },
        {
          company: 'Innovation Media',
          role: 'Senior Marketing Manager',
          duration: 'Jan 2019 - Feb 2021',
          description: 'Developed and executed integrated marketing campaigns across digital and traditional channels. Increased brand awareness by 80% and customer retention by 35%. Led rebranding initiative that improved brand perception scores by 60%.'
        },
        {
          company: 'Creative Agency Pro',
          role: 'Digital Marketing Specialist',
          duration: 'Aug 2016 - Dec 2018',
          description: 'Managed social media strategy and content marketing for 20+ clients. Increased average engagement rates by 120% and generated $1M+ in attributed revenue. Specialized in B2B lead generation and conversion optimization.'
        }
      ],
      education: [
        {
          institution: 'Northwestern University',
          degree: 'MBA in Marketing',
          year: '2016',
          gpa: '3.9'
        },
        {
          institution: 'University of Texas at Austin',
          degree: 'Bachelor of Business Administration',
          year: '2014',
          gpa: '3.7'
        }
      ],
      projects: [
        {
          name: 'B2B Lead Generation Platform',
          description: 'Developed comprehensive lead scoring and nurturing system that increased conversion rates by 300%. Integrated with CRM and marketing automation tools to create seamless customer journey.',
          technologies: 'HubSpot, Salesforce, Google Analytics, Zapier',
          url: 'https://case-study.davidmartinez.marketing/b2b-leads'
        }
      ],
      skills: 'Digital Marketing, Brand Strategy, Content Marketing, Social Media Marketing, Marketing Automation, Google Analytics, HubSpot, Salesforce, A/B Testing, SEO/SEM, Team Leadership, Budget Management, Data Analysis',
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Fluent' }
      ],
      certifications: 'Google Analytics Certified, HubSpot Content Marketing Certification, Facebook Blueprint Certified, Salesforce Marketing Cloud Specialist',
      references: [
        {
          name: 'Jennifer Walsh',
          title: 'VP of Marketing',
          company: 'Global Brands Inc.',
          email: 'jennifer.walsh@globalbrands.com',
          phone: '+1 (555) 876-5432'
        }
      ]
    },
    is_public: false
  },

  'creative-modern': {
    title: 'Alex Rivera - Creative Director & UX Designer',
    content: {
      full_name: 'Alex Rivera',
      job_title: 'Creative Director & UX Designer',
      email: 'alex.rivera@email.com',
      phone: '+1 (555) 345-6789',
      location: 'Los Angeles, CA',
      linkedin_url: 'https://linkedin.com/in/alex-rivera-design',
      portfolio_url: 'https://alexrivera.design',
      summary: 'Award-winning creative director with 7+ years crafting compelling brand experiences and user-centered designs. Led creative teams for Fortune 500 companies, increasing user engagement by 180% through innovative design solutions. Passionate about bridging the gap between creativity and technology.',
      experiences: [
        {
          company: 'Design Studio Pro',
          role: 'Creative Director',
          duration: 'Feb 2022 - Present',
          description: 'Direct creative vision for 25+ client projects annually. Lead multidisciplinary team of 12 designers, developers, and strategists. Increased client retention by 90% through exceptional creative execution and strategic thinking. Won 5 industry awards for campaign excellence.'
        },
        {
          company: 'Tech Innovators Inc.',
          role: 'Senior UX Designer',
          duration: 'May 2020 - Jan 2022',
          description: 'Redesigned core product interface serving 2M+ users, resulting in 40% increase in user satisfaction and 25% reduction in support tickets. Established design system and conducted user research to inform product decisions. Mentored junior designers and led design sprints.'
        },
        {
          company: 'Creative Collective',
          role: 'Visual Designer',
          duration: 'Sep 2017 - Apr 2020',
          description: 'Created visual identities and marketing materials for startups and established brands. Developed brand guidelines and design systems ensuring consistency across all touchpoints. Collaborated with developers to ensure pixel-perfect implementation.'
        }
      ],
      education: [
        {
          institution: 'Art Center College of Design',
          degree: 'Bachelor of Fine Arts in Graphic Design',
          year: '2017',
          gpa: '3.8'
        }
      ],
      projects: [
        {
          name: 'Sustainable Fashion App',
          description: 'Designed complete user experience for eco-friendly fashion marketplace. Conducted user research, created wireframes, prototypes, and final designs. App achieved 4.8-star rating and 100K+ downloads in first month.',
          technologies: 'Figma, Adobe Creative Suite, Principle, InVision',
          url: 'https://behance.net/gallery/sustainable-fashion-app'
        },
        {
          name: 'Brand Identity for Tech Startup',
          description: 'Created comprehensive brand identity including logo, color palette, typography, and brand guidelines. Designed marketing materials and website that helped secure $2M in Series A funding.',
          technologies: 'Adobe Illustrator, Photoshop, InDesign, Figma',
          url: 'https://alexrivera.design/projects/tech-startup-brand'
        }
      ],
      skills: 'UX/UI Design, Brand Identity, Creative Direction, Design Systems, User Research, Prototyping, Adobe Creative Suite, Figma, Sketch, InVision, Design Thinking, Team Leadership, Client Communication',
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'Spanish', proficiency: 'Fluent' },
        { language: 'Portuguese', proficiency: 'Intermediate' }
      ],
      certifications: 'Google UX Design Professional Certificate, Adobe Certified Expert (ACE), Nielsen Norman Group UX Certification',
      references: [
        {
          name: 'Sarah Kim',
          title: 'Creative Director',
          company: 'Design Studio Pro',
          email: 'sarah.kim@designstudiopro.com',
          phone: '+1 (555) 765-4321'
        },
        {
          name: 'Marcus Johnson',
          title: 'VP of Product',
          company: 'Tech Innovators Inc.',
          email: 'marcus.johnson@techinnovators.com',
          phone: '+1 (555) 654-3210'
        }
      ]
    },
    is_public: false
  },

  'executive-formal': {
    title: 'Robert Thompson - Chief Technology Officer',
    content: {
      full_name: 'Robert Thompson',
      job_title: 'Chief Technology Officer',
      email: 'robert.thompson@email.com',
      phone: '+1 (555) 456-7890',
      location: 'Seattle, WA',
      linkedin_url: 'https://linkedin.com/in/robert-thompson-cto',
      portfolio_url: 'https://robertthompson.tech',
      summary: 'Visionary technology leader with 15+ years driving digital transformation and innovation at Fortune 500 companies. Led technology strategy for $2B+ revenue organizations, reducing operational costs by 40% while improving system reliability to 99.9%. Expert in scaling engineering teams and implementing cutting-edge technologies.',
      experiences: [
        {
          company: 'Global Tech Solutions',
          role: 'Chief Technology Officer',
          duration: 'Jan 2020 - Present',
          description: 'Lead technology strategy for $2B+ revenue company with 2000+ employees. Architected cloud migration reducing infrastructure costs by 60% and improving system performance by 300%. Built and scaled engineering team from 50 to 200+ developers. Implemented AI/ML initiatives generating $50M+ in additional revenue.'
        },
        {
          company: 'Innovation Corp',
          role: 'VP of Engineering',
          duration: 'Mar 2017 - Dec 2019',
          description: 'Led engineering organization of 150+ developers across 8 product teams. Implemented agile methodologies improving delivery speed by 200%. Established technical excellence programs reducing production incidents by 80%. Mentored 20+ engineering managers and technical leads.'
        },
        {
          company: 'Tech Leaders Inc.',
          role: 'Senior Engineering Manager',
          duration: 'Jun 2014 - Feb 2017',
          description: 'Managed multiple engineering teams delivering mission-critical applications. Led successful migration from monolithic to microservices architecture. Implemented CI/CD pipelines reducing deployment time from weeks to hours. Established coding standards and review processes.'
        }
      ],
      education: [
        {
          institution: 'Stanford University',
          degree: 'Master of Science in Computer Science',
          year: '2014',
          gpa: '3.9'
        },
        {
          institution: 'University of Washington',
          degree: 'Bachelor of Science in Computer Engineering',
          year: '2012',
          gpa: '3.8'
        }
      ],
      projects: [
        {
          name: 'Enterprise AI Platform',
          description: 'Architected and led development of enterprise AI platform processing 1B+ data points daily. Platform serves 100+ enterprise clients and generates $25M+ annual revenue. Implemented advanced machine learning algorithms for predictive analytics.',
          technologies: 'Python, TensorFlow, Kubernetes, AWS, Apache Kafka, PostgreSQL',
          url: 'https://github.com/robert-thompson/enterprise-ai-platform'
        },
        {
          name: 'Cloud Migration Strategy',
          description: 'Designed and executed comprehensive cloud migration strategy for legacy enterprise systems. Migrated 500+ applications to AWS, reducing infrastructure costs by 60% and improving system reliability to 99.9%.',
          technologies: 'AWS, Terraform, Docker, Kubernetes, Jenkins, Prometheus',
          url: 'https://case-study.robertthompson.tech/cloud-migration'
        }
      ],
      skills: 'Technology Strategy, Engineering Leadership, Cloud Architecture, AI/ML, System Design, Team Building, Budget Management, Vendor Management, Digital Transformation, Agile/Scrum, DevOps, Security, Compliance',
      languages: [
        { language: 'English', proficiency: 'Native' },
        { language: 'German', proficiency: 'Intermediate' }
      ],
      certifications: 'AWS Solutions Architect Professional, Google Cloud Professional Cloud Architect, Certified Scrum Master (CSM), PMP Certification',
      references: [
        {
          name: 'Jennifer Chen',
          title: 'CEO',
          company: 'Global Tech Solutions',
          email: 'jennifer.chen@globaltech.com',
          phone: '+1 (555) 543-2109'
        },
        {
          name: 'Michael Rodriguez',
          title: 'Board Member',
          company: 'Innovation Corp',
          email: 'michael.rodriguez@innovationcorp.com',
          phone: '+1 (555) 432-1098'
        }
      ]
    },
    is_public: false
  }
};

export const getTemplateNames = (): Record<string, string> => ({
  'basic-modern': 'Basic Modern',
  'professional-clean': 'Professional Clean',
  'creative-modern': 'Creative Modern',
  'executive-formal': 'Executive Formal'
});

export const getSampleDataForTemplate = (templateId: string): Partial<CVData> => {
  return sampleCVData[templateId] || sampleCVData['basic-modern'];
}; 