
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import ChatInterface from '@/components/ChatInterface';
import { useSearchParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';

const Chat = () => {
  const [searchParams] = useSearchParams();
  const initialQuestion = searchParams.get('question') || undefined;
  
  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Chat with Your Career Assistant
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ask questions about careers, required qualifications, job outlook, or any other career-related topics.
            </p>
          </div>
          
          <ChatInterface initialQuestion={initialQuestion} />
        </div>
      </div>
      <Toaster />
    </TransitionLayout>
  );
};

export default Chat;
