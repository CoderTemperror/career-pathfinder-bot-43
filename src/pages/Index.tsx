import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Sparkles, BarChart3, MessageSquare, Brain, Lightbulb, School, Compass, Target } from 'lucide-react';

const Index = () => {
  const navigate = useNavigate();

  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="mb-1">
              <span className="text-sm text-muted-foreground font-medium">SBH 2025 Junior</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-bold tracking-tight mb-8">
              <span className="inline-block">Find Your Perfect</span>{' '}
              <span className="inline-block text-primary">Career Path</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Discover careers that match your skills, interests, and personality
              with our AI-powered career guidance tools.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => navigate('/mbti')}
                className="text-md px-6"
              >
                <Brain className="mr-2 h-5 w-5" />
                Take MBTI Personality Test
              </Button>
              <Button
                size="lg"
                onClick={() => navigate('/chat')}
                variant="secondary"
                className="text-md px-6"
              >
                <MessageSquare className="mr-2 h-5 w-5" />
                Chat with AI Assistant
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-card rounded-xl p-6 border hover-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">MBTI Personality Test</h3>
              <p className="text-muted-foreground">
                Take our MBTI personality assessment to discover your type and find careers that align with your natural strengths.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-xl p-6 border hover-shadow"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">AI Career Guidance</h3>
              <p className="text-muted-foreground">
                Chat with our AI assistant for personalized career advice,
                education paths, and job market insights.
              </p>
            </motion.div>
          </div>

          <div className="bg-card rounded-xl p-8 border mb-16 hover-shadow">
            <div className="flex items-center mb-6">
              <Sparkles className="h-5 w-5 text-primary mr-2" />
              <h2 className="text-2xl font-semibold">AI-Powered Career Guidance</h2>
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              Our platform uses advanced AI to analyze your unique profile and
              match you with careers that fit your skills, interests, and
              personality. Get detailed insights on:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-secondary/80 rounded-lg hover:bg-secondary transition-colors duration-300 hover:shadow-md">
                <Lightbulb className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-medium">Career Matches</h3>
              </div>
              <div className="p-4 bg-secondary/80 rounded-lg hover:bg-secondary transition-colors duration-300 hover:shadow-md">
                <Lightbulb className="h-5 w-5 text-primary mb-2" />
                <h3 className="font-medium">Education Paths</h3>
              </div>
            </div>
            <div className="flex justify-center">
              <Button onClick={() => navigate('/mbti')} className="px-6">
                <Brain className="mr-2 h-4 w-4" />
                Take the MBTI Assessment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Index;
