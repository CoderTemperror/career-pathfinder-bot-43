
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import SuggestedPromptsSidebar from '@/components/SuggestedPromptsSidebar';
import { useSearchParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getSuggestedPrompts } from '@/utils/mbtiCalculator';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const initialQuestion = searchParams.get('question') || undefined;
  const mbtiType = searchParams.get('mbti') || undefined;
  const [currentPrompt, setCurrentPrompt] = useState<string>(initialQuestion || '');
  const [mbtiPrompts, setMbtiPrompts] = useState<string[]>([]);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768);
  
  useEffect(() => {
    // If MBTI type is provided, get customized prompts
    if (mbtiType) {
      const prompts = getSuggestedPrompts(mbtiType);
      setMbtiPrompts(prompts);
    }
  }, [mbtiType]);
  
  const handleSelectPrompt = (prompt: string) => {
    setCurrentPrompt(prompt);
    
    // Add a small delay to ensure the state is updated
    setTimeout(() => {
      const textareaElement = document.querySelector('textarea');
      if (textareaElement) {
        textareaElement.value = prompt;
        textareaElement.focus();
        
        // Dispatch input event
        const event = new Event('input', { bubbles: true });
        textareaElement.dispatchEvent(event);
        
        // Simulate Enter keypress to submit
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
      <div className="flex min-h-screen pt-20 pb-0 max-h-screen overflow-hidden">
        {/* Sidebar for suggested prompts */}
        <SuggestedPromptsSidebar 
          onSelectPrompt={handleSelectPrompt}
          isOpen={sidebarOpen}
          onToggle={toggleSidebar}
          className="hidden md:block"
        />
        
        {/* Chat content - take up full width when sidebar is closed */}
        <div className={`flex-1 transition-all duration-300 flex flex-col ${sidebarOpen ? 'md:ml-[320px]' : ''}`}>
          <div className="px-4 py-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight text-center">
              Chat with Your Career Assistant
            </h1>
            {mbtiType && (
              <div className="flex justify-center mt-2">
                <div className="inline-flex items-center bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300 px-3 py-1 rounded-full text-sm font-medium">
                  MBTI: {mbtiType}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex-1 overflow-hidden p-0">
            <ChatInterface initialQuestion={currentPrompt} mbtiType={mbtiType} />
          </div>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Chat;
