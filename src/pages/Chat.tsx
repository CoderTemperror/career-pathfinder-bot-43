
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import SuggestedPrompts from '@/components/SuggestedPrompts';
import { useSearchParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getSuggestedPrompts } from '@/utils/mbtiCalculator';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const initialQuestion = searchParams.get('question') || undefined;
  const mbtiType = searchParams.get('mbti') || undefined;
  const [currentPrompt, setCurrentPrompt] = useState<string>(initialQuestion || '');
  const [mbtiPrompts, setMbtiPrompts] = useState<string[]>([]);
  
  useEffect(() => {
    // If MBTI type is provided, get customized prompts
    if (mbtiType) {
      const prompts = getSuggestedPrompts(mbtiType);
      setMbtiPrompts(prompts);
    }
  }, [mbtiType]);
  
  const handleSelectPrompt = (prompt: string) => {
    setCurrentPrompt(prompt);
  };
  
  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Chat with Your Career Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-4">
              Ask questions about careers, required qualifications, job outlook, or any other career-related topics.
            </p>
            
            <div className="flex justify-center items-center mt-4 mb-2">
              <div className="flex items-center bg-primary/10 p-3 rounded-lg mb-2">
                <Sparkles className="h-5 w-5 text-primary mr-2" />
                <p className="text-sm">
                  Powered by Google Gemini 2.0 Flash (Free Tier)
                </p>
              </div>
            </div>
            
            {mbtiType && (
              <div className="flex justify-center mt-2">
                <div className="bg-secondary px-3 py-1 rounded-full text-sm">
                  MBTI: {mbtiType}
                </div>
              </div>
            )}
          </div>
          
          {mbtiType && mbtiPrompts.length > 0 ? (
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Personalized Suggestions for {mbtiType}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mbtiPrompts.map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => handleSelectPrompt(prompt)}
                    className="text-left p-3 bg-secondary rounded-lg hover:bg-secondary/80 transition-colors"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
          )}
          
          <ChatInterface initialQuestion={currentPrompt} mbtiType={mbtiType} />
        </div>
      </div>
      <Toaster />
    </TransitionLayout>
  );
};

export default Chat;
