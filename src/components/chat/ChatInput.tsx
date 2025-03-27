
import React, { useState } from 'react';
import { Send, RotateCcw, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ChatInputProps {
  inputValue: string;
  setInputValue: (value: string) => void;
  onSendMessage: () => void;
  onReset: () => void;
  isLoading: boolean;
}

const ChatInput = ({ 
  inputValue, 
  setInputValue, 
  onSendMessage, 
  onReset, 
  isLoading 
}: ChatInputProps) => {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSendMessage();
  };
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t py-3 px-4 md:px-0 z-20">
      <div className="max-w-5xl mx-auto flex items-center">
        <Button
          variant="outline"
          size="icon"
          onClick={onReset}
          className="mr-2 h-9 w-9 rounded-full border-muted-foreground/30 hover:bg-muted transition-colors"
          title="Start new chat"
        >
          <RotateCcw className="h-4 w-4" />
        </Button>
        
        <form
          onSubmit={handleSubmit}
          className="flex-1 flex items-center relative"
        >
          <Textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Message Career Assistant..."
            className="resize-none min-h-[40px] max-h-[120px] text-sm pr-10 rounded-lg shadow-sm border-muted"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                onSendMessage();
              }
            }}
          />
          <Button 
            type="submit" 
            size="icon" 
            className={`absolute right-1.5 bottom-1 h-8 w-8 rounded-md ${
              !inputValue.trim() || isLoading 
                ? 'bg-muted text-muted-foreground hover:bg-muted cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-700'
            }`}
            disabled={!inputValue.trim() || isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInput;
