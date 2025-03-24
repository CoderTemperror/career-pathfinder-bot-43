
export interface College {
  id: string;
  name: string;
  location: string;
  country: string;
  ranking: string;
  website: string;
  programs: string[];
}

export interface QualifyingExam {
  id: string;
  name: string;
  description: string;
  website: string;
  level: 'National' | 'International';
}

export interface CareerSkill {
  id: string;
  name: string;
  category: 'Technical' | 'Soft' | 'Domain';
  importance: 'Essential' | 'Important' | 'Nice to have';
}

export interface JobProfile {
  title: string;
  description: string;
  salaryRange: {
    india: string;
    usa: string;
    europe: string;
    others: string;
  };
  growthOutlook: string;
}

export interface CareerOption {
  id: string;
  title: string;
  stream: 'Science' | 'Commerce' | 'Arts' | 'Multiple';
  description: string;
  educationPath: string[];
  topColleges: College[];
  qualifyingExams: QualifyingExam[];
  requiredSkills: CareerSkill[];
  jobProfiles: JobProfile[];
  advantages: string[];
  disadvantages: string[];
  futureScope: string;
  resources: {
    title: string;
    url: string;
    type: 'Course' | 'Article' | 'Community' | 'Tool';
  }[];
}

export const careerOptions: CareerOption[] = [
  {
    id: 'computer-science',
    title: 'Computer Science & IT',
    stream: 'Science',
    description: 'Computer Science is the study of computers and computational systems, including their theory, design, development, and application.',
    educationPath: [
      'Bachelor\'s degree in Computer Science, IT, or related field (4 years)',
      'Optional: Master\'s degree in specialized area like AI, Cybersecurity (2 years)',
      'Optional: PhD for research positions (3-5 years)'
    ],
    topColleges: [
      {
        id: 'iit-delhi',
        name: 'Indian Institute of Technology Delhi',
        location: 'New Delhi',
        country: 'India',
        ranking: 'Top in India',
        website: 'https://www.iitd.ac.in/',
        programs: ['B.Tech', 'M.Tech', 'PhD']
      },
      {
        id: 'iit-bombay',
        name: 'Indian Institute of Technology Bombay',
        location: 'Mumbai',
        country: 'India',
        ranking: 'Top in India',
        website: 'https://www.iitb.ac.in/',
        programs: ['B.Tech', 'M.Tech', 'PhD']
      },
      {
        id: 'stanford',
        name: 'Stanford University',
        location: 'California',
        country: 'USA',
        ranking: 'Top 5 Worldwide',
        website: 'https://www.stanford.edu/',
        programs: ['BS', 'MS', 'PhD']
      },
      {
        id: 'mit',
        name: 'Massachusetts Institute of Technology',
        location: 'Massachusetts',
        country: 'USA',
        ranking: 'Top 5 Worldwide',
        website: 'https://www.mit.edu/',
        programs: ['BS', 'MS', 'PhD']
      }
    ],
    qualifyingExams: [
      {
        id: 'jee-main',
        name: 'JEE Main',
        description: 'National level entrance exam for admission to engineering programs in NITs, IIITs and other CFTIs',
        website: 'https://jeemain.nta.nic.in/',
        level: 'National'
      },
      {
        id: 'jee-advanced',
        name: 'JEE Advanced',
        description: 'Entrance exam for admission to Indian Institutes of Technology (IITs)',
        website: 'https://jeeadv.ac.in/',
        level: 'National'
      },
      {
        id: 'gate',
        name: 'GATE (Graduate Aptitude Test in Engineering)',
        description: 'Examination for admission to postgraduate programs in engineering',
        website: 'https://gate.iitd.ac.in/',
        level: 'National'
      },
      {
        id: 'gre',
        name: 'GRE (Graduate Record Examination)',
        description: 'Standardized test for admission to graduate schools worldwide',
        website: 'https://www.ets.org/gre',
        level: 'International'
      }
    ],
    requiredSkills: [
      {
        id: 'programming',
        name: 'Programming (Java, Python, C++)',
        category: 'Technical',
        importance: 'Essential'
      },
      {
        id: 'data-structures',
        name: 'Data Structures & Algorithms',
        category: 'Technical',
        importance: 'Essential'
      },
      {
        id: 'problem-solving',
        name: 'Problem Solving',
        category: 'Soft',
        importance: 'Essential'
      },
      {
        id: 'web-dev',
        name: 'Web Development',
        category: 'Technical',
        importance: 'Important'
      },
      {
        id: 'database',
        name: 'Database Management',
        category: 'Technical',
        importance: 'Important'
      }
    ],
    jobProfiles: [
      {
        title: 'Software Engineer',
        description: 'Develop, test, and maintain software applications',
        salaryRange: {
          india: '₹5-30 LPA',
          usa: '$70,000-$150,000',
          europe: '€45,000-€90,000',
          others: 'Varies by country'
        },
        growthOutlook: 'Excellent growth with 22% projected increase by 2030'
      },
      {
        title: 'Data Scientist',
        description: 'Analyze and interpret complex data to help organizations make better decisions',
        salaryRange: {
          india: '₹7-25 LPA',
          usa: '$90,000-$180,000',
          europe: '€50,000-€100,000',
          others: 'Varies by country'
        },
        growthOutlook: 'Very high growth potential with AI and big data expansion'
      },
      {
        title: 'Cybersecurity Specialist',
        description: 'Protect systems from cyber threats and implement security measures',
        salaryRange: {
          india: '₹8-30 LPA',
          usa: '$90,000-$160,000',
          europe: '€55,000-€95,000',
          others: 'Varies by country'
        },
        growthOutlook: 'Extremely high demand due to increasing cyber threats'
      }
    ],
    advantages: [
      'High demand across all industries globally',
      'Excellent salary potential and growth',
      'Flexibility to work remotely',
      'Continuous learning and innovation',
      'Many specialization options'
    ],
    disadvantages: [
      'Fast-paced field requiring continuous learning',
      'Can be stressful with tight deadlines',
      'Potential for work-life balance issues in some companies',
      'Risk of repetitive strain injuries from long computer use'
    ],
    futureScope: 'The future of computer science is extremely promising with emerging fields like artificial intelligence, machine learning, blockchain, and quantum computing. As technology continues to integrate with every industry, demand for skilled professionals will remain high.',
    resources: [
      {
        title: 'Coursera - Computer Science Courses',
        url: 'https://www.coursera.org/browse/computer-science',
        type: 'Course'
      },
      {
        title: 'Top Computer Science Programs',
        url: 'https://www.topuniversities.com/university-rankings/university-subject-rankings/2022/computer-science-information-systems',
        type: 'Article'
      },
      {
        title: 'Stack Overflow Community',
        url: 'https://stackoverflow.com/',
        type: 'Community'
      }
    ]
  },
  {
    id: 'medicine',
    title: 'Medicine & Healthcare',
    stream: 'Science',
    description: 'Medical careers involve diagnosing, treating, and preventing disease and injury through examination, testing, and providing preventive care.',
    educationPath: [
      'MBBS/MD (5.5 years including internship)',
      'Specialization through residency (3-6 years)',
      'Super-specialization (2-3 years, optional)'
    ],
    topColleges: [
      {
        id: 'aiims',
        name: 'All India Institute of Medical Sciences (AIIMS)',
        location: 'New Delhi',
        country: 'India',
        ranking: 'Top in India',
        website: 'https://www.aiims.edu/',
        programs: ['MBBS', 'MD', 'MS', 'DM', 'MCh']
      },
      {
        id: 'cmc-vellore',
        name: 'Christian Medical College',
        location: 'Vellore',
        country: 'India',
        ranking: 'Top in India',
        website: 'https://www.cmch-vellore.edu/',
        programs: ['MBBS', 'MD', 'MS']
      },
      {
        id: 'harvard-medical',
        name: 'Harvard Medical School',
        location: 'Massachusetts',
        country: 'USA',
        ranking: 'Top 5 Worldwide',
        website: 'https://hms.harvard.edu/',
        programs: ['MD', 'PhD', 'MD-PhD']
      },
      {
        id: 'oxford-medical',
        name: 'Oxford University Medical School',
        location: 'Oxford',
        country: 'UK',
        ranking: 'Top 10 Worldwide',
        website: 'https://www.medsci.ox.ac.uk/',
        programs: ['MBBS', 'Graduate Entry Medicine']
      }
    ],
    qualifyingExams: [
      {
        id: 'neet-ug',
        name: 'NEET-UG',
        description: 'National Eligibility cum Entrance Test for undergraduate medical education in India',
        website: 'https://neet.nta.nic.in/',
        level: 'National'
      },
      {
        id: 'neet-pg',
        name: 'NEET-PG',
        description: 'Entrance examination for postgraduate medical courses in India',
        website: 'https://nbe.edu.in/',
        level: 'National'
      },
      {
        id: 'usmle',
        name: 'USMLE (United States Medical Licensing Examination)',
        description: 'Series of examinations for medical licensure in the United States',
        website: 'https://www.usmle.org/',
        level: 'International'
      },
      {
        id: 'mcat',
        name: 'MCAT (Medical College Admission Test)',
        description: 'Standardized examination for prospective medical students in the US and Canada',
        website: 'https://students-residents.aamc.org/mcat-registration',
        level: 'International'
      }
    ],
    requiredSkills: [
      {
        id: 'clinical-knowledge',
        name: 'Clinical Knowledge',
        category: 'Technical',
        importance: 'Essential'
      },
      {
        id: 'patient-care',
        name: 'Patient Care',
        category: 'Domain',
        importance: 'Essential'
      },
      {
        id: 'communication',
        name: 'Communication Skills',
        category: 'Soft',
        importance: 'Essential'
      },
      {
        id: 'critical-thinking',
        name: 'Critical Thinking',
        category: 'Soft',
        importance: 'Essential'
      },
      {
        id: 'empathy',
        name: 'Empathy',
        category: 'Soft',
        importance: 'Essential'
      }
    ],
    jobProfiles: [
      {
        title: 'General Physician',
        description: 'Diagnose and treat various health conditions and diseases',
        salaryRange: {
          india: '₹8-30 LPA',
          usa: '$170,000-$240,000',
          europe: '€60,000-€120,000',
          others: 'Varies by country'
        },
        growthOutlook: 'Stable demand with 3% growth by 2030'
      },
      {
        title: 'Surgeon',
        description: 'Perform operations to treat injuries, diseases, and deformities',
        salaryRange: {
          india: '₹15-60 LPA',
          usa: '$250,000-$500,000',
          europe: '€100,000-€200,000',
          others: 'Varies by country'
        },
        growthOutlook: 'Steady growth with continued demand for specialist surgeons'
      },
      {
        title: 'Psychiatrist',
        description: 'Diagnose, treat, and prevent mental, emotional, and behavioral disorders',
        salaryRange: {
          india: '₹10-40 LPA',
          usa: '$200,000-$300,000',
          europe: '€80,000-€150,000',
          others: 'Varies by country'
        },
        growthOutlook: 'Increasing demand with greater focus on mental health'
      }
    ],
    advantages: [
      'High social respect and prestige',
      'Job security and stability',
      'Opportunity to help people directly',
      'Intellectually stimulating work',
      'Good earning potential, especially in specialties'
    ],
    disadvantages: [
      'Long and expensive education path',
      'High stress levels and potential burnout',
      'Long working hours and emergency duties',
      'Exposure to infectious diseases',
      'Potential for medical malpractice suits'
    ],
    futureScope: 'The healthcare sector is expected to grow significantly with aging populations worldwide. New technologies like telemedicine, AI diagnostics, and personalized medicine are creating new opportunities. Specialties in geriatric care, preventive medicine, and mental health have especially strong prospects.',
    resources: [
      {
        title: 'MedSchool Insiders',
        url: 'https://medschoolinsiders.com/',
        type: 'Article'
      },
      {
        title: 'Coursera - Healthcare Courses',
        url: 'https://www.coursera.org/browse/health',
        type: 'Course'
      },
      {
        title: 'Student Doctor Network Forum',
        url: 'https://forums.studentdoctor.net/',
        type: 'Community'
      }
    ]
  },
  {
    id: 'business-management',
    title: 'Business & Management',
    stream: 'Commerce',
    description: 'Business and management careers focus on planning, organizing, directing, and controlling resources to achieve organizational goals efficiently and effectively.',
    educationPath: [
      'Bachelor\'s degree in Business Administration, Commerce, Economics (3-4 years)',
      'MBA or specialized Master\'s degree (1-2 years)',
      'Optional: Professional certifications (CFA, PMP, etc.)'
    ],
    topColleges: [
      {
        id: 'iim-ahmedabad',
        name: 'Indian Institute of Management Ahmedabad',
        location: 'Ahmedabad',
        country: 'India',
        ranking: 'Top in India',
        website: 'https://www.iima.ac.in/',
        programs: ['MBA', 'PGPX', 'PhD']
      },
      {
        id: 'iim-bangalore',
        name: 'Indian Institute of Management Bangalore',
        location: 'Bangalore',
        country: 'India',
        ranking: 'Top in India',
        website: 'https://www.iimb.ac.in/',
        programs: ['MBA', 'EPGP', 'PhD']
      },
      {
        id: 'harvard-business',
        name: 'Harvard Business School',
        location: 'Massachusetts',
        country: 'USA',
        ranking: 'Top 5 Worldwide',
        website: 'https://www.hbs.edu/',
        programs: ['MBA', 'Executive Education', 'PhD']
      },
      {
        id: 'lbs',
        name: 'London Business School',
        location: 'London',
        country: 'UK',
        ranking: 'Top 10 Worldwide',
        website: 'https://www.london.edu/',
        programs: ['MBA', 'Masters in Management', 'Executive MBA']
      }
    ],
    qualifyingExams: [
      {
        id: 'cat',
        name: 'CAT (Common Admission Test)',
        description: 'Entrance exam for admission to IIMs and other business schools in India',
        website: 'https://iimcat.ac.in/',
        level: 'National'
      },
      {
        id: 'gmat',
        name: 'GMAT (Graduate Management Admission Test)',
        description: 'Standardized test for admission to graduate business programs worldwide',
        website: 'https://www.mba.com/exams/gmat',
        level: 'International'
      },
      {
        id: 'xat',
        name: 'XAT (Xavier Aptitude Test)',
        description: 'Entrance exam for admission to XLRI and other business schools in India',
        website: 'https://www.xatonline.in/',
        level: 'National'
      },
      {
        id: 'cfa',
        name: 'CFA (Chartered Financial Analyst)',
        description: 'Professional credential for investment management professionals',
        website: 'https://www.cfainstitute.org/',
        level: 'International'
      }
    ],
    requiredSkills: [
      {
        id: 'leadership',
        name: 'Leadership',
        category: 'Soft',
        importance: 'Essential'
      },
      {
        id: 'strategic-thinking',
        name: 'Strategic Thinking',
        category: 'Soft',
        importance: 'Essential'
      },
      {
        id: 'financial-acumen',
        name: 'Financial Acumen',
        category: 'Technical',
        importance: 'Important'
      },
      {
        id: 'communication',
        name: 'Communication Skills',
        category: 'Soft',
        importance: 'Essential'
      },
      {
        id: 'problem-solving',
        name: 'Problem Solving',
        category: 'Soft',
        importance: 'Essential'
      }
    ],
    jobProfiles: [
      {
        title: 'Management Consultant',
        description: 'Help organizations improve performance through analysis and planning',
        salaryRange: {
          india: '₹12-30 LPA',
          usa: '$85,000-$170,000',
          europe: '€65,000-€120,000',
          others: 'Varies by country'
        },
        growthOutlook: 'Strong growth with 14% projected increase by 2030'
      },
      {
        title: 'Financial Analyst',
        description: 'Evaluate investment opportunities and provide financial guidance',
        salaryRange: {
          india: '₹6-20 LPA',
          usa: '$60,000-$120,000',
          europe: '€45,000-€90,000',
          others: 'Varies by country'
        },
        growthOutlook: 'Positive outlook with 6% growth by 2030'
      },
      {
        title: 'Marketing Manager',
        description: 'Develop marketing strategies to promote products and services',
        salaryRange: {
          india: '₹8-25 LPA',
          usa: '$70,000-$150,000',
          europe: '€50,000-€100,000',
          others: 'Varies by country'
        },
        growthOutlook: 'Steady growth with digital marketing creating new opportunities'
      }
    ],
    advantages: [
      'Versatile degree applicable across industries',
      'Good earning potential with career progression',
      'Opportunities for entrepreneurship',
      'Global career prospects',
      'Network building with industry professionals'
    ],
    disadvantages: [
      'Competitive job market, especially at top firms',
      'Often requires long working hours',
      'Can be stressful with high responsibility',
      'May require frequent travel',
      'Success often tied to economic conditions'
    ],
    futureScope: 'Business careers remain in demand across sectors. Growth areas include digital transformation, sustainable business practices, and global business management. Specialized knowledge in data analytics, e-commerce, and international business are particularly valuable.',
    resources: [
      {
        title: 'Harvard Business Review',
        url: 'https://hbr.org/',
        type: 'Article'
      },
      {
        title: 'Coursera - Business Courses',
        url: 'https://www.coursera.org/browse/business',
        type: 'Course'
      },
      {
        title: 'Wall Street Oasis',
        url: 'https://www.wallstreetoasis.com/',
        type: 'Community'
      }
    ]
  }
];
