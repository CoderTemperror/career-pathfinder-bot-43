
import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

interface SuggestedPromptsProps {
  onSelectPrompt: (prompt: string) => void;
}

const suggestedPrompts = [
  "What career paths are available in computer science?",
  "Which engineering fields have the best job prospects?",
  "What are the best medical career options in 2024?",
  "What qualifications do I need to become a data scientist?",
  "Compare business careers vs creative careers",
  "What careers are good for someone who loves working with people?",
  "Tell me about career options after completing 12th in science stream",
  "What careers are emerging in sustainability and environmental science?",
  "Compare top colleges for computer science in India and worldwide",
  "What exams do I need to prepare for a career in medicine?"
];

const SuggestedPrompts = ({ onSelectPrompt }: SuggestedPromptsProps) => {
  const [selectedPrompt, setSelectedPrompt] = useState<string | null>(null);

  const handlePromptClick = (prompt: string) => {
    setSelectedPrompt(prompt);
    onSelectPrompt(prompt);
    
    // Reset the selection after a delay
    setTimeout(() => {
      setSelectedPrompt(null);
    }, 1000);
  };

  return (
    <Card className="my-4">
      <CardContent className="p-4">
        <h3 className="text-sm font-medium mb-3">Suggested Career Questions:</h3>
        <div className="flex flex-wrap gap-2">
          {suggestedPrompts.map((prompt, index) => (
            <Button 
              key={index}
              variant="outline" 
              size="sm"
              className="text-xs justify-start"
              onClick={() => handlePromptClick(prompt)}
            >
              {selectedPrompt === prompt ? (
                <Check className="h-3 w-3 mr-1" />
              ) : null}
              {prompt.length > 40 ? `${prompt.substring(0, 40)}...` : prompt}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SuggestedPrompts;
