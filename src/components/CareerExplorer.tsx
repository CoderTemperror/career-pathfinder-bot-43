
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  BookOpen, 
  Building, 
  GraduationCap, 
  TrendingUp, 
  Briefcase, 
  BanknoteIcon, 
  Globe, 
  ScrollText, 
  School,
  Award,
  Target,
  DollarSign,
  Clock,
  Lightbulb,
  ArrowRight as ArrowRightIcon
} from 'lucide-react';

const streams = [
  {
    id: 'science',
    name: 'Science',
    icon: <BookOpen className="h-4 w-4" />,
    description: 'Career paths for students from Physics, Chemistry, Biology & Mathematics backgrounds',
  },
  {
    id: 'commerce',
    name: 'Commerce',
    icon: <Briefcase className="h-4 w-4" />,
    description: 'Career paths for students with Accounting, Business Studies & Economics backgrounds',
  },
  {
    id: 'arts',
    name: 'Arts & Humanities',
    icon: <ScrollText className="h-4 w-4" />,
    description: 'Career paths for students with History, Geography, Political Science, Sociology backgrounds',
  },
  {
    id: 'vocational',
    name: 'Vocational',
    icon: <Target className="h-4 w-4" />,
    description: 'Skill-based career paths that may not require traditional degrees',
  },
];

const careerOptions = {
  'science': [
    {
      id: 'engineering',
      title: 'Engineering',
      description: 'Design, develop, and implement technical solutions across various industries',
      scope: 'Excellent',
      salary: '₹5-40 LPA (India), $70-150K (US)',
      exams: 'JEE Main/Advanced, GATE, GRE',
      colleges: {
        india: ['IITs', 'NITs', 'BITS Pilani', 'VIT', 'MIT Manipal'],
        global: ['MIT', 'Stanford', 'ETH Zurich', 'NUS Singapore', 'Cambridge']
      },
      specializations: ['Computer Science', 'Mechanical', 'Electrical', 'Civil', 'Chemical']
    },
    {
      id: 'medicine',
      title: 'Medicine & Healthcare',
      description: 'Diagnose, treat, and prevent diseases and injuries',
      scope: 'Excellent',
      salary: '₹8-80 LPA (India), $150-400K (US)',
      exams: 'NEET UG, NEET PG, USMLE',
      colleges: {
        india: ['AIIMS', 'CMC Vellore', 'AFMC Pune', 'JIPMER', 'KEM Mumbai'],
        global: ['Harvard Medical School', 'Johns Hopkins', 'Oxford', 'Stanford', 'Toronto']
      },
      specializations: ['General Medicine', 'Surgery', 'Pediatrics', 'Cardiology', 'Neurology']
    },
    {
      id: 'research',
      title: 'Scientific Research',
      description: 'Explore, discover, and expand scientific knowledge in specialized fields',
      scope: 'Good',
      salary: '₹4-20 LPA (India), $60-150K (US)',
      exams: 'NET/JRF, GATE, GRE',
      colleges: {
        india: ['IISC Bangalore', 'TIFR', 'CSIR Labs', 'IISER', 'NISER'],
        global: ['Stanford', 'MIT', 'Oxford', 'Cambridge', 'ETH Zurich']
      },
      specializations: ['Physics', 'Chemistry', 'Biology', 'Materials Science', 'Earth Sciences']
    },
    {
      id: 'data-science',
      title: 'Data Science & Analytics',
      description: 'Extract insights from data to inform business decisions',
      scope: 'Excellent',
      salary: '₹6-30 LPA (India), $80-160K (US)',
      exams: 'None specific, certifications help',
      colleges: {
        india: ['IITs', 'IIITs', 'ISI Kolkata', 'IIM Analytics', 'BITS Pilani'],
        global: ['Stanford', 'MIT', 'CMU', 'Berkeley', 'Harvard']
      },
      specializations: ['Machine Learning', 'AI', 'Business Analytics', 'Biostatistics', 'Data Engineering']
    },
  ],
  'commerce': [
    {
      id: 'accounting',
      title: 'Accounting & Finance',
      description: 'Manage financial records, auditing, taxation, and financial planning',
      scope: 'Good',
      salary: '₹5-25 LPA (India), $60-150K (US)',
      exams: 'CA, CMA, CFA, FRM',
      colleges: {
        india: ['SRCC Delhi', 'Christ University', 'Symbiosis', 'NMIMS', 'IIMs'],
        global: ['London School of Economics', 'Wharton', 'Harvard', 'NYU Stern', 'HEC Paris']
      },
      specializations: ['Chartered Accountancy', 'Investment Banking', 'Financial Analysis', 'Corporate Finance', 'Wealth Management']
    },
    {
      id: 'business',
      title: 'Business Management',
      description: 'Plan, organize, and oversee business operations and strategies',
      scope: 'Excellent',
      salary: '₹7-40 LPA (India), $70-180K (US)',
      exams: 'CAT, XAT, GMAT',
      colleges: {
        india: ['IIMs', 'XLRI', 'FMS Delhi', 'SPJIMR', 'ISB Hyderabad'],
        global: ['Harvard', 'Stanford', 'Wharton', 'London Business School', 'INSEAD']
      },
      specializations: ['Marketing', 'HR', 'Operations', 'Strategy', 'International Business']
    },
    {
      id: 'economics',
      title: 'Economics & Policy',
      description: 'Analyze economic trends and develop policies',
      scope: 'Good',
      salary: '₹5-30 LPA (India), $70-150K (US)',
      exams: 'Indian Economic Service, GRE',
      colleges: {
        india: ['DSE Delhi', 'ISI', 'JNU', 'Gokhale Institute', 'IGIDR Mumbai'],
        global: ['LSE', 'Harvard', 'MIT', 'Chicago', 'Cambridge']
      },
      specializations: ['Macroeconomics', 'Development Economics', 'Econometrics', 'Public Policy', 'Environmental Economics']
    },
    {
      id: 'entrepreneurship',
      title: 'Entrepreneurship',
      description: 'Start and manage your own business ventures',
      scope: 'Variable',
      salary: 'Highly variable, unlimited potential',
      exams: 'None',
      colleges: {
        india: ['IIMs', 'SPJIMR', 'ISB', 'BITS PILANI', 'NMIMS'],
        global: ['Stanford', 'MIT', 'Harvard', 'Babson College', 'IE Business School']
      },
      specializations: ['Tech Startups', 'Social Entrepreneurship', 'E-commerce', 'Service Industry', 'Manufacturing']
    },
  ],
  'arts': [
    {
      id: 'law',
      title: 'Law & Legal Studies',
      description: 'Provide legal advice, representation, and services',
      scope: 'Good',
      salary: '₹5-50 LPA (India), $70-200K (US)',
      exams: 'CLAT, LSAT, Bar Exams',
      colleges: {
        india: ['NLSIU Bangalore', 'NALSAR Hyderabad', 'NLU Delhi', 'ILS Pune', 'GLC Mumbai'],
        global: ['Harvard Law', 'Yale Law', 'Oxford', 'Cambridge', 'Stanford Law']
      },
      specializations: ['Corporate Law', 'Criminal Law', 'Human Rights', 'Intellectual Property', 'International Law']
    },
    {
      id: 'media',
      title: 'Media & Communication',
      description: 'Create and deliver content across various media platforms',
      scope: 'Good',
      salary: '₹4-25 LPA (India), $50-120K (US)',
      exams: 'Entrance exams for top institutes',
      colleges: {
        india: ['IIMC', 'Symbiosis', 'Xavier Institute', 'Jamia Millia Islamia', 'ACJ Chennai'],
        global: ['USC Annenberg', 'Northwestern', 'Columbia', 'NYU', 'London College of Communication']
      },
      specializations: ['Journalism', 'Public Relations', 'Digital Media', 'Advertising', 'Film Production']
    },
    {
      id: 'psychology',
      title: 'Psychology & Counseling',
      description: 'Study human behavior and provide mental health support',
      scope: 'Increasing',
      salary: '₹4-20 LPA (India), $50-120K (US)',
      exams: 'NET/JRF, GRE',
      colleges: {
        india: ['TISS', 'Christ University', 'Delhi University', 'Jamia Millia Islamia', 'NIMHANS'],
        global: ['Stanford', 'Harvard', 'University College London', 'McGill', 'Melbourne']
      },
      specializations: ['Clinical Psychology', 'Counseling', 'Industrial Psychology', 'Cognitive Psychology', 'Educational Psychology']
    },
    {
      id: 'design',
      title: 'Design & Creative Arts',
      description: 'Create visual solutions for various media and purposes',
      scope: 'Good',
      salary: '₹4-30 LPA (India), $60-150K (US)',
      exams: 'UCEED, NID DAT, CEED',
      colleges: {
        india: ['NID', 'IIT Bombay IDC', 'NIFT', 'Srishti', 'MIT Institute of Design'],
        global: ['RISD', 'Parsons', 'Royal College of Art', 'Pratt Institute', 'ArtCenter']
      },
      specializations: ['UX/UI Design', 'Graphic Design', 'Fashion Design', 'Industrial Design', 'Animation']
    },
  ],
  'vocational': [
    {
      id: 'it-skills',
      title: 'IT & Programming',
      description: 'Develop technical skills in coding, web development, and IT infrastructure',
      scope: 'Excellent',
      salary: '₹4-30 LPA (India), $60-150K (US)',
      exams: 'Certifications (AWS, Google, Microsoft)',
      colleges: {
        india: ['Bootcamps: Masai School, Newton School, AlmaBetter', 'Online: Coursera, Udemy', 'NIIT'],
        global: ['App Academy', 'General Assembly', 'Lambda School', 'Flatiron School', 'Coding Dojo']
      },
      specializations: ['Web Development', 'App Development', 'DevOps', 'Cloud Computing', 'Cybersecurity']
    },
    {
      id: 'digital-marketing',
      title: 'Digital Marketing',
      description: 'Promote products/services through digital channels',
      scope: 'Excellent',
      salary: '₹3-20 LPA (India), $40-120K (US)',
      exams: 'Certifications (Google, HubSpot, Facebook)',
      colleges: {
        india: ['MICA Ahmedabad', 'Digital Vidya', 'IIDE', 'DMTI', 'Simplilearn'],
        global: ['Online: Coursera, LinkedIn Learning', 'BrainStation', 'General Assembly']
      },
      specializations: ['SEO', 'Social Media Marketing', 'Content Marketing', 'Email Marketing', 'Analytics']
    },
    {
      id: 'culinary',
      title: 'Culinary Arts & Hospitality',
      description: 'Create food experiences and manage hospitality services',
      scope: 'Good',
      salary: '₹3-15 LPA (India), $40-100K (US)',
      exams: 'NCHMCT JEE for hotel management',
      colleges: {
        india: ['IHM Mumbai/Delhi/Bangalore', 'WGSHA Manipal', 'Culinary Academy of India', 'CTH'],
        global: ['Culinary Institute of America', 'Le Cordon Bleu', 'Swiss Hotel Management School']
      },
      specializations: ['Chef', 'Food & Beverage Management', 'Hotel Management', 'Pastry Arts', 'Restaurant Management']
    },
    {
      id: 'beauty',
      title: 'Beauty & Wellness',
      description: 'Provide personal care and aesthetic services',
      scope: 'Good',
      salary: '₹2-15 LPA (India), $30-80K (US)',
      exams: 'Institute-specific entrance',
      colleges: {
        india: ['VLCC Institute', 'Lakme Academy', 'L\'Oreal Academy', 'Shahnaz Husain Academy'],
        global: ['Aveda Institutes', 'Paul Mitchell Schools', 'London College of Fashion']
      },
      specializations: ['Cosmetology', 'Hair Styling', 'Makeup Artistry', 'Spa Management', 'Wellness Coaching']
    },
  ]
};

const CareerExplorer = () => {
  const [selectedStream, setSelectedStream] = useState<string | null>(null);
  const [selectedCareer, setSelectedCareer] = useState<any | null>(null);
  
  const handleSelectStream = (streamId: string) => {
    setSelectedStream(streamId);
    setSelectedCareer(null);
  };
  
  const handleSelectCareer = (career: any) => {
    setSelectedCareer(career);
  };
  
  return (
    <Card className="w-full shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl flex items-center">
          <Lightbulb className="mr-2 h-5 w-5 text-primary" />
          Career Explorer
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!selectedStream ? (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-1">Select Your Stream</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Choose the educational stream you're interested in exploring
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {streams.map((stream) => (
                <Button
                  key={stream.id}
                  variant="outline"
                  className="h-auto text-left flex flex-col items-start p-4 gap-2"
                  onClick={() => handleSelectStream(stream.id)}
                >
                  <div className="flex items-center gap-2">
                    <div className="bg-primary/10 p-2 rounded-full">
                      {stream.icon}
                    </div>
                    <span className="font-semibold">{stream.name}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stream.description}</p>
                </Button>
              ))}
            </div>
          </div>
        ) : !selectedCareer ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {streams.find(s => s.id === selectedStream)?.name} Careers
              </h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedStream(null)}>
                ← Back to Streams
              </Button>
            </div>
            
            <div className="grid grid-cols-1 gap-3">
              {careerOptions[selectedStream as keyof typeof careerOptions].map((career) => (
                <Button
                  key={career.id}
                  variant="outline"
                  className="h-auto text-left flex items-start p-4 gap-3 justify-between"
                  onClick={() => handleSelectCareer(career)}
                >
                  <div className="flex-1">
                    <div className="font-semibold mb-1">{career.title}</div>
                    <p className="text-xs text-muted-foreground">{career.description}</p>
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" /> 
                        Scope: {career.scope}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        <GraduationCap className="h-3 w-3 mr-1" /> 
                        {career.specializations.length} Specializations
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <ArrowRightIcon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </Button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-medium flex items-center">
                {selectedCareer.title}
              </h3>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedCareer(null)}
              >
                ← Back to Careers
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div className="mb-6">
                  <h4 className="text-sm font-semibold text-muted-foreground">OVERVIEW</h4>
                  <p className="mt-1">{selectedCareer.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <Badge variant="secondary" className="px-2 py-1">
                      <TrendingUp className="h-3 w-3 mr-1" /> 
                      Future Scope: {selectedCareer.scope}
                    </Badge>
                    <Badge variant="secondary" className="px-2 py-1">
                      <DollarSign className="h-3 w-3 mr-1" /> 
                      Salary Range: {selectedCareer.salary}
                    </Badge>
                  </div>
                </div>
                
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="exams">
                    <AccordionTrigger className="text-base">
                      <span className="flex items-center">
                        <ScrollText className="h-4 w-4 mr-2" />
                        Required Exams
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="p-2">
                        <p className="mb-2 text-sm">{selectedCareer.exams}</p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  
                  <AccordionItem value="specializations">
                    <AccordionTrigger className="text-base">
                      <span className="flex items-center">
                        <Target className="h-4 w-4 mr-2" />
                        Specializations
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-wrap gap-2 p-2">
                        {selectedCareer.specializations.map((spec: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {spec}
                          </Badge>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
              
              <div>
                <h4 className="text-sm font-semibold text-muted-foreground mb-3">TOP COLLEGES</h4>
                <Tabs defaultValue="india">
                  <TabsList className="w-full mb-4">
                    <TabsTrigger value="india" className="flex-1">
                      <School className="h-3 w-3 mr-1" /> India
                    </TabsTrigger>
                    <TabsTrigger value="global" className="flex-1">
                      <Globe className="h-3 w-3 mr-1" /> Global
                    </TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="india" className="mt-0">
                    <div className="space-y-2">
                      {selectedCareer.colleges.india.map((college: string, index: number) => (
                        <div 
                          key={index}
                          className="p-2 border rounded-md flex items-center gap-2 bg-secondary/20"
                        >
                          <Building className="h-4 w-4 text-primary" />
                          <span>{college}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="global" className="mt-0">
                    <div className="space-y-2">
                      {selectedCareer.colleges.global.map((college: string, index: number) => (
                        <div 
                          key={index}
                          className="p-2 border rounded-md flex items-center gap-2 bg-secondary/20"
                        >
                          <Building className="h-4 w-4 text-primary" />
                          <span>{college}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CareerExplorer;
