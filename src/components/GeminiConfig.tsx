
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, Key } from 'lucide-react';
import GeminiService from '@/services/gemini';

const GeminiConfig = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Check if Gemini service is initialized
    const isInit = GeminiService.isInitialized();
    setIsInitialized(isInit);
    
    // Initialize if not already initialized
    if (!isInit) {
      GeminiService.initialize();
    }
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="ml-2 relative" size="sm">
          <Key className="h-4 w-4 mr-2" />
          Gemini API Status
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500">
            <span className="sr-only">Gemini connected</span>
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Gemini API Configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Gemini API is pre-configured in this application. You don't need to provide an API key.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <p className="text-sm font-medium">Status:</p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Check className="h-3 w-3 text-green-500 mr-1" />
                Connected
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              This application uses the Google Gemini API to provide AI-powered career guidance.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GeminiConfig;
