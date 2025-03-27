
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import SuggestedPrompts from '@/components/SuggestedPrompts';
import { useSearchParams } from 'react-router-dom';
import { Bot } from 'lucide-react';
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
      <div className="min-h-screen pt-24 pb-12 px-6 max-h-screen overflow-hidden flex flex-col">
        <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col">
          <div className="text-center mb-6">
            <h1 className="text-2xl md:text-3xl font-display font-bold tracking-tight mb-2">
              Chat with Your Career Assistant
            </h1>
            <div className="flex flex-wrap justify-center items-center gap-3 mb-2">
              <div className="inline-flex items-center bg-primary/10 px-3 py-1.5 rounded-full text-sm">
                <Bot className="h-4 w-4 text-primary mr-1.5" />
                AI-powered guidance
              </div>
              
              {mbtiType && (
                <div className="inline-flex items-center bg-secondary px-3 py-1.5 rounded-full text-sm font-medium">
                  MBTI: {mbtiType}
                </div>
              )}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 overflow-hidden">
            <div className="col-span-1 md:pr-4 overflow-y-auto max-h-[30vh] md:max-h-full">
              {mbtiType && mbtiPrompts.length > 0 ? (
                <div className="mb-4">
                  <h2 className="text-sm font-semibold mb-2 text-muted-foreground">SUGGESTIONS FOR {mbtiType}</h2>
                  <div className="flex flex-col gap-2">
                    {mbtiPrompts.map((prompt, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          // First set the prompt
                          handleSelectPrompt(prompt);
                          // Then force a small delay to ensure the state is updated
                          setTimeout(() => {
                            const textareaElement = document.querySelector('textarea');
                            if (textareaElement) {
                              // Focus the textarea and dispatch an input event to trigger changes
                              textareaElement.focus();
                              const event = new Event('input', { bubbles: true });
                              textareaElement.dispatchEvent(event);
                              
                              // Also simulate an Enter key press to submit the form
                              const enterEvent = new KeyboardEvent('keydown', {
                                key: 'Enter',
                                code: 'Enter',
                                bubbles: true
                              });
                              textareaElement.dispatchEvent(enterEvent);
                            }
                          }, 100);
                        }}
                        className="text-left p-2 text-sm bg-secondary/50 rounded-lg hover:bg-secondary transition-colors"
                      >
                        {prompt}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <SuggestedPrompts onSelectPrompt={handleSelectPrompt} />
              )}
            </div>
            
            <div className="col-span-1 md:col-span-3 flex-1 h-[60vh] md:h-auto overflow-hidden">
              <ChatInterface initialQuestion={currentPrompt} mbtiType={mbtiType} />
            </div>
          </div>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Chat;
