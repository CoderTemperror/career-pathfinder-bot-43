
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import MBTIAssessment from '@/components/MBTIAssessment';
import { Bot, ArrowRight, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import StorageService from '@/services/storage';

const MBTIPage = () => {
  const [hasPreviousResult, setHasPreviousResult] = useState(false);
  const [previousType, setPreviousType] = useState<string | null>(null);
  const [startNewAssessment, setStartNewAssessment] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if user has a previous MBTI result
    const savedResult = StorageService.get('mbti_result');
    if (savedResult && savedResult.type) {
      setHasPreviousResult(true);
      setPreviousType(savedResult.type);
    } else {
      // If no previous result, start assessment right away
      setStartNewAssessment(true);
    }
  }, []);
  
  const handleViewResults = () => {
    if (previousType) {
      navigate(`/chat?mbti=${previousType}`);
    }
  };
  
  const handleStartNew = () => {
    setStartNewAssessment(true);
  };
  
  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6 overflow-x-hidden">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-3">
              MBTI Personality Assessment
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Discover your personality type and get personalized career recommendations
            </p>
            
            <div className="flex justify-center items-center mt-3">
              <div className="inline-flex items-center bg-primary/10 px-3 py-1.5 rounded-full text-sm">
                <Bot className="h-4 w-4 text-primary mr-1.5" />
                Powered by advanced AI technology
              </div>
            </div>
          </div>
          
          {hasPreviousResult && !startNewAssessment ? (
            <div className="space-y-6 p-6 border rounded-xl bg-secondary/20">
              <div className="text-center">
                <div className="inline-flex items-center justify-center bg-green-500/20 p-3 rounded-full mb-3">
                  <Check className="h-6 w-6 text-green-500" />
                </div>
                <h2 className="text-2xl font-semibold mb-1">You've Already Completed the Assessment</h2>
                <p className="text-muted-foreground">
                  Your personality type is <span className="font-bold text-primary">{previousType}</span>
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center mt-4">
                <Button 
                  onClick={handleViewResults}
                  className="flex items-center"
                >
                  View Career Recommendations
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleStartNew}
                >
                  Take Assessment Again
                </Button>
              </div>
            </div>
          ) : (
            <MBTIAssessment />
          )}
        </div>
      </div>
    </TransitionLayout>
  );
};

export default MBTIPage;
