
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Settings, Check, X } from 'lucide-react';
import OpenAIService from '@/services/openai';
import { toast } from '@/components/ui/use-toast';

const OpenAIConfig = () => {
  const [apiKey, setApiKey] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if API key is stored in localStorage
    const storedApiKey = localStorage.getItem('openai_api_key');
    if (storedApiKey) {
      setApiKey(storedApiKey);
      try {
        OpenAIService.initialize({ apiKey: storedApiKey });
        setIsInitialized(true);
      } catch (error) {
        console.error('Failed to initialize OpenAI service:', error);
      }
    }
  }, []);

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API key cannot be empty",
        variant: "destructive",
      });
      return;
    }

    try {
      OpenAIService.initialize({ apiKey });
      localStorage.setItem('openai_api_key', apiKey);
      setIsInitialized(true);
      toast({
        title: "Success",
        description: "OpenAI API key saved successfully",
      });
      setIsOpen(false);
    } catch (error) {
      console.error('Failed to initialize OpenAI service:', error);
      toast({
        title: "Error",
        description: "Failed to initialize OpenAI service",
        variant: "destructive",
      });
    }
  };

  const handleClearApiKey = () => {
    localStorage.removeItem('openai_api_key');
    setApiKey('');
    setIsInitialized(false);
    toast({
      title: "Success",
      description: "OpenAI API key removed",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="relative">
          <Settings className="h-4 w-4" />
          {isInitialized && (
            <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-green-500">
              <span className="sr-only">OpenAI connected</span>
            </span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>OpenAI API Configuration</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Enter your OpenAI API key to enable AI-powered career guidance.
            </p>
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser and is never sent to our servers.
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button onClick={handleSaveApiKey}>Save</Button>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <p className="text-sm font-medium">Status:</p>
              <p className="text-sm text-muted-foreground flex items-center">
                {isInitialized ? (
                  <>
                    <Check className="h-3 w-3 text-green-500 mr-1" />
                    Connected
                  </>
                ) : (
                  <>
                    <X className="h-3 w-3 text-destructive mr-1" />
                    Not connected
                  </>
                )}
              </p>
            </div>
            {isInitialized && (
              <Button variant="destructive" size="sm" onClick={handleClearApiKey}>
                Clear API Key
              </Button>
            )}
          </div>
          <Separator />
          <div className="space-y-2">
            <p className="text-xs text-muted-foreground">
              Don't have an API key? Get one from{" "}
              <a
                href="https://platform.openai.com/api-keys"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                OpenAI's website
              </a>.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OpenAIConfig;
