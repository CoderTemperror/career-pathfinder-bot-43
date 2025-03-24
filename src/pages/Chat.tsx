
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import OpenAIConfig from '@/components/OpenAIConfig';
import SuggestedPrompts from '@/components/SuggestedPrompts';
import { useSearchParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { Info } from 'lucide-react';
import { useState } from 'react';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const initialQuestion = searchParams.get('question') || undefined;
  const [currentPrompt, setCurrentPrompt] = useState<string>(initialQuestion || '');
  
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
            
            <div className="flex flex-col items-center justify-center mt-4 mb-2">
              <div className="flex items-center bg-muted p-3 rounded-lg mb-2 w-full max-w-md mx-auto">
                <Info className="h-5 w-5 text-muted-foreground mr-2" />
                <p className="text-sm text-muted-foreground">
                  This assistant works best with an OpenAI API key
                </p>
                <OpenAIConfig />
              </div>
            </div>
          </div>
          
          <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
          
          <ChatInterface initialQuestion={currentPrompt} />
        </div>
      </div>
      <Toaster />
    </TransitionLayout>
  );
};

export default Chat;
