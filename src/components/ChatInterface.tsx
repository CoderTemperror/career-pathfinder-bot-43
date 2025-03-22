import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { ChatMessage } from '@/types';
import { chatMessageAnimation } from '@/utils/animations';
import { v4 as uuidv4 } from 'uuid';

// Improved AI response logic
const getAIResponse = async (message: string, previousMessages: ChatMessage[]): Promise<string> => {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const lowerMessage = message.toLowerCase();
  const context = previousMessages.map(msg => msg.content).join(" ");
  
  // If asking about education or academic background
  if (lowerMessage.includes('education') || lowerMessage.includes('degree') || lowerMessage.includes('study') || lowerMessage.includes('academic')) {
    if (context.includes('education') || context.includes('degree')) {
      return "Thanks for sharing more about your education. Based on your academic background, what specific skills did you develop during your studies that you enjoy using?";
    }
    return "I'd love to hear about your educational background. What level of education have you completed, and in what field or subjects did you study?";
  }
  
  // If discussing skills or strengths
  if (lowerMessage.includes('skill') || lowerMessage.includes('strength') || lowerMessage.includes('good at')) {
    if (context.includes('technology') || context.includes('program') || context.includes('develop')) {
      return "Your technical skills are valuable in today's job market. Have you considered roles in software development, IT management, or data science? Which of these areas aligns most with your interests?";
    }
    if (context.includes('creative') || context.includes('design') || context.includes('art')) {
      return "Your creative abilities could be well-suited for careers in UX/UI design, content creation, or marketing. What aspects of the creative process do you enjoy the most?";
    }
    return "Understanding your skills is important for career alignment. Can you tell me more about what you excel at? Are these technical skills, soft skills, or both?";
  }
  
  // If discussing interests or hobbies
  if (lowerMessage.includes('interest') || lowerMessage.includes('hobby') || lowerMessage.includes('enjoy')) {
    if (context.includes('people') || context.includes('help') || context.includes('teach')) {
      return "Your interest in working with and helping others suggests careers in education, counseling, healthcare, or customer-facing roles might be fulfilling for you. Would any of these areas interest you?";
    }
    if (context.includes('analysis') || context.includes('data') || context.includes('research')) {
      return "With your analytical interests, have you considered careers in data analysis, market research, or scientific research? These fields leverage critical thinking and problem-solving abilities.";
    }
    return "Interests and passions often lead to fulfilling careers. What activities energize you or make you lose track of time when you're doing them?";
  }
  
  // If asking about specific industries
  if (lowerMessage.includes('technology') || lowerMessage.includes('tech') || lowerMessage.includes('programming')) {
    if (context.includes('beginner') || context.includes('start') || context.includes('learn')) {
      return "For someone starting in technology, I recommend exploring foundational courses in programming, web development, or IT basics. Platforms like Coursera, freeCodeCamp, or Codecademy offer excellent introductory resources. Which area of technology interests you most?";
    }
    return "The technology field offers diverse opportunities from software development to cybersecurity to product management. With your background, which technology specialization interests you most? Would you prefer creating products, ensuring their security, or managing technical teams?";
  }
  
  // If asking about healthcare
  if (lowerMessage.includes('health') || lowerMessage.includes('medical') || lowerMessage.includes('care')) {
    return "Healthcare careers range from direct patient care roles like nursing to technical positions like medical technology or administrative roles in healthcare management. Are you more interested in working directly with patients or in a supporting role?";
  }
  
  // If asking about business or finance
  if (lowerMessage.includes('business') || lowerMessage.includes('finance') || lowerMessage.includes('management')) {
    return "Business and finance careers include financial analysis, management consulting, marketing, or entrepreneurship. Do you prefer working with numbers and analysis, developing strategies, or leading teams?";
  }
  
  // If asking about career change
  if (lowerMessage.includes('change') || lowerMessage.includes('transition') || lowerMessage.includes('switch')) {
    return "Career transitions can be challenging but rewarding. What's motivating your desire for change? Understanding your transferable skills and what you're seeking in a new role will help guide this process.";
  }
  
  // If asking how to prepare for a career
  if (lowerMessage.includes('prepare') || lowerMessage.includes('ready') || lowerMessage.includes('path')) {
    return "Preparing for a career typically involves a combination of education, skill development, networking, and gaining relevant experience. Based on what you've shared, are there specific areas where you'd like guidance on preparation steps?";
  }
  
  // Default responses that vary based on conversation length
  const generalResponses = [
    "Could you tell me more about your educational background and any work experience you have? This will help me provide more tailored career guidance.",
    "What kinds of work environments do you thrive in? Do you prefer structured settings or more flexible ones?",
    "Let's explore your interests more deeply. What subjects or activities have consistently captured your attention throughout your life?",
    "What values are most important to you in a career? Financial security, work-life balance, making a difference, creative expression, or something else?",
    "Thinking about your ideal day at work, what activities would you be doing? Who would you be working with?",
  ];
  
  return generalResponses[Math.floor(Math.random() * generalResponses.length)];
};

interface ChatInterfaceProps {
  className?: string;
  initialQuestion?: string;
}

const ChatInterface = ({ className = "", initialQuestion }: ChatInterfaceProps) => {
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
      // Get AI response based on current message and conversation history
      const aiResponseText = await getAIResponse(inputValue, messages);
      
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
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: "Hi there! I'm your Career Pathfinder assistant. I can help you discover suitable careers based on your background, skills, and interests. What would you like to explore today?",
        timestamp: new Date(),
      }
    ]);
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
