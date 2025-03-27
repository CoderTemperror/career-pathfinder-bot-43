
import React, { useState } from 'react';
import { PencilLine, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import type { ChatMessage } from '@/types';

interface UserMessageProps {
  message: ChatMessage;
  onEdit: (messageId: string, content: string) => void;
  onReuse: (message: ChatMessage) => void;
}

const UserMessage = ({ message, onEdit, onReuse }: UserMessageProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(message.content);

  const handleStartEditing = () => {
    setIsEditing(true);
    setEditedContent(message.content);
  };

  const handleCancelEditing = () => {
    setIsEditing(false);
    setEditedContent(message.content);
  };

  const handleSaveEdit = () => {
    if (editedContent.trim() === "") return;
    onEdit(message.id, editedContent);
    setIsEditing(false);
  };

  return (
    <div className="user-message max-w-[80%] break-words">
      {isEditing ? (
        <div>
          <Textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="mb-2 min-h-[30px] max-h-[60px] text-sm bg-blue-600 border-blue-400 text-white placeholder:text-blue-200 resize-none"
            autoFocus
          />
          <div className="flex justify-end gap-2">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleCancelEditing}
              className="text-white hover:bg-blue-700 h-7 px-2 py-0 text-xs"
            >
              Cancel
            </Button>
            <Button 
              size="sm" 
              onClick={handleSaveEdit}
              className="bg-white text-blue-600 hover:bg-blue-100 h-7 px-2 py-0 text-xs"
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="inline-block">
          <p className="text-sm whitespace-pre-wrap break-words py-2 px-3">{message.content}</p>
          <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 rounded-full hover:bg-blue-600"
              onClick={handleStartEditing}
              tabIndex={-1}
            >
              <PencilLine className="h-3 w-3 text-white" />
              <span className="sr-only">Edit message</span>
            </Button>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-5 w-5 rounded-full hover:bg-blue-600"
              onClick={() => onReuse(message)}
              tabIndex={-1}
            >
              <MessageSquare className="h-3 w-3 text-white" />
              <span className="sr-only">Reuse message</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMessage;
