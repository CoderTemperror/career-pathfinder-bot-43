
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Book, Compass, GraduationCap, UserPlus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import { Resource } from '@/types';

// Mock resources data
const mockResources: Resource[] = [
  {
    id: 'r1',
    title: 'The Complete Web Development Bootcamp',
    description: 'Comprehensive course covering HTML, CSS, JavaScript, React, Node.js, and more for aspiring web developers.',
    url: 'https://example.com/web-dev-bootcamp',
    type: 'Course',
    tags: ['web development', 'programming', 'javascript', 'react'],
  },
  {
    id: 'r2',
    title: 'UX Design Institute Professional Diploma',
    description: 'Industry-recognized qualification teaching the fundamentals of UX design through practical projects.',
    url: 'https://example.com/ux-design-diploma',
    type: 'Course',
    tags: ['ux design', 'user research', 'prototyping'],
  },
  {
    id: 'r3',
    title: 'Data Science Career Guide',
    description: 'Comprehensive guide to building a successful career in data science, including required skills and job search strategies.',
    url: 'https://example.com/data-science-guide',
    type: 'Article',
    tags: ['data science', 'career advice', 'python'],
  },
  {
    id: 'r4',
    title: 'Product Management Community',
    description: 'Online community for product managers to share knowledge, discuss challenges, and find mentorship opportunities.',
    url: 'https://example.com/product-management-community',
    type: 'Community',
    tags: ['product management', 'networking', 'career growth'],
  },
  {
    id: 'r5',
    title: 'Technical Interview Preparation Platform',
    description: 'Platform offering coding challenges, mock interviews, and resources to prepare for technical interviews.',
    url: 'https://example.com/interview-prep',
    type: 'Tool',
    tags: ['interviews', 'coding challenges', 'career advice'],
  },
  {
    id: 'r6',
    title: 'Resume Builder for Tech Professionals',
    description: 'Tool to create ATS-friendly resumes tailored for technology and design roles.',
    url: 'https://example.com/resume-builder',
    type: 'Tool',
    tags: ['resume', 'job search', 'career advice'],
  },
  {
    id: 'r7',
    title: 'Fundamentals of Project Management',
    description: 'Course covering project management methodologies, tools, and best practices for aspiring project and product managers.',
    url: 'https://example.com/project-management',
    type: 'Course',
    tags: ['project management', 'agile', 'leadership'],
  },
  {
    id: 'r8',
    title: 'Networking Strategies for Career Growth',
    description: 'Guide to building professional relationships and leveraging networking for career advancement.',
    url: 'https://example.com/networking-guide',
    type: 'Article',
    tags: ['networking', 'career growth', 'soft skills'],
  },
];

const Resources = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Filter resources based on search query and active tab
  const filteredResources = mockResources.filter(resource => {
    const matchesSearch = 
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesTab = 
      activeTab === 'all' ||
      (activeTab === 'courses' && resource.type === 'Course') ||
      (activeTab === 'articles' && resource.type === 'Article') ||
      (activeTab === 'tools' && resource.type === 'Tool') ||
      (activeTab === 'communities' && resource.type === 'Community');
    
    return matchesSearch && matchesTab;
  });
  
  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'Article':
        return <Book className="w-5 h-5 text-blue-600" />;
      case 'Course':
        return <GraduationCap className="w-5 h-5 text-purple-600" />;
      case 'Tool':
        return <Compass className="w-5 h-5 text-green-600" />;
      case 'Community':
        return <UserPlus className="w-5 h-5 text-amber-600" />;
      default:
        return <Book className="w-5 h-5 text-gray-600" />;
    }
  };
  
  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Career Resources
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover curated resources to help you develop skills and advance your career path.
            </p>
          </div>
          
          {/* Search and filters */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search resources..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-8">
              <TabsTrigger value="all" className="text-sm py-3">All</TabsTrigger>
              <TabsTrigger value="courses" className="text-sm py-3">Courses</TabsTrigger>
              <TabsTrigger value="articles" className="text-sm py-3">Articles</TabsTrigger>
              <TabsTrigger value="tools" className="text-sm py-3">Tools</TabsTrigger>
              <TabsTrigger value="communities" className="text-sm py-3">Communities</TabsTrigger>
            </TabsList>
            
            <TabsContent value={activeTab} className="mt-0">
              <div className="grid grid-cols-1 gap-6">
                {filteredResources.length > 0 ? (
                  filteredResources.map((resource, index) => (
                    <motion.div
                      key={resource.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.05 }}
                    >
                      <Card className="overflow-hidden transition-all duration-300 hover:shadow-md">
                        <CardHeader className="pb-3">
                          <div className="flex justify-between items-start gap-4">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2 mb-1">
                                {getResourceIcon(resource.type)}
                                <span className="text-sm font-medium text-muted-foreground">
                                  {resource.type}
                                </span>
                              </div>
                              <CardTitle className="text-xl">{resource.title}</CardTitle>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="pb-4 space-y-4">
                          <p className="text-muted-foreground">
                            {resource.description}
                          </p>
                          
                          <div className="space-y-3">
                            <Separator />
                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map((tag, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            <div className="pt-2">
                              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full sm:w-auto">
                                  Access Resource
                                </Button>
                              </a>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground">No resources found matching your criteria.</p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Resources;
