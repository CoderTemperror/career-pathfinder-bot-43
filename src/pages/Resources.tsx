
import { useState } from 'react';
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import { motion } from 'framer-motion';
import { 
  Search, 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  CheckCircle, 
  ExternalLink,
  Filter,
  Tag,
  School,
  Building,
  Globe,
  Award
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Label } from '@/components/ui/label';

// Define types for our resources
interface Resource {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'college' | 'exam' | 'course' | 'guide' | 'tool';
  tags: string[];
  featured?: boolean;
  flags?: {
    isIndian?: boolean;
    isFree?: boolean;
    isCertified?: boolean;
  };
}

// Sample resource data
const resourceData: Resource[] = [
  // Colleges
  {
    id: 'iit-jee',
    title: 'IITs - Joint Entrance Examination (JEE)',
    description: 'Official portal for admission to undergraduate engineering programs at IITs through JEE (Advanced).',
    url: 'https://jeeadv.ac.in/',
    category: 'college',
    tags: ['engineering', 'technology', 'undergraduate', 'admission'],
    flags: { isIndian: true }
  },
  {
    id: 'mit',
    title: 'Massachusetts Institute of Technology (MIT)',
    description: 'One of the world\'s leading institutions for education and research in science, engineering and technology.',
    url: 'https://www.mit.edu/',
    category: 'college',
    tags: ['engineering', 'science', 'research', 'technology', 'global'],
    featured: true
  },
  {
    id: 'iims',
    title: 'Indian Institutes of Management (IIMs)',
    description: 'Premier management institutions in India offering MBA and executive education programs.',
    url: 'https://www.iim.ac.in/',
    category: 'college',
    tags: ['management', 'business', 'MBA', 'commerce'],
    flags: { isIndian: true }
  },
  {
    id: 'harvard',
    title: 'Harvard University',
    description: 'Prestigious Ivy League research university offering programs across all disciplines.',
    url: 'https://www.harvard.edu/',
    category: 'college',
    tags: ['ivy league', 'research', 'multidisciplinary', 'global'],
    featured: true
  },
  {
    id: 'aiims',
    title: 'All India Institute of Medical Sciences (AIIMS)',
    description: 'Premier medical institution in India for medicine, healthcare and research.',
    url: 'https://www.aiims.edu/',
    category: 'college',
    tags: ['medicine', 'healthcare', 'research', 'MBBS'],
    flags: { isIndian: true }
  },
  
  // Exams
  {
    id: 'cat-exam',
    title: 'Common Admission Test (CAT)',
    description: 'Entrance examination for admission to MBA programs at IIMs and other business schools in India.',
    url: 'https://iimcat.ac.in/',
    category: 'exam',
    tags: ['MBA', 'management', 'business', 'entrance exam'],
    flags: { isIndian: true }
  },
  {
    id: 'gre',
    title: 'Graduate Record Examination (GRE)',
    description: 'Standardized test for admission to graduate and business programs globally.',
    url: 'https://www.ets.org/gre/',
    category: 'exam',
    tags: ['graduate studies', 'masters', 'PhD', 'global'],
    featured: true
  },
  {
    id: 'neet',
    title: 'National Eligibility cum Entrance Test (NEET)',
    description: 'Entrance examination for admission to MBBS and BDS programs in India.',
    url: 'https://neet.nta.nic.in/',
    category: 'exam',
    tags: ['medicine', 'dental', 'healthcare', 'MBBS'],
    flags: { isIndian: true }
  },
  {
    id: 'jee-main',
    title: 'Joint Entrance Examination (JEE) Main',
    description: 'Entrance examination for admission to engineering programs at NITs, IIITs and other institutions in India.',
    url: 'https://jeemain.nta.nic.in/',
    category: 'exam',
    tags: ['engineering', 'technology', 'undergraduate'],
    flags: { isIndian: true }
  },
  {
    id: 'upsc',
    title: 'Union Public Service Commission (UPSC)',
    description: 'Conducts civil services examination for recruitment to various government services in India.',
    url: 'https://www.upsc.gov.in/',
    category: 'exam',
    tags: ['civil services', 'government', 'IAS', 'IPS'],
    flags: { isIndian: true }
  },
  
  // Courses
  {
    id: 'coursera',
    title: 'Coursera',
    description: 'Online platform offering courses, specializations and degrees from top universities and companies.',
    url: 'https://www.coursera.org/',
    category: 'course',
    tags: ['online learning', 'multidisciplinary', 'certificates', 'degrees'],
    featured: true,
    flags: { isCertified: true }
  },
  {
    id: 'udemy',
    title: 'Udemy',
    description: 'Online learning platform with courses on programming, business, personal development and more.',
    url: 'https://www.udemy.com/',
    category: 'course',
    tags: ['online learning', 'skills', 'programming', 'business'],
    flags: { isCertified: true }
  },
  {
    id: 'edx',
    title: 'edX',
    description: 'Online learning platform founded by Harvard and MIT offering courses from top universities.',
    url: 'https://www.edx.org/',
    category: 'course',
    tags: ['online learning', 'multidisciplinary', 'micromaster', 'certificates'],
    flags: { isCertified: true }
  },
  {
    id: 'nptel',
    title: 'NPTEL (National Programme on Technology Enhanced Learning)',
    description: 'Online learning platform offering courses in engineering, science and humanities from IITs and IISc.',
    url: 'https://nptel.ac.in/',
    category: 'course',
    tags: ['engineering', 'science', 'online learning', 'certificates'],
    flags: { isIndian: true, isFree: true, isCertified: true }
  },
  {
    id: 'khan-academy',
    title: 'Khan Academy',
    description: 'Free online learning platform with courses in math, science, computing and more.',
    url: 'https://www.khanacademy.org/',
    category: 'course',
    tags: ['free', 'online learning', 'math', 'science', 'school'],
    flags: { isFree: true }
  },
  
  // Career Guides
  {
    id: 'linkedin-learning',
    title: 'LinkedIn Learning',
    description: 'Online learning platform offering courses on business, technology and creative skills.',
    url: 'https://www.linkedin.com/learning/',
    category: 'guide',
    tags: ['professional development', 'business', 'technology', 'skills'],
    flags: { isCertified: true }
  },
  {
    id: 'onetonline',
    title: 'O*NET OnLine',
    description: 'Database of occupational information with detailed descriptions, skills, tasks and more.',
    url: 'https://www.onetonline.org/',
    category: 'guide',
    tags: ['career exploration', 'job profiles', 'skills', 'occupations'],
    flags: { isFree: true }
  },
  {
    id: 'glassdoor',
    title: 'Glassdoor',
    description: 'Website providing insights on companies, salaries, interviews and job listings.',
    url: 'https://www.glassdoor.com/',
    category: 'guide',
    tags: ['job search', 'company reviews', 'salaries', 'interviews']
  },
  {
    id: 'skill-india',
    title: 'Skill India Portal',
    description: 'Government initiative for skill development and vocational training in India.',
    url: 'https://www.skillindia.gov.in/',
    category: 'guide',
    tags: ['skill development', 'vocational training', 'certification'],
    flags: { isIndian: true, isFree: true }
  },
  
  // Tools
  {
    id: 'myersbriggs',
    title: 'Myers-Briggs Type Indicator (MBTI) Official Site',
    description: 'Learn more about the MBTI personality assessment and how it relates to careers.',
    url: 'https://www.myersbriggs.org/my-mbti-personality-type/mbti-basics/',
    category: 'tool',
    tags: ['personality assessment', 'career guidance', 'MBTI']
  },
  {
    id: 'github',
    title: 'GitHub',
    description: 'Platform for version control and collaboration for software development projects.',
    url: 'https://github.com/',
    category: 'tool',
    tags: ['programming', 'software development', 'version control', 'portfolio'],
    flags: { isFree: true }
  },
  {
    id: 'kaggle',
    title: 'Kaggle',
    description: 'Platform for data science competitions, datasets and learning resources.',
    url: 'https://www.kaggle.com/',
    category: 'tool',
    tags: ['data science', 'machine learning', 'competitions', 'portfolio'],
    flags: { isFree: true }
  },
  {
    id: 'behance',
    title: 'Behance',
    description: 'Platform for showcasing and discovering creative work in design, illustration and more.',
    url: 'https://www.behance.net/',
    category: 'tool',
    tags: ['design', 'portfolio', 'creative', 'inspiration'],
    flags: { isFree: true }
  }
];

// All unique tags from resources
const allTags = Array.from(new Set(resourceData.flatMap(resource => resource.tags))).sort();

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [filters, setFilters] = useState({
    isIndian: false,
    isFree: false,
    isCertified: false
  });
  
  // Filter resources based on search, category, tags and other filters
  const filteredResources = resourceData.filter(resource => {
    // Search filter
    const matchesSearch = 
      searchQuery === "" || 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    // Category filter
    const matchesCategory = 
      selectedCategory === "all" || 
      resource.category === selectedCategory;
    
    // Tags filter
    const matchesTags = 
      selectedTags.length === 0 || 
      selectedTags.some(tag => resource.tags.includes(tag));
    
    // Additional filters
    const matchesIndian = 
      !filters.isIndian || 
      resource.flags?.isIndian === true;
    
    const matchesFree = 
      !filters.isFree || 
      resource.flags?.isFree === true;
    
    const matchesCertified = 
      !filters.isCertified || 
      resource.flags?.isCertified === true;
    
    return matchesSearch && matchesCategory && matchesTags && matchesIndian && matchesFree && matchesCertified;
  });
  
  // Filter featured resources
  const featuredResources = resourceData.filter(resource => resource.featured);
  
  // Group resources by category for the category view
  const resourcesByCategory = {
    college: resourceData.filter(r => r.category === 'college'),
    exam: resourceData.filter(r => r.category === 'exam'),
    course: resourceData.filter(r => r.category === 'course'),
    guide: resourceData.filter(r => r.category === 'guide'),
    tool: resourceData.filter(r => r.category === 'tool')
  };
  
  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag) 
        : [...prev, tag]
    );
  };
  
  const handleFilterChange = (key: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };
  
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'college':
        return <School className="h-5 w-5" />;
      case 'exam':
        return <FileText className="h-5 w-5" />;
      case 'course':
        return <BookOpen className="h-5 w-5" />;
      case 'guide':
        return <Briefcase className="h-5 w-5" />;
      case 'tool':
        return <GraduationCap className="h-5 w-5" />;
      default:
        return <BookOpen className="h-5 w-5" />;
    }
  };
  
  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'college':
        return 'Colleges & Universities';
      case 'exam':
        return 'Entrance Exams';
      case 'course':
        return 'Online Courses';
      case 'guide':
        return 'Career Guides';
      case 'tool':
        return 'Career Tools';
      default:
        return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Career Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover colleges, exams, courses, and tools to help you achieve your career goals.
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Search & Filters (Left sidebar on desktop) */}
            <div className="md:w-1/4 space-y-6">
              <div>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search resources..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="border rounded-lg p-4 space-y-4">
                <h3 className="font-semibold flex items-center gap-2">
                  <Filter className="h-4 w-4" /> 
                  Filters
                </h3>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Categories</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="all" 
                        checked={selectedCategory === "all"}
                        onCheckedChange={() => setSelectedCategory("all")}
                      />
                      <Label htmlFor="all">All Categories</Label>
                    </div>
                    
                    {Object.keys(resourcesByCategory).map(category => (
                      <div key={category} className="flex items-center space-x-2">
                        <Checkbox 
                          id={category} 
                          checked={selectedCategory === category}
                          onCheckedChange={() => setSelectedCategory(category)}
                        />
                        <Label htmlFor={category}>{getCategoryLabel(category)}</Label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2">Special Filters</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isIndian" 
                        checked={filters.isIndian}
                        onCheckedChange={() => handleFilterChange('isIndian')}
                      />
                      <Label htmlFor="isIndian">Indian Resources</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isFree" 
                        checked={filters.isFree}
                        onCheckedChange={() => handleFilterChange('isFree')}
                      />
                      <Label htmlFor="isFree">Free Resources</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="isCertified" 
                        checked={filters.isCertified}
                        onCheckedChange={() => handleFilterChange('isCertified')}
                      />
                      <Label htmlFor="isCertified">Certified Programs</Label>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center">
                    <Tag className="h-3 w-3 mr-1" /> Popular Tags
                  </h4>
                  <ScrollArea className="h-[200px] pr-4">
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <Badge 
                          key={tag} 
                          variant={selectedTags.includes(tag) ? "default" : "outline"}
                          className="cursor-pointer"
                          onClick={() => handleTagToggle(tag)}
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </div>
            
            {/* Resources Content (Right side) */}
            <div className="md:w-3/4">
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="w-full mb-6">
                  <TabsTrigger value="all">All Resources</TabsTrigger>
                  <TabsTrigger value="featured">Featured</TabsTrigger>
                  <TabsTrigger value="categories">By Category</TabsTrigger>
                </TabsList>
                
                <TabsContent value="all" className="mt-0">
                  {filteredResources.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredResources.map(resource => (
                        <ResourceCard key={resource.id} resource={resource} />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">No resources found matching your criteria.</p>
                      <Button 
                        variant="outline" 
                        className="mt-4"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                          setSelectedTags([]);
                          setFilters({
                            isIndian: false,
                            isFree: false,
                            isCertified: false
                          });
                        }}
                      >
                        Clear All Filters
                      </Button>
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="featured" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {featuredResources.map(resource => (
                      <ResourceCard key={resource.id} resource={resource} />
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent value="categories" className="mt-0">
                  <div className="space-y-8">
                    {Object.entries(resourcesByCategory).map(([category, resources]) => (
                      <div key={category}>
                        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                          {getCategoryIcon(category)}
                          {getCategoryLabel(category)}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {resources.map(resource => (
                            <ResourceCard key={resource.id} resource={resource} />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </TransitionLayout>
  );
};

const ResourceCard = ({ resource }: { resource: Resource }) => {
  return (
    <Card className="h-full hover:shadow-md transition-shadow overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg">{resource.title}</CardTitle>
            <CardDescription className="mt-1 line-clamp-2">{resource.description}</CardDescription>
          </div>
          <div className="mt-1">
            {getCategoryIcon(resource.category)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex flex-wrap gap-2 mt-2">
          {resource.tags.slice(0, 4).map(tag => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {resource.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{resource.tags.length - 4} more
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2 mt-3">
          {resource.flags?.isIndian && (
            <Badge variant="outline" className="bg-amber-500/10 text-amber-700 border-amber-200 text-xs">
              <Building className="h-3 w-3 mr-1" /> Indian
            </Badge>
          )}
          {resource.flags?.isFree && (
            <Badge variant="outline" className="bg-green-500/10 text-green-700 border-green-200 text-xs">
              <CheckCircle className="h-3 w-3 mr-1" /> Free
            </Badge>
          )}
          {resource.flags?.isCertified && (
            <Badge variant="outline" className="bg-blue-500/10 text-blue-700 border-blue-200 text-xs">
              <Award className="h-3 w-3 mr-1" /> Certified
            </Badge>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full mt-auto" 
          size="sm"
          variant="outline"
          asChild
        >
          <a 
            href={resource.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center"
          >
            Visit Resource
            <ExternalLink className="ml-2 h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

function getCategoryIcon(category: string) {
  switch (category) {
    case 'college':
      return <School className="h-5 w-5 text-blue-500" />;
    case 'exam':
      return <FileText className="h-5 w-5 text-purple-500" />;
    case 'course':
      return <BookOpen className="h-5 w-5 text-green-500" />;
    case 'guide':
      return <Briefcase className="h-5 w-5 text-amber-500" />;
    case 'tool':
      return <GraduationCap className="h-5 w-5 text-pink-500" />;
    default:
      return <Globe className="h-5 w-5 text-gray-500" />;
  }
}

export default Resources;
