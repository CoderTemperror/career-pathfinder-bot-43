
import React from 'react';
import { Bot } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { ChatMessage } from '@/types';

interface AssistantMessageProps {
  message: ChatMessage;
}

const AssistantMessage = ({ message }: AssistantMessageProps) => {
  return (
    <div className="flex gap-3 items-start max-w-[90%]">
      <Avatar className="w-8 h-8 mt-1 bg-neutral-200 dark:bg-neutral-700 text-foreground flex items-center justify-center">
        <Bot className="w-4 h-4" />
      </Avatar>
      
      <div className="overflow-hidden">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            p: ({ node, ...props }) => (
              <p className="text-sm whitespace-pre-wrap mb-4" {...props} />
            ),
            a: ({ node, ...props }) => (
              <a className="text-blue-500 dark:text-blue-400 hover:underline" {...props} target="_blank" rel="noopener noreferrer" />
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
              <h1 className="text-lg font-bold my-3" {...props} />
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
                <code className="bg-muted px-1 py-0.5 rounded text-xs" {...props}>
                  {children}
                </code>
              ) : (
                <code className="block bg-muted p-2 my-2 rounded overflow-x-auto text-xs" {...props}>
                  {children}
                </code>
              );
            },
            pre: ({ node, ...props }) => (
              <pre className="bg-muted p-2 my-2 rounded overflow-x-auto text-xs" {...props} />
            ),
            blockquote: ({ node, ...props }) => (
              <blockquote className="border-l-4 border-blue-300 dark:border-blue-600 pl-4 my-2 italic text-muted-foreground" {...props} />
            ),
          }}
        >
          {message.content}
        </ReactMarkdown>
      </div>
    </div>
  );
};

export default AssistantMessage;
