
import React from 'react';
import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

const ThinkingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mb-6"
    >
      <div className="flex gap-3 items-start">
        <Avatar className="w-8 h-8 mt-1 bg-neutral-200 dark:bg-neutral-700 text-foreground flex items-center justify-center">
          <Bot className="w-4 h-4" />
        </Avatar>
        <div className="p-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.2s]" />
              <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            <span className="text-xs text-muted-foreground">
              Thinking...
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ThinkingIndicator;
