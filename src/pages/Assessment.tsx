
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';

const Assessment = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the MBTI assessment page
    navigate('/mbti');
  }, [navigate]);
  
  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-xl font-semibold mb-4">Redirecting to MBTI Assessment...</h1>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Assessment;
