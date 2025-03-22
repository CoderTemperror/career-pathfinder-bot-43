import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, RotateCcw, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ChatMessage } from '@/types';
import { chatMessageAnimation } from '@/utils/animations';
import { v4 as uuidv4 } from 'uuid';
import { toast } from '@/components/ui/use-toast';
import OpenAIService from '@/services/openai';

const getAIResponse = async (
  message: string, 
  conversationHistory: ChatMessage[]
): Promise<string> => {
  try {
    // In a real implementation, you would call an actual AI API here
    // For demo purposes, we'll use a more sophisticated response system
    
    // Simulate network delay (1-2 seconds)
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    const lowerMessage = message.toLowerCase();
    const context = conversationHistory.map(msg => msg.content).join(" ").toLowerCase();
    
    // Check for conversation stage based on history length and content
    const isInitialInteraction = conversationHistory.length <= 2;
    const hasMentionedEducation = context.includes('education') || context.includes('degree') || context.includes('study');
    const hasMentionedSkills = context.includes('skill') || context.includes('ability') || context.includes('strength');
    const hasMentionedInterests = context.includes('interest') || context.includes('hobby') || context.includes('passion');
    const hasMentionedPersonality = context.includes('personality') || context.includes('trait') || context.includes('character');
    
    // Determine user's stage in the career discovery process
    const stage = {
      exploration: isInitialInteraction || lowerMessage.includes('explore') || lowerMessage.includes('discover'),
      guidance: context.includes('guidance') || lowerMessage.includes('guide') || lowerMessage.includes('advice'),
      specificCareer: lowerMessage.includes('software') || lowerMessage.includes('doctor') || lowerMessage.includes('teacher'),
      confused: lowerMessage.includes('confused') || lowerMessage.includes('unsure') || lowerMessage.includes('don\'t know'),
    };

    // Detect specific career inquiries
    const careerMentions = {
      tech: lowerMessage.includes('tech') || lowerMessage.includes('developer') || lowerMessage.includes('programming'),
      healthcare: lowerMessage.includes('health') || lowerMessage.includes('doctor') || lowerMessage.includes('nurse'),
      education: lowerMessage.includes('teach') || lowerMessage.includes('education') || lowerMessage.includes('professor'),
      business: lowerMessage.includes('business') || lowerMessage.includes('finance') || lowerMessage.includes('management'),
      creative: lowerMessage.includes('art') || lowerMessage.includes('design') || lowerMessage.includes('creative'),
    };
    
    // Education-related responses
    if (lowerMessage.includes('education') || lowerMessage.includes('degree') || 
        lowerMessage.includes('study') || lowerMessage.includes('learn')) {
      
      if (hasMentionedEducation) {
        // Follow-up questions about education
        const educationFollowups = [
          "How has your educational background shaped your career interests so far?",
          "Do you feel your education has prepared you well for the career path you're considering?",
          "Are there any additional qualifications or certifications you're thinking about pursuing?",
          "What aspects of your education did you find most engaging or valuable?",
          "How do you think your educational background differentiates you in the job market?"
        ];
        return educationFollowups[Math.floor(Math.random() * educationFollowups.length)];
      }
      
      return "Education is a key factor in career planning. Could you tell me about your educational background? What level of education have you completed, and in what fields or subjects?";
    }
    
    // Skills-related responses
    if (lowerMessage.includes('skill') || lowerMessage.includes('ability') || 
        lowerMessage.includes('good at') || lowerMessage.includes('strength')) {
      
      if (hasMentionedSkills) {
        // Follow-up on previously mentioned skills
        if (context.includes('technical') || context.includes('programming')) {
          return "Your technical skills are quite valuable. Have you considered how they might apply in emerging fields like AI, blockchain, or data science? These areas are projected to grow significantly in the coming years.";
        } else if (context.includes('communication') || context.includes('people')) {
          return "Strong interpersonal skills are highly transferable. Have you thought about roles in areas like HR, management, customer success, or sales where these skills are particularly valuable?";
        } else if (context.includes('creative') || context.includes('design')) {
          return "Creative skills are increasingly important in the digital economy. Have you explored UX/UI design, content creation, or digital marketing where these abilities can really shine?";
        }
      }
      
      return "Understanding your skills is crucial for finding the right career fit. What would you say are your top skills or strengths? These could be technical skills, soft skills, or natural abilities.";
    }
    
    // Interest-based responses
    if (lowerMessage.includes('interest') || lowerMessage.includes('hobby') || 
        lowerMessage.includes('enjoy') || lowerMessage.includes('passion')) {
      
      if (hasMentionedInterests) {
        // Provide more specific guidance based on interests
        if (context.includes('technology') || context.includes('computer')) {
          return "Your interest in technology could lead to various fulfilling careers. Beyond software development, have you considered fields like cybersecurity, data analysis, or technology consulting? Each offers different day-to-day experiences while leveraging a tech background.";
        } else if (context.includes('help') || context.includes('people')) {
          return "Your desire to help others could be fulfilled in many ways. Have you thought about careers in social work, counseling, healthcare, or even corporate social responsibility roles? Each allows you to make a positive impact in different ways.";
        } else if (context.includes('creative') || context.includes('art')) {
          return "Creative pursuits can lead to fulfilling careers. Beyond traditional art and design, have you explored roles in content creation, marketing, UI/UX design, or product development where creativity is highly valued?";
        }
      }
      
      return "Our interests often point to careers we'll find fulfilling. What activities or subjects genuinely interest you or make you lose track of time? What topics do you enjoy learning about?";
    }
    
    // Specific career inquiries
    if (careerMentions.tech) {
      return "The technology field offers diverse opportunities from software development to cybersecurity to AI research. With your background, would you prefer creating products, ensuring their security, analyzing data, or perhaps leading technical teams? Each path requires different skills and offers different rewards.";
    }
    
    if (careerMentions.healthcare) {
      return "Healthcare careers range from direct patient care roles like nursing to technical positions like medical imaging or administrative roles in healthcare management. Are you more drawn to working directly with patients, the technical aspects of healthcare, or the administrative side?";
    }
    
    if (careerMentions.education) {
      return "Careers in education extend beyond classroom teaching to instructional design, educational technology, administration, or educational policy. What aspects of education are you most passionate about? Working directly with students, developing curriculum, or perhaps shaping educational systems?";
    }
    
    if (careerMentions.business) {
      return "The business world encompasses finance, marketing, management, entrepreneurship, and many other specializations. Are you interested in analyzing financial data, developing marketing strategies, leading teams, or perhaps starting your own venture?";
    }
    
    if (careerMentions.creative) {
      return "Creative careers include graphic design, content creation, UI/UX design, writing, and many other fields. Do you prefer visual creative work, written content, or perhaps designing experiences? What mediums or tools do you enjoy working with most?";
    }
    
    // Career change guidance
    if (lowerMessage.includes('change') || lowerMessage.includes('transition') || lowerMessage.includes('switch')) {
      return "Career transitions can be both challenging and rewarding. What's motivating your desire for change? Understanding your transferable skills and core motivations will help guide this process. What aspects of your current work do you want to leave behind, and what would you like to find in your next role?";
    }
    
    // Preparation and pathway guidance
    if (lowerMessage.includes('prepare') || lowerMessage.includes('ready') || lowerMessage.includes('path')) {
      return "Career preparation typically involves a combination of education, skill development, networking, and gaining relevant experience. Based on our conversation, I'd recommend focusing on [specific area]. Would you like more detailed guidance on preparing for this path?";
    }
    
    // If confused or uncertain
    if (stage.confused) {
      return "It's completely normal to feel uncertain about career directions. Let's approach this step by step. First, let's identify what you enjoy doing and what you're good at. Then we can explore careers that match those strengths and interests. Could you share some activities or subjects that you naturally enjoy or excel at?";
    }
    
    // General responses based on conversation stage
    if (stage.exploration) {
      const explorationResponses = [
        "I'd like to understand more about your background. Could you tell me about your education, work experience, and what kinds of activities you find engaging?",
        "What kinds of work environments do you thrive in? Do you prefer structured settings or more flexible ones?",
        "Let's start by exploring your interests. What subjects or activities have consistently captured your attention throughout your life?",
        "What values are most important to you in a career? Financial security, work-life balance, making a difference, creative expression, or something else?",
        "If you could design your ideal workday, what would it look like? What activities would you be doing, and with whom?"
      ];
      return explorationResponses[Math.floor(Math.random() * explorationResponses.length)];
    }
    
    if (stage.guidance) {
      const guidanceResponses = [
        "Based on what you've shared, careers in [field] might align well with your profile. Would you like to explore some specific roles in this area?",
        "Have you considered careers that combine your interests in [topic1] and [topic2]? This intersection often leads to unique and fulfilling career paths.",
        "Your strengths in [skill] could be valuable in fields like [field1], [field2], or [field3]. Which of these areas sounds most appealing to you?",
        "Sometimes it helps to think about the problems you'd like to solve rather than specific job titles. What kinds of challenges would you find satisfying to work on?",
        "Would it be helpful if we explored some career assessment tools to further clarify your options? There are several reliable resources available."
      ];
      return guidanceResponses[Math.floor(Math.random() * guidanceResponses.length)];
    }
    
    // Default thoughtful response
    const thoughtfulResponses = [
      "Thank you for sharing that. To help you explore suitable career options, could you tell me more about what you're naturally good at and what kinds of tasks you find energizing rather than draining?",
      "That's helpful context. For better career guidance, it would be good to understand your preferred work style. Do you thrive in collaborative environments or prefer independent work? Do you enjoy variety or consistency in your daily tasks?",
      "I appreciate you sharing that information. Another important factor in career satisfaction is work-life alignment. How important is work-life balance, location flexibility, or schedule autonomy to you?",
      "Based on our conversation so far, I'm starting to see some patterns. Before I share some potential career directions, is there anything else you'd like me to know about your goals or constraints?",
      "Career decisions are often influenced by both practical and personal factors. Beyond skills and interests, are there other considerations like geographic location, salary expectations, or industry preferences that are important to you?"
    ];
    
    return thoughtfulResponses[Math.floor(Math.random() * thoughtfulResponses.length)];
  } catch (error) {
    console.error("Error generating AI response:", error);
    return "I'm sorry, I encountered an issue while processing your message. Could you please try again or rephrase your question?";
  }
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
  const [openAIAvailable, setOpenAIAvailable] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    const checkOpenAI = () => {
      const isInitialized = OpenAIService.isInitialized();
      setOpenAIAvailable(isInitialized);
    };

    checkOpenAI();
    
    const handleStorageChange = () => {
      checkOpenAI();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    const interval = setInterval(checkOpenAI, 5000);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (initialQuestion) {
      handleSendMessage();
    }
  }, []);

  const getOpenAIResponse = async (userMessage: string): Promise<string> => {
    try {
      const conversationHistory = messages.map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content
      }));
      
      const systemMessage = {
        role: 'system' as const,
        content: `You are a helpful career advisor. Your goal is to help users explore career options based on their skills, interests, education, and preferences. 
        Provide thoughtful, personalized career guidance. Ask follow-up questions to better understand the user's situation. 
        Be concise but thorough, avoiding overly generic advice. Focus on providing actionable insights and specific career paths that might suit the user.`
      };
      
      const userMessageObj = {
        role: 'user' as const,
        content: userMessage
      };
      
      const messagesToSend = [
        systemMessage,
        ...conversationHistory.slice(-10),
        userMessageObj
      ];
      
      const response = await OpenAIService.generateChatCompletion(messagesToSend, {
        temperature: 0.7,
        max_tokens: 500
      });
      
      return response;
    } catch (error) {
      console.error("Error with OpenAI:", error);
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
      let aiResponseText: string;
      
      if (openAIAvailable) {
        aiResponseText = await getOpenAIResponse(inputValue);
      } else {
        aiResponseText = await getAIResponse(inputValue, messages);
      }
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
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
            <p className="text-xs text-muted-foreground">
              {openAIAvailable 
                ? "Powered by OpenAI" 
                : "Using local AI (limited capabilities)"}
            </p>
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
      
      {!openAIAvailable && (
        <Alert variant="warning" className="m-4 bg-amber-50 dark:bg-amber-950/20">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            OpenAI API key not configured. Responses will use basic predefined logic.{" "}
            <span className="font-medium">Click the settings icon above to add your API key.</span>
          </AlertDescription>
        </Alert>
      )}
      
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
                <span className="text-sm text-muted-foreground">
                  {openAIAvailable ? "Processing with OpenAI..." : "Thinking..."}
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
