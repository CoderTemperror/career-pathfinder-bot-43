
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import MBTIAssessment from '@/components/MBTIAssessment';
import { Sparkles } from 'lucide-react';
import GeminiConfig from '@/components/GeminiConfig';

const MBTIPage = () => {
  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              MBTI Personality Assessment
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              Discover your personality type and get personalized career recommendations
            </p>
            
            <div className="flex justify-center items-center mt-4 mb-2">
              <div className="flex items-center bg-primary/10 p-3 rounded-lg mb-2">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <p className="text-sm">
                  Powered by Google Gemini 2.0 Flash (Free Tier)
                </p>
              </div>
            </div>
            
            <div className="flex justify-center">
              <GeminiConfig />
            </div>
          </div>
          
          <MBTIAssessment />
        </div>
      </div>
    </TransitionLayout>
  );
};

export default MBTIPage;
