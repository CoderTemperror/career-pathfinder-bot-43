
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, Award, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import PathwayStep from '@/components/PathwayStep';
import CareerCard from '@/components/CareerCard';
import { Career, CareerPathway, PathwayStep as PathwayStepType } from '@/types';

// Mock career data
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

// Mock pathway data
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
  
  // Use careerId from URL if present
  useEffect(() => {
    const careerIdFromUrl = searchParams.get('careerId');
    if (careerIdFromUrl && mockPathways[careerIdFromUrl]) {
      setSelectedCareerId(careerIdFromUrl);
      setSelectedPathway(mockPathways[careerIdFromUrl]);
      setSelectedTab('pathway');
    }
  }, [searchParams]);
  
  const handleSelectCareer = (careerId: string) => {
    setSelectedCareerId(careerId);
    setSelectedPathway(mockPathways[careerId]);
    setSelectedTab('pathway');
  };
  
  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Your Career Pathway
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore careers that match your profile and discover the steps to achieve them.
            </p>
          </div>
          
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="matches" className="text-base py-3">
                Career Matches
              </TabsTrigger>
              <TabsTrigger value="pathway" className="text-base py-3" disabled={!selectedPathway}>
                Career Pathway
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="matches" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {mockCareers.map((career, index) => (
                  <div key={career.id} onClick={() => handleSelectCareer(career.id)} className="cursor-pointer">
                    <CareerCard career={career} index={index} />
                  </div>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="pathway" className="space-y-6">
              {selectedPathway && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="mb-8">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
                            <Briefcase className="w-6 h-6 text-primary-foreground" />
                          </div>
                          <div>
                            <h2 className="text-2xl font-semibold">{selectedPathway.careerTitle}</h2>
                            <p className="text-muted-foreground">Career pathway guide</p>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="flex items-center gap-2">
                          <Download className="w-4 h-4" />
                          <span>Save Pathway</span>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <div className="relative pl-6">
                    <div className="mb-6 flex items-center gap-2">
                      <Award className="w-5 h-5 text-primary" />
                      <h3 className="text-xl font-semibold">Pathway Steps</h3>
                    </div>
                    
                    {selectedPathway.steps.map((step, index) => (
                      <PathwayStep 
                        key={step.id} 
                        step={step} 
                        index={index} 
                        isLast={index === selectedPathway.steps.length - 1} 
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Pathway;
