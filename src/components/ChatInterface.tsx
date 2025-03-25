
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { ChatMessage } from '@/types';
import { chatMessageAnimation } from '@/utils/animations';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import GeminiService from '@/services/gemini';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatInterfaceProps {
  className?: string;
  initialQuestion?: string;
  mbtiType?: string;
}

const ChatInterface = ({ className = "", initialQuestion, mbtiType }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hi there! I'm your Career Pathfinder assistant. I can help you discover suitable careers based on your background, skills, and interests. What would you like to explore today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState(initialQuestion || "");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage();
    }
  }, []);

  const getGeminiResponse = async (userMessage: string): Promise<string> => {
    try {
      // Create a system prompt with career guidance instructions
      let systemPrompt = `You are a helpful career advisor. Your goal is to help users explore career options based on their skills, interests, education, and preferences. 
        Provide thoughtful, personalized career guidance. Ask follow-up questions to better understand the user's situation. 
        Be concise but thorough, avoiding overly generic advice. Focus on providing actionable insights and specific career paths that might suit the user.
        Only answer questions related to careers, education, and professional development. If asked about unrelated topics, politely explain that you can only assist with career guidance.`;
      
      if (mbtiType) {
        systemPrompt += `\nThe user's MBTI type is ${mbtiType}. Consider this personality type when providing career advice and suggestions.`;
      }
      
      // For Gemini, we'll send just the current user message, not the whole conversation history
      // This avoids the "First content should be with role 'user'" error
      
      const response = await GeminiService.generateChatCompletion([
        {
          role: 'user',
          content: systemPrompt + "\n\nUser query: " + userMessage
        }
      ]);
      
      return response;
    } catch (error) {
      console.error("Error with Gemini:", error);
      throw error;
    }
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: uuidv4(),
      role: 'user',
      content: inputValue,
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsLoading(true);
    
    try {
      const aiResponseText = await getGeminiResponse(inputValue);
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
        metadata: { model: 'gemini' }
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      toast({
        title: "Error",
        description: "Failed to get a response. Please try again.",
        variant: "destructive",
      });
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: "Hi there! I'm your Career Pathfinder assistant. I can help you discover suitable careers based on your background, skills, and interests. What would you like to explore today?",
        timestamp: new Date(),
      }
    ]);
    
    toast({
      title: "Conversation Reset",
      description: "Started a new conversation",
    });
  };

  return (
    <div className={`flex flex-col w-full h-[80vh] max-h-[80vh] overflow-hidden rounded-2xl glass border shadow-sm ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Career Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by Google Gemini</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleReset}
          className="text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 pb-0 space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={chatMessageAnimation}
              className={`flex gap-3 ${
                message.role === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              {message.role === 'assistant' ? (
                <Avatar className="w-8 h-8 mt-1 bg-primary text-primary-foreground">
                  <Sparkles className="w-4 h-4" />
                </Avatar>
              ) : (
                <Avatar className="w-8 h-8 mt-1 bg-secondary text-secondary-foreground">
                  U
                </Avatar>
              )}
              <div
                className={`p-4 rounded-xl max-w-[80%] ${
                  message.role === 'assistant' 
                    ? 'bg-secondary' 
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {message.role === 'assistant' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      p: ({ node, ...props }) => (
                        <p className="text-sm whitespace-pre-wrap" {...props} />
                      ),
                      a: ({ node, ...props }) => (
                        <a className="text-blue-500 hover:underline" {...props} />
                      ),
                      ul: ({ node, ...props }) => (
                        <ul className="list-disc pl-5 my-2" {...props} />
                      ),
                      ol: ({ node, ...props }) => (
                        <ol className="list-decimal pl-5 my-2" {...props} />
                      ),
                      li: ({ node, ...props }) => (
                        <li className="my-1" {...props} />
                      ),
                      h1: ({ node, ...props }) => (
                        <h1 className="text-lg font-bold my-2" {...props} />
                      ),
                      h2: ({ node, ...props }) => (
                        <h2 className="text-md font-bold my-2" {...props} />
                      ),
                      h3: ({ node, ...props }) => (
                        <h3 className="text-sm font-bold my-2" {...props} />
                      ),
                      code: ({ node, className, children, ...props }: any) => {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !className;
                        return isInline ? (
                          <code className="bg-black/10 px-1 py-0.5 rounded" {...props}>
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-black/10 p-2 my-2 rounded overflow-x-auto" {...props}>
                            {children}
                          </code>
                        );
                      },
                      pre: ({ node, ...props }) => (
                        <pre className="bg-black/10 p-2 my-2 rounded overflow-x-auto" {...props} />
                      ),
                      blockquote: ({ node, ...props }) => (
                        <blockquote className="border-l-4 border-gray-300 pl-4 my-2 italic" {...props} />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                ) : (
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                )}
                <div className="mt-1 text-right flex justify-end items-center gap-1">
                  {message.role === 'assistant' && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-secondary-foreground/10 text-secondary-foreground/70">
                      Gemini
                    </span>
                  )}
                  <span className={`text-xs ${message.role === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex gap-3"
          >
            <Avatar className="w-8 h-8 mt-1 bg-primary text-primary-foreground">
              <Sparkles className="w-4 h-4" />
            </Avatar>
            <div className="p-4 rounded-xl max-w-[80%] bg-secondary">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  Processing with Gemini...
                </span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex gap-2"
        >
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Type your message..."
            className="resize-none min-h-[56px] max-h-[140px]"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button type="submit" disabled={isLoading || !inputValue.trim()}>
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
