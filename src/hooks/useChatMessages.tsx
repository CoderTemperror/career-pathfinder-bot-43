
import { useState, useEffect, useRef } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import GeminiService from '@/services/gemini';
import storageService from '@/services/storage';
import type { ChatMessage } from '@/types';

interface UseChatMessagesOptions {
  initialQuestion?: string;
  mbtiType?: string; 
}

export function useChatMessages({ initialQuestion, mbtiType }: UseChatMessagesOptions = {}) {
  const defaultWelcomeMessage = mbtiType ? 
    `Based on your assessment, your MBTI type is ${mbtiType}. This personality type has specific career strengths and preferences. How can I help you explore career paths that align with your ${mbtiType} personality type?` :
    "Hi there! I'm your Career Pathfinder assistant. I can help you discover suitable careers based on your background, skills, and interests. What would you like to explore today?";

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState(initialQuestion || "");
  const [isLoading, setIsLoading] = useState(false);
  const initialQuestionSent = useRef(false);
  
  // Load chat history on initial render
  useEffect(() => {
    const savedMessages = storageService.getChatHistory();
    
    if (savedMessages && savedMessages.length > 0) {
      // Convert date strings back to Date objects
      const processedMessages = savedMessages.map(msg => ({
        ...msg,
        timestamp: new Date(msg.timestamp)
      }));
      setMessages(processedMessages);
    } else {
      // Set default welcome message if no history exists
      setMessages([{
        id: '1',
        role: 'assistant' as 'assistant',
        content: defaultWelcomeMessage,
        timestamp: new Date(),
      }]);
    }
  }, [mbtiType, defaultWelcomeMessage]);

  // Save messages to local storage whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      storageService.saveChatHistory(messages);
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
          role: 'system' as 'system',
          content: systemPrompt
        },
        {
          role: 'user' as 'user',
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
      role: 'user' as 'user',
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
        role: 'assistant' as 'assistant',
        content: aiResponseText,
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("Error getting AI response:", error);
      
      toast.error("Failed to get a response. Please try again.");
      
      const errorMessage: ChatMessage = {
        id: uuidv4(),
        role: 'assistant' as 'assistant',
        content: "I'm sorry, I'm having trouble responding right now. Please try again later.",
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    const newWelcomeMessage: ChatMessage = {
      id: uuidv4(),
      role: 'assistant' as 'assistant',
      content: defaultWelcomeMessage,
      timestamp: new Date(),
    };
    
    setMessages([newWelcomeMessage]);
    storageService.clearChatHistory();
    storageService.saveChatHistory([newWelcomeMessage]);
    
    toast.success("Started a new conversation");
  };
  
  const handleEditMessage = (messageId: string, content: string) => {
    if (content.trim() === "") return;
    
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId 
          ? { ...msg, content }
          : msg
      )
    );
  };
  
  const handleReuseMessage = (message: ChatMessage) => {
    if (isLoading) return;
    setInputValue(message.content);
    // Don't immediately send to allow user to edit if needed
  };

  return {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    handleSendMessage,
    handleReset,
    handleEditMessage,
    handleReuseMessage
  };
}
