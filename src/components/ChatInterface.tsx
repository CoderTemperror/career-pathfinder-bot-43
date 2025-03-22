
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { ChatMessage } from '@/types';
import { chatMessageAnimation } from '@/utils/animations';
import { v4 as uuidv4 } from 'uuid';

// Mock Career Bot responses
const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    content: "Hi there! I'm your Career Pathfinder assistant. I can help you discover suitable careers based on your background, skills, and interests. What would you like to explore today?",
    timestamp: new Date(),
  },
];

// Mock response for AI - this would be replaced with actual API
const getAIResponse = async (message: string): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('study')) {
    return "That's great information about your educational background. Can you tell me more about your skills and interests? What activities do you enjoy and what are you naturally good at?";
  }
  
  if (lowerMessage.includes('skill') || lowerMessage.includes('interest') || lowerMessage.includes('hobby')) {
    return "Thank you for sharing your skills and interests. Based on what you've told me, you might be well-suited for careers in technology, design, or education. Would you like me to explore any of these areas in more depth?";
  }
  
  if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('programming')) {
    return "The technology field offers many opportunities. With your background, you might consider roles like software development, UX/UI design, or data analysis. Each of these paths requires different skills and training. Would you like to know more about any of these specific career paths?";
  }
  
  // Default response
  return "That's helpful information. To provide better career guidance, could you tell me more about your educational background, skills, and interests?";
};

interface ChatInterfaceProps {
  className?: string;
  initialQuestion?: string;
}

const ChatInterface = ({ className = "", initialQuestion }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputValue, setInputValue] = useState(initialQuestion || "");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // If there's an initial question, send it on mount
  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage();
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;
    
    // Add user message
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
      // Get AI response
      const aiResponseText = await getAIResponse(inputValue);
      
      // Add AI message
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      // Add error message
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
    setMessages(INITIAL_MESSAGES);
  };

  return (
    <div className={`flex flex-col w-full h-[80vh] max-h-[80vh] overflow-hidden rounded-2xl glass border shadow-sm ${className}`}>
      {/* Chat header */}
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Career Assistant</h3>
            <p className="text-xs text-muted-foreground">Helping you find your path</p>
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
      
      {/* Chat messages */}
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
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <div className="mt-1 text-right">
                  <span className={`text-xs ${message.role === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Loading indicator */}
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
                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Thinking...</span>
              </div>
            </div>
          </motion.div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
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
