
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import SuggestedPrompts from '@/components/SuggestedPrompts';
import { useSearchParams } from 'react-router-dom';
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
      <div className="min-h-screen pt-20 pb-6 px-4 max-h-screen overflow-hidden flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          <div className="text-center mb-4">
            <h1 className="text-xl md:text-2xl font-display font-bold tracking-tight">
              Chat with Your Career Assistant
            </h1>
            {mbtiType && (
              <div className="inline-flex items-center bg-secondary/80 px-3 py-1 mt-2 rounded-full text-sm font-medium">
                MBTI: {mbtiType}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 flex-1 overflow-hidden">
            <div className="col-span-12 h-[70vh] sm:h-[75vh] md:h-auto flex-1 overflow-hidden flex flex-col">
              <ChatInterface initialQuestion={currentPrompt} mbtiType={mbtiType} />
            </div>
            
            <div className="col-span-12 mt-auto overflow-x-auto py-2">
              <div className="flex flex-nowrap gap-2 pb-1">
                {(mbtiType && mbtiPrompts.length > 0 ? mbtiPrompts : getSuggestedPrompts()).map((prompt, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      // First set the prompt
                      handleSelectPrompt(prompt);
                      // Then force a small delay to ensure the state is updated
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
                    }}
                    className="text-left px-3 py-2 text-sm whitespace-nowrap bg-secondary/50 rounded-full hover:bg-secondary transition-colors hover:scale-105 transition-transform flex-shrink-0"
                  >
                    {prompt.length > 60 ? prompt.substring(0, 57) + '...' : prompt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Chat;
