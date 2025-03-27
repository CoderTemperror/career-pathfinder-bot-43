
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, BookOpen, Compass, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';

const Index = () => {
  const featuresRef = useRef<HTMLDivElement>(null);
  
  const scrollToFeatures = () => {
    featuresRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const staggerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.19, 1, 0.22, 1],
      }
    },
  };
  
  // Feature cards data
  const features = [
    {
      icon: <MessageSquare className="w-8 h-8 text-blue-600" />,
      title: "AI Career Chat",
      description: "Engage in meaningful conversations with our AI assistant to explore career possibilities based on your unique profile.",
      path: "/chat",
    },
    {
      icon: <BookOpen className="w-8 h-8 text-purple-600" />,
      title: "Career Assessment",
      description: "Discover careers aligned with your education, skills, personality, and preferences through our comprehensive assessment.",
      path: "/assessment",
    },
    {
      icon: <Compass className="w-8 h-8 text-green-600" />,
      title: "Pathway Planning",
      description: "Get detailed roadmaps showing the steps needed to achieve your career goals, with clear action items.",
      path: "/pathway",
    },
    {
      icon: <Award className="w-8 h-8 text-amber-600" />,
      title: "Resource Library",
      description: "Access curated resources to help you develop the skills and knowledge needed for your chosen career path.",
      path: "/resources",
    },
  ];
  
  return (
    <TransitionLayout>
      <Navbar />
      
      {/* Hero Section */}
      <div className="min-h-screen flex flex-col justify-center px-6 py-20 bg-gradient-to-b from-background to-secondary/30">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight text-balance">
              Discover Your Perfect Career Path
            </h1>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
          >
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              AI-powered guidance to help you find fulfilling careers aligned with your skills, education, and personality.
            </p>
          </motion.div>
          
          <motion.div 
            className="pt-4 flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          >
            <Link to="/assessment">
              <Button size="lg" className="rounded-xl px-6 py-6 hover-lift">
                <span>Start Assessment</span>
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="rounded-xl px-6 py-6 hover-lift"
              onClick={scrollToFeatures}
            >
              Learn More
            </Button>
          </motion.div>
        </div>
        
        {/* Animated arrow pointing down */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.6, 
            delay: 0.8,
            ease: [0.19, 1, 0.22, 1],
            repeat: Infinity,
            repeatType: "reverse",
          }}
          onClick={scrollToFeatures}
        >
          <div className="p-2 rounded-full bg-secondary">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className="text-muted-foreground"
            >
              <path d="M12 5v14" />
              <path d="m19 12-7 7-7-7" />
            </svg>
          </div>
        </motion.div>
      </div>
      
      {/* Features Section */}
      <div ref={featuresRef} className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              How CareerPath Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our intelligent platform combines AI with career development expertise to guide you toward your perfect career.
            </p>
          </motion.div>
          
          <motion.div 
            className="grid md:grid-cols-2 gap-6"
            variants={staggerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <Link to={feature.path} className="block h-full">
                  <Card className="h-full transition-all duration-300 hover:shadow-md hover:-translate-y-1">
                    <CardContent className="p-6">
                      <div className="rounded-full w-16 h-16 flex items-center justify-center bg-secondary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground mb-4">{feature.description}</p>
                      <div className="flex items-center text-primary font-medium">
                        <span>Explore</span>
                        <ArrowRight className="ml-2 w-4 h-4" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="py-20 px-6 bg-primary/5">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Start Your Career Journey Today
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Whether you're starting fresh or looking to pivot, we'll help you find your way forward.
            </p>
            <Link to="/chat">
              <Button size="lg" className="rounded-xl px-6 py-6 hover-lift">
                <MessageSquare className="mr-2 w-5 h-5" />
                <span>Chat with AI Assistant</span>
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
      
      {/* Footer */}
      <footer className="py-12 px-6 bg-secondary/80">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-muted-foreground">© 2024 CareerPath. All rights reserved.</p>
        </div>
      </footer>
    </TransitionLayout>
  );
};

export default Index;
