
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Award, 
  Download, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Building, 
  Sparkles, 
  AlertCircle,
  CheckCircle,
  ClipboardCheck,
  GraduationCap,
  TrendingUp,
  Compass,
  BookOpen,
  Target
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import PathwayStep from '@/components/PathwayStep';
import CareerCard from '@/components/CareerCard';
import CareerExplorer from '@/components/CareerExplorer';
import { Career, CareerPathway, PathwayStep as PathwayStepType } from '@/types';
import { careerOptions } from '@/data/careerOptions';
import StorageService from '@/services/storage';

const mockCareers: Career[] = [
  {
    id: 'software-engineer',
    title: 'Software Engineer',
    description: 'Design, develop, and maintain software systems and applications. Work across various domains including web, mobile, desktop, cloud, and embedded systems.',
    matchScore: 92,
    salary: {
      min: 80000,
      max: 150000,
      currency: '$',
    },
    outlook: 'Excellent',
    skills: [
      { name: 'JavaScript', level: 'Advanced' },
      { name: 'Python', level: 'Intermediate' },
      { name: 'React', level: 'Advanced' },
      { name: 'System Design', level: 'Intermediate' },
      { name: 'Problem Solving', level: 'Advanced' },
      { name: 'Git', level: 'Intermediate' },
    ],
  },
  {
    id: 'ux-designer',
    title: 'UX Designer',
    description: 'Create user-centered designs by understanding user behavior, needs, and motivations. Design intuitive and engaging digital interfaces that enhance user satisfaction.',
    matchScore: 87,
    salary: {
      min: 75000,
      max: 130000,
      currency: '$',
    },
    outlook: 'Good',
    skills: [
      { name: 'User Research', level: 'Advanced' },
      { name: 'Wireframing', level: 'Advanced' },
      { name: 'Prototyping', level: 'Advanced' },
      { name: 'UI Design', level: 'Intermediate' },
      { name: 'User Testing', level: 'Intermediate' },
      { name: 'Figma', level: 'Advanced' },
    ],
  },
  {
    id: 'data-scientist',
    title: 'Data Scientist',
    description: 'Analyze and interpret complex data to enable informed decision-making. Combine statistics, mathematics, and programming to extract insights from large datasets.',
    matchScore: 85,
    salary: {
      min: 90000,
      max: 160000,
      currency: '$',
    },
    outlook: 'Excellent',
    skills: [
      { name: 'Python', level: 'Advanced' },
      { name: 'Machine Learning', level: 'Intermediate' },
      { name: 'SQL', level: 'Advanced' },
      { name: 'Data Visualization', level: 'Intermediate' },
      { name: 'Statistics', level: 'Advanced' },
      { name: 'R', level: 'Intermediate' },
    ],
  },
  {
    id: 'product-manager',
    title: 'Product Manager',
    description: 'Lead the development of products from conception to launch. Define product strategy, gather requirements, and coordinate cross-functional teams to deliver successful products.',
    matchScore: 78,
    salary: {
      min: 85000,
      max: 155000,
      currency: '$',
    },
    outlook: 'Good',
    skills: [
      { name: 'Product Strategy', level: 'Advanced' },
      { name: 'User Stories', level: 'Advanced' },
      { name: 'Market Research', level: 'Intermediate' },
      { name: 'Agile Methodologies', level: 'Advanced' },
      { name: 'Prioritization', level: 'Advanced' },
      { name: 'Communication', level: 'Expert' },
    ],
  },
];

const mockPathways: Record<string, CareerPathway> = {
  'software-engineer': {
    careerId: 'software-engineer',
    careerTitle: 'Software Engineer',
    steps: [
      {
        id: 'se-1',
        title: 'Bachelor\'s Degree in Computer Science or Related Field',
        description: 'Gain foundational knowledge in algorithms, data structures, programming languages, and software development principles.',
        duration: '4 years',
        type: 'Education',
        required: true,
      },
      {
        id: 'se-2',
        title: 'Build Coding Projects & Portfolio',
        description: 'Develop personal projects demonstrating your programming skills. Contribute to open-source projects to gain experience with collaborative development.',
        duration: '6-12 months',
        type: 'Experience',
        required: true,
      },
      {
        id: 'se-3',
        title: 'Internship or Entry-Level Position',
        description: 'Apply for internships or entry-level positions to gain real-world experience working on production software systems.',
        duration: '6-12 months',
        type: 'Experience',
        required: false,
      },
      {
        id: 'se-4',
        title: 'Specialize in a Technology Stack',
        description: 'Develop expertise in a specific area such as frontend, backend, mobile, or cloud development. Master relevant frameworks and tools.',
        duration: '1-2 years',
        type: 'Training',
        required: false,
      },
      {
        id: 'se-5',
        title: 'Professional Certifications',
        description: 'Obtain relevant certifications like AWS, Google Cloud, Microsoft Azure, or specialized framework certifications to validate your expertise.',
        duration: '3-6 months',
        type: 'Certification',
        required: false,
      },
    ],
  },
  'ux-designer': {
    careerId: 'ux-designer',
    careerTitle: 'UX Designer',
    steps: [
      {
        id: 'ux-1',
        title: 'Degree in Design, HCI, or Related Field',
        description: 'Gain formal education in design principles, user psychology, and interaction design through a relevant degree program.',
        duration: '2-4 years',
        type: 'Education',
        required: false,
      },
      {
        id: 'ux-2',
        title: 'UX Design Bootcamp or Course',
        description: 'Complete a structured UX design program to learn practical skills and current industry methodologies.',
        duration: '3-6 months',
        type: 'Training',
        required: true,
      },
      {
        id: 'ux-3',
        title: 'Create a UX Portfolio',
        description: 'Develop a portfolio showcasing your design process, user research, wireframes, prototypes, and final designs.',
        duration: '2-3 months',
        type: 'Experience',
        required: true,
      },
      {
        id: 'ux-4',
        title: 'Internship or Junior UX Position',
        description: 'Gain professional experience working on real products and collaborating with development teams.',
        duration: '6-12 months',
        type: 'Experience',
        required: false,
      },
      {
        id: 'ux-5',
        title: 'Specialized UX Training',
        description: 'Develop expertise in areas like UX research, interaction design, or usability testing to differentiate yourself.',
        duration: '3-6 months',
        type: 'Training',
        required: false,
      },
    ],
  },
  'data-scientist': {
    careerId: 'data-scientist',
    careerTitle: 'Data Scientist',
    steps: [
      {
        id: 'ds-1',
        title: 'Bachelor\'s Degree in Statistics, Mathematics, Computer Science, or Related Field',
        description: 'Build a foundation in mathematics, statistics, and programming fundamentals necessary for data science.',
        duration: '4 years',
        type: 'Education',
        required: true,
      },
      {
        id: 'ds-2',
        title: 'Master\'s Degree or Advanced Education in Data Science',
        description: 'Deepen your knowledge with specialized education in machine learning, statistical analysis, and data visualization.',
        duration: '1-2 years',
        type: 'Education',
        required: false,
      },
      {
        id: 'ds-3',
        title: 'Learn Key Programming Languages and Tools',
        description: 'Master Python, R, SQL, and specialized libraries like Pandas, NumPy, and scikit-learn. Learn visualization tools like Tableau.',
        duration: '6-12 months',
        type: 'Training',
        required: true,
      },
      {
        id: 'ds-4',
        title: 'Build Data Science Projects',
        description: 'Develop portfolio projects demonstrating your ability to collect, clean, analyze data, and derive insights.',
        duration: '3-6 months',
        type: 'Experience',
        required: true,
      },
      {
        id: 'ds-5',
        title: 'Kaggle Competitions or Real-world Projects',
        description: 'Participate in data science competitions or contribute to open-source data projects to gain practical experience.',
        duration: '3-6 months',
        type: 'Experience',
        required: false,
      },
      {
        id: 'ds-6',
        title: 'Specialized Certifications',
        description: 'Obtain certifications in areas like machine learning, big data, or cloud platforms to validate expertise.',
        duration: '2-4 months',
        type: 'Certification',
        required: false,
      },
    ],
  },
  'product-manager': {
    careerId: 'product-manager',
    careerTitle: 'Product Manager',
    steps: [
      {
        id: 'pm-1',
        title: 'Bachelor\'s Degree in Business, Computer Science, or Related Field',
        description: 'Gain foundational knowledge in business concepts, technology, and user-centered design.',
        duration: '4 years',
        type: 'Education',
        required: false,
      },
      {
        id: 'pm-2',
        title: 'Gain Experience in Related Roles',
        description: 'Work in roles like marketing, design, development, or customer success to understand different aspects of product development.',
        duration: '2-3 years',
        type: 'Experience',
        required: true,
      },
      {
        id: 'pm-3',
        title: 'Product Management Training or Certification',
        description: 'Complete formal training in product management methodologies, frameworks, and best practices.',
        duration: '3-6 months',
        type: 'Training',
        required: false,
      },
      {
        id: 'pm-4',
        title: 'Junior Product Manager or Associate Role',
        description: 'Enter a product management role to gain hands-on experience with product lifecycle management.',
        duration: '1-2 years',
        type: 'Experience',
        required: true,
      },
      {
        id: 'pm-5',
        title: 'Build Product Management Portfolio',
        description: 'Document your product management cases, showing your approach to product strategy, roadmap development, and feature prioritization.',
        duration: '3-6 months',
        type: 'Experience',
        required: false,
      },
    ],
  },
};

const Pathway = () => {
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState('matches');
  const [selectedCareerId, setSelectedCareerId] = useState<string | null>(null);
  const [selectedPathway, setSelectedPathway] = useState<CareerPathway | null>(null);
  const [selectedCareerDetails, setSelectedCareerDetails] = useState<any | null>(null);
  const [assessmentResults, setAssessmentResults] = useState<any | null>(null);
  const [openSection, setOpenSection] = useState<string | null>("education");
  const [mbtiType, setMbtiType] = useState<string | null>(null);
  
  useEffect(() => {
    // Load any assessment results from storage
    const loadAssessmentResults = async () => {
      try {
        const results = await StorageService.get('assessmentResults');
        if (results) {
          setAssessmentResults(results);
        }
        
        // Check for MBTI results also
        const mbtiResults = await StorageService.get('mbti_result');
        if (mbtiResults && mbtiResults.type) {
          setMbtiType(mbtiResults.type);
        }
      } catch (error) {
        console.error('Failed to load assessment results:', error);
      }
    };

    loadAssessmentResults();
    
    // Get careerId from URL params if present
    const careerId = searchParams.get('careerId');
    if (careerId) {
      setSelectedCareerId(careerId);
      const careerDetails = mockCareers.find((career) => career.id === careerId);
      if (careerDetails) {
        setSelectedCareerDetails(careerDetails);
      }
      const pathway = mockPathways[careerId];
      if (pathway) {
        setSelectedPathway(pathway);
      }
    }
  }, [searchParams]);

  const handleCareerSelect = (careerId: string) => {
    setSelectedCareerId(careerId);
    const careerDetails = mockCareers.find((career) => career.id === careerId);
    if (careerDetails) {
      setSelectedCareerDetails(careerDetails);
    }
    const pathway = mockPathways[careerId];
    if (pathway) {
      setSelectedPathway(pathway);
    }
  };

  const toggleSection = (section: string) => {
    setOpenSection(openSection === section ? null : section);
  };

  const getPersonalizedNote = () => {
    if (!mbtiType) return null;
    
    return (
      <div className="mb-6 p-4 border rounded-lg bg-primary/5">
        <h3 className="flex items-center text-lg font-medium mb-2">
          <Sparkles className="mr-2 h-5 w-5 text-primary" />
          Personalized MBTI Insights for {mbtiType}
        </h3>
        <p className="text-sm text-muted-foreground">
          Based on your {mbtiType} personality type, you may excel in careers that involve
          {mbtiType.includes('E') ? ' collaboration and teamwork' : ' independent work and deep focus'}.
          {mbtiType.includes('N') ? ' You enjoy exploring possibilities and innovations' : ' You appreciate practical, concrete tasks'}.
          {mbtiType.includes('F') ? ' Your empathy makes you excellent at understanding people\'s needs' : ' Your logical approach helps in systematic problem-solving'}.
          {mbtiType.includes('J') ? ' Your organizational skills help in structured environments' : ' Your adaptability thrives in flexible workplaces'}.
        </p>
      </div>
    );
  };

  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Your Career Pathway
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the steps to reach your career goals and explore the most suited paths based on your skills and interests.
            </p>
            
            {mbtiType && (
              <div className="flex justify-center mt-4">
                <Badge className="px-3 py-1 text-sm">
                  <GraduationCap className="mr-2 h-4 w-4" />
                  MBTI Personality Type: {mbtiType}
                </Badge>
              </div>
            )}
          </div>

          <Tabs defaultValue={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="matches">Career Matches</TabsTrigger>
              <TabsTrigger value="pathway" disabled={!selectedCareerId}>Career Pathway</TabsTrigger>
              <TabsTrigger value="explorer">Career Explorer</TabsTrigger>
            </TabsList>
            
            <TabsContent value="matches" className="mt-6 space-y-6">
              {getPersonalizedNote()}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockCareers.map((career) => (
                  <CareerCard 
                    key={career.id}
                    career={career}
                    isSelected={selectedCareerId === career.id}
                    onClick={() => handleCareerSelect(career.id)}
                  />
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pathway" className="mt-6">
              {selectedPathway ? (
                <div className="space-y-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                      <h2 className="text-2xl font-bold flex items-center gap-2">
                        <Briefcase className="h-6 w-6" />
                        {selectedPathway.careerTitle} Pathway
                      </h2>
                      <p className="text-muted-foreground mt-1">
                        Follow these steps to build a successful career as a {selectedPathway.careerTitle}
                      </p>
                    </div>
                    <Button variant="outline" className="flex items-center gap-2" onClick={() => window.print()}>
                      <Download className="h-4 w-4" /> Download Pathway
                    </Button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                      <div className="mb-8">
                        <h3 className="text-xl font-semibold mb-4">Pathway Steps</h3>
                        <div className="space-y-1">
                          {selectedPathway.steps.map((step, index) => (
                            <PathwayStep 
                              key={step.id}
                              step={step}
                              index={index}
                              isLast={index === selectedPathway.steps.length - 1}
                            />
                          ))}
                        </div>
                      </div>
                      
                      {mbtiType && (
                        <div className="p-5 border rounded-lg bg-primary/5 mb-8">
                          <h3 className="text-lg font-semibold flex items-center mb-2">
                            <Target className="h-5 w-5 mr-2 text-primary" />
                            MBTI Compatibility
                          </h3>
                          <p className="text-sm mb-3">
                            As an <span className="font-medium">{mbtiType}</span> personality type, here's how this career aligns with your natural strengths:
                          </p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium">Strengths Match</h4>
                                <p className="text-xs text-muted-foreground">
                                  {mbtiType.includes('I') ? 'Your thoughtful analysis and focus' : 'Your energetic and collaborative nature'}
                                  {mbtiType.includes('N') ? ' and innovative thinking' : ' and practical approach'}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-start gap-2">
                              <AlertCircle className="h-4 w-4 text-amber-500 mt-0.5" />
                              <div>
                                <h4 className="text-sm font-medium">Growth Areas</h4>
                                <p className="text-xs text-muted-foreground">
                                  {mbtiType.includes('F') ? 'You may need to develop more objective decision-making' : 'You may need to consider people\'s feelings more'}
                                  {mbtiType.includes('P') ? ' and improve organizational skills' : ' and be more flexible with changes'}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div>
                      {selectedCareerDetails && (
                        <Card>
                          <CardContent className="pt-6">
                            <h3 className="text-xl font-semibold mb-4">Career Details</h3>
                            
                            <Accordion 
                              type="single" 
                              collapsible 
                              defaultValue="skills"
                              className="w-full"
                            >
                              <AccordionItem value="description">
                                <AccordionTrigger>Description</AccordionTrigger>
                                <AccordionContent>
                                  <p className="text-sm">{selectedCareerDetails.description}</p>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="skills">
                                <AccordionTrigger>Required Skills</AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex flex-wrap gap-2">
                                    {selectedCareerDetails.skills.map((skill: any) => (
                                      <Badge 
                                        key={skill.name} 
                                        variant={skill.level === 'Advanced' || skill.level === 'Expert' ? 'default' : 'secondary'}
                                        className="px-2 py-1"
                                      >
                                        {skill.name} - {skill.level}
                                      </Badge>
                                    ))}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="salary">
                                <AccordionTrigger>Salary Range</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-3">
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">India</h4>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                          ₹{(selectedCareerDetails.salary.min * 0.075).toFixed(2)} LPA
                                        </span>
                                        <Separator className="w-12" />
                                        <span className="text-sm">
                                          ₹{(selectedCareerDetails.salary.max * 0.075).toFixed(2)} LPA
                                        </span>
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">United States</h4>
                                      <div className="flex items-center justify-between">
                                        <span className="text-sm">
                                          {selectedCareerDetails.salary.currency}{selectedCareerDetails.salary.min.toLocaleString()}
                                        </span>
                                        <Separator className="w-12" />
                                        <span className="text-sm">
                                          {selectedCareerDetails.salary.currency}{selectedCareerDetails.salary.max.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="outlook">
                                <AccordionTrigger>Career Outlook</AccordionTrigger>
                                <AccordionContent>
                                  <div className="flex items-center gap-2">
                                    {selectedCareerDetails.outlook === 'Excellent' && (
                                      <Badge className="bg-green-500">
                                        <TrendingUp className="w-3 h-3 mr-1" />
                                        Excellent
                                      </Badge>
                                    )}
                                    {selectedCareerDetails.outlook === 'Good' && (
                                      <Badge className="bg-blue-500">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Good
                                      </Badge>
                                    )}
                                    {selectedCareerDetails.outlook === 'Fair' && (
                                      <Badge className="bg-yellow-500 text-black">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Fair
                                      </Badge>
                                    )}
                                    {selectedCareerDetails.outlook === 'Poor' && (
                                      <Badge className="bg-red-500">
                                        <AlertCircle className="w-3 h-3 mr-1" />
                                        Poor
                                      </Badge>
                                    )}
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="colleges">
                                <AccordionTrigger>Top Colleges</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-4">
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">India</h4>
                                      <ul className="text-sm space-y-1">
                                        <li className="flex items-center gap-1">
                                          <Building className="h-3 w-3" />
                                          {selectedCareerDetails.id === 'software-engineer' ? 'IIT Bombay, Delhi, Madras' : 
                                           selectedCareerDetails.id === 'ux-designer' ? 'NID Ahmedabad, IIT Bombay IDC' :
                                           selectedCareerDetails.id === 'data-scientist' ? 'IISc Bangalore, IIT Delhi' :
                                           'IIM Ahmedabad, Bangalore, Calcutta'}
                                        </li>
                                        <li className="flex items-center gap-1">
                                          <Building className="h-3 w-3" />
                                          {selectedCareerDetails.id === 'software-engineer' ? 'BITS Pilani, IIIT Hyderabad' : 
                                           selectedCareerDetails.id === 'ux-designer' ? 'Srishti Institute, MIT Institute of Design' :
                                           selectedCareerDetails.id === 'data-scientist' ? 'ISI Kolkata, CMI Chennai' :
                                           'XLRI Jamshedpur, SPJIMR Mumbai'}
                                        </li>
                                        <li className="flex items-center gap-1">
                                          <Building className="h-3 w-3" />
                                          {selectedCareerDetails.id === 'software-engineer' ? 'NIT Trichy, Warangal, Surathkal' : 
                                           selectedCareerDetails.id === 'ux-designer' ? 'Pearl Academy, Symbiosis Design' :
                                           selectedCareerDetails.id === 'data-scientist' ? 'BITS Pilani, IIT Bombay' :
                                           'FMS Delhi, MDI Gurgaon'}
                                        </li>
                                      </ul>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-medium mb-2">Global</h4>
                                      <ul className="text-sm space-y-1">
                                        <li className="flex items-center gap-1">
                                          <Building className="h-3 w-3" />
                                          {selectedCareerDetails.id === 'software-engineer' ? 'MIT, Stanford, Carnegie Mellon' : 
                                           selectedCareerDetails.id === 'ux-designer' ? 'Rhode Island School of Design, Parsons' :
                                           selectedCareerDetails.id === 'data-scientist' ? 'Stanford, MIT, Berkeley' :
                                           'Harvard, Stanford, Wharton'}
                                        </li>
                                        <li className="flex items-center gap-1">
                                          <Building className="h-3 w-3" />
                                          {selectedCareerDetails.id === 'software-engineer' ? 'Berkeley, University of Washington' : 
                                           selectedCareerDetails.id === 'ux-designer' ? 'Pratt Institute, RCA London' :
                                           selectedCareerDetails.id === 'data-scientist' ? 'Harvard, Oxford, ETH Zurich' :
                                           'London Business School, INSEAD, HEC Paris'}
                                        </li>
                                      </ul>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                              
                              <AccordionItem value="exams">
                                <AccordionTrigger>Required Exams</AccordionTrigger>
                                <AccordionContent>
                                  <div className="space-y-2">
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">India</h4>
                                      <p className="text-sm">
                                        {selectedCareerDetails.id === 'software-engineer' ? 'JEE Main/Advanced, GATE, BITSAT' : 
                                         selectedCareerDetails.id === 'ux-designer' ? 'UCEED, NID DAT, CEED' :
                                         selectedCareerDetails.id === 'data-scientist' ? 'GATE, JAM, entrance exams for specific institutions' :
                                         'CAT, XAT, GMAT, MAT'}
                                      </p>
                                    </div>
                                    
                                    <div>
                                      <h4 className="text-sm font-medium mb-1">International</h4>
                                      <p className="text-sm">
                                        {selectedCareerDetails.id === 'software-engineer' ? 'GRE, university-specific entrance exams' : 
                                         selectedCareerDetails.id === 'ux-designer' ? 'Portfolio assessments, GRE for some programs' :
                                         selectedCareerDetails.id === 'data-scientist' ? 'GRE, GMAT for some programs' :
                                         'GMAT, GRE for some programs'}
                                      </p>
                                    </div>
                                  </div>
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center p-12">
                  <h3 className="text-xl font-medium mb-2">No Career Pathway Selected</h3>
                  <p className="text-muted-foreground mb-6">
                    Please select a career from the matches tab to view its pathway.
                  </p>
                  <Button onClick={() => setSelectedTab('matches')}>
                    View Career Matches
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="explorer" className="mt-6">
              <CareerExplorer />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Pathway;
