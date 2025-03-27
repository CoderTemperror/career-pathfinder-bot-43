
import { useRef } from 'react';
import { useChatMessages } from '@/hooks/useChatMessages';
import MessageList from './chat/MessageList';
import ChatInput from './chat/ChatInput';
import { useIsMobile } from '@/hooks/use-mobile';

interface ChatInterfaceProps {
  className?: string;
  initialQuestion?: string;
  mbtiType?: string;
}

const ChatInterface = ({ className = "", initialQuestion, mbtiType }: ChatInterfaceProps) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  
  const {
    messages,
    inputValue,
    setInputValue,
    isLoading,
    handleSendMessage,
    handleReset,
    handleEditMessage,
    handleReuseMessage
  } = useChatMessages({ initialQuestion, mbtiType });

  return (
    <div className="flex flex-col w-full h-full overflow-hidden">
      {/* Chat messages area */}
      <div 
        className="flex-1 overflow-y-auto scrollbar-thin bg-background" 
        ref={messagesContainerRef}
        tabIndex={-1}
      >
        <MessageList 
          messages={messages}
          isLoading={isLoading}
          onEditMessage={handleEditMessage}
          onReuseMessage={handleReuseMessage}
        />
      </div>
      
      {/* Chat input area - fixed at bottom */}
      <ChatInput
        inputValue={inputValue}
        setInputValue={setInputValue}
        onSendMessage={handleSendMessage}
        onReset={handleReset}
        isLoading={isLoading}
      />
    </div>
  );
};

export default ChatInterface;
