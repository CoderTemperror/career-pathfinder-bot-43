
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, RotateCcw, Loader2, PencilLine, X, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar } from '@/components/ui/avatar';
import { ChatMessage } from '@/types';
import { chatMessageAnimation } from '@/utils/animations';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
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
      content: mbtiType ? 
        `Based on your assessment, your MBTI type is ${mbtiType}. This personality type has specific career strengths and preferences. How can I help you explore career paths that align with your ${mbtiType} personality type?` :
        "Hi there! I'm your Career Pathfinder assistant. I can help you discover suitable careers based on your background, skills, and interests. What would you like to explore today?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState(initialQuestion || "");
  const [isLoading, setIsLoading] = useState(false);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialQuestionSent = useRef(false);
  
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  useEffect(() => {
    // Update input value if initialQuestion changes
    if (initialQuestion) {
      setInputValue(initialQuestion);
    }
  }, [initialQuestion]);

  useEffect(() => {
    // Send initial question only once when component mounts
    if (initialQuestion && !initialQuestionSent.current) {
      initialQuestionSent.current = true;
      // Add a small delay to ensure the component is fully mounted
      const timer = setTimeout(() => {
        handleSendMessage();
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [initialQuestion]);

  const getAIResponse = async (userMessage: string): Promise<string> => {
    try {
      // Create a system prompt with career guidance instructions
      const systemPrompt = `You are a helpful career advisor. Your goal is to help users explore career options based on their skills, interests, education, and preferences. 
        Provide thoughtful, personalized career guidance. Ask follow-up questions to better understand the user's situation. 
        Be concise but thorough, avoiding overly generic advice. Focus on providing actionable insights and specific career paths that might suit the user.
        
        Only answer questions related to careers, education, colleges, exams, and professional development. 
        If asked about unrelated topics, politely explain that you can only assist with career guidance and education-related questions.
        
        When providing career recommendations, include:
        1. Educational paths and qualifications
        2. Top colleges in India and worldwide
        3. Required entrance exams or qualifications
        4. Skills needed for success
        5. Job profiles and opportunities
        6. Future scope and growth potential
        7. Salary ranges in different countries
        8. Potential challenges and advantages
        
        ${mbtiType ? `\nThe user's MBTI type is ${mbtiType}. Consider this personality type when providing career advice and suggestions.` : ''}`;
      
      // Send the system prompt as a separate message for the API
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userMessage
        }
      ];
      
      const response = await GeminiService.generateChatCompletion(messages);
      
      return response;
    } catch (error) {
      console.error("Error with AI:", error);
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
      const aiResponseText = await getAIResponse(inputValue);
      
      const aiMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      toast.error("Failed to get a response. Please try again.");
      
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
    
    toast.success("Started a new conversation");
  };
  
  const startEditing = (message: ChatMessage) => {
    if (message.role === 'user') {
      setEditingMessageId(message.id);
      setEditedContent(message.content);
    }
  };
  
  const cancelEditing = () => {
    setEditingMessageId(null);
    setEditedContent("");
  };
  
  const saveEdit = (messageId: string) => {
    if (editedContent.trim() === "") return;
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content: editedContent }
          : msg
      )
    );
    
    setEditingMessageId(null);
    setEditedContent("");
  };
  
  const resendMessage = (message: ChatMessage) => {
    if (isLoading) return;
    
    setInputValue(message.content);
    // Don't immediately send to allow user to edit if needed
  };

  return (
    <div className={`flex flex-col w-full h-[80vh] max-h-[80vh] overflow-hidden rounded-xl glass border shadow-sm ${className}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-medium">Career Assistant</h3>
            <p className="text-xs text-muted-foreground">Powered by AI</p>
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
                  <Bot className="w-4 h-4" />
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
                {editingMessageId === message.id ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editedContent}
                      onChange={(e) => setEditedContent(e.target.value)}
                      className="min-h-[100px] bg-background/80 text-foreground"
                      placeholder="Edit your message..."
                    />
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={cancelEditing}
                      >
                        <X className="w-3 h-3 mr-1" /> Cancel
                      </Button>
                      <Button 
                        size="sm" 
                        onClick={() => saveEdit(message.id)}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    {message.role === 'assistant' ? (
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          p: ({ node, ...props }) => (
                            <p className="text-sm whitespace-pre-wrap" {...props} />
                          ),
                          a: ({ node, ...props }) => (
                            <a className="text-blue-500 hover:underline" {...props} target="_blank" rel="noopener noreferrer" />
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
                      {message.role === 'user' && (
                        <div className="flex gap-1">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 rounded-full hover:bg-primary-foreground/10"
                            onClick={() => startEditing(message)}
                          >
                            <PencilLine className="h-3 w-3" />
                            <span className="sr-only">Edit message</span>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-5 w-5 rounded-full hover:bg-primary-foreground/10"
                            onClick={() => resendMessage(message)}
                          >
                            <MessageSquare className="h-3 w-3" />
                            <span className="sr-only">Reuse message</span>
                          </Button>
                        </div>
                      )}
                      <span className={`text-xs ${message.role === 'user' ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </>
                )}
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
              <Bot className="w-4 h-4" />
            </Avatar>
            <div className="p-4 rounded-xl max-w-[80%] bg-secondary">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
                <span className="text-sm text-muted-foreground ml-2">
                  Thinking...
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
            placeholder="Type your message... (career & education guidance only)"
            className="resize-none min-h-[56px] max-h-[140px] font-medium"
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
