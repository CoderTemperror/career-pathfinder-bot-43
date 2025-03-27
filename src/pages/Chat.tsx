import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import SuggestedPromptsSidebar from '@/components/SuggestedPromptsSidebar';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSuggestedPrompts } from '@/utils/mbtiCalculator';
import { Lightbulb } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const initialQuestion = searchParams.get('question') || undefined;
  const mbtiType = searchParams.get('mbti') || undefined;
  const [currentPrompt, setCurrentPrompt] = useState<string>(initialQuestion || '');
  const [mbtiPrompts, setMbtiPrompts] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  useEffect(() => {
    if (mbtiType) {
      const prompts = getSuggestedPrompts(mbtiType || 'general');
      setMbtiPrompts(prompts);
    }
  }, [mbtiType]);
  
  const handleSelectPrompt = (prompt: string) => {
    setCurrentPrompt(prompt);
    
    setTimeout(() => {
      const textareaElement = document.querySelector('textarea');
      if (textareaElement) {
        textareaElement.value = prompt;
        textareaElement.focus();
        
        const event = new Event('input', { bubbles: true });
        textareaElement.dispatchEvent(event);
        
        setTimeout(() => {
          const enterEvent = new KeyboardEvent('keydown', {
            key: 'Enter',
            code: 'Enter',
            bubbles: true
          });
          textareaElement.dispatchEvent(enterEvent);
        }, 50);
      }
    }, 100);
  };
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <TransitionLayout>
      <Navbar />
      <div className="flex h-screen w-full pt-[72px] overflow-hidden">
        <div className="flex-1 flex flex-col overflow-hidden relative w-full">
          <div className="px-4 py-3 border-b bg-background sticky top-0 z-10 hover-shadow">
            <div className="max-w-5xl mx-auto flex items-center">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="mr-3 h-8 w-8 flex-shrink-0"
                aria-label="Toggle sidebar"
              >
                <Lightbulb className="h-5 w-5" />
              </Button>
              
              <div className="flex-1">
                <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-center">
                  Chat with Your Career Assistant
                </h1>
                {mbtiType && (
                  <div className="flex justify-center mt-2">
                    <div className="inline-flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
                      MBTI: {mbtiType}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="h-8 w-8"></div>
            </div>
          </div>
          
          <div className="flex-1 overflow-hidden">
            <ChatInterface initialQuestion={currentPrompt} mbtiType={mbtiType} />
          </div>
        </div>

        <SuggestedPromptsSidebar 
          onSelectPrompt={handleSelectPrompt}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
        />
      </div>
    </TransitionLayout>
  );
};

export default Chat;
