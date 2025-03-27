
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { mbtiQuestions, calculateMBTIType, personalityDescriptions } from '@/utils/mbtiCalculator';
import StorageService from '@/services/storage';
import { useIsMobile } from '@/hooks/use-mobile';

const MBTIAssessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: 'A' | 'B'}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  
  const currentQuestion = mbtiQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mbtiQuestions.length) * 100;
  
  // Load saved answers from storage on mount
  useEffect(() => {
    const savedMBTIAnswers = StorageService.get('mbti_answers');
    if (savedMBTIAnswers) {
      setAnswers(savedMBTIAnswers);
      toast.info("Previous answers loaded", {
        description: "You can continue from where you left off."
      });
    }
  }, []);
  
  // Save answers when they change
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      StorageService.set('mbti_answers', answers);
    }
  }, [answers]);
  
  const handleAnswer = (answer: 'A' | 'B') => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
    
    // Only auto-advance if this is a new answer (not changing an existing one)
    if (!answers[currentQuestion.id]) {
      // Automatically move to the next question after answering
      if (currentQuestionIndex < mbtiQuestions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      }
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const jumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index);
  };
  
  const handleComplete = () => {
    if (Object.keys(answers).length < mbtiQuestions.length) {
      toast.warning("Please answer all questions before submitting");
      return;
    }
    
    setIsSubmitting(true);
    
    // Convert answers to format needed for calculation
    const formattedAnswers = Object.entries(answers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer
    }));
    
    // Calculate MBTI type
    const mbtiType = calculateMBTIType(formattedAnswers);
    
    // Get personality information
    const personalityInfo = personalityDescriptions[mbtiType] || {
      description: "Your personality type combines several traits.",
      careers: []
    };
    
    // Save MBTI results to storage for later use
    StorageService.set('mbti_result', {
      type: mbtiType,
      description: personalityInfo.description,
      careers: personalityInfo.careers,
      timestamp: new Date().toISOString()
    });
    
    toast.success(`Your personality type is ${mbtiType}!`, {
      description: personalityInfo.description,
    });
    
    // Delay navigation to let the user see the toast
    setTimeout(() => {
      // Navigate to chat with the MBTI type as a parameter
      navigate(`/chat?mbti=${mbtiType}`);
      setIsSubmitting(false);
    }, 2000);
  };
  
  const resetAssessment = () => {
    if (confirm("Are you sure you want to reset all your answers?")) {
      setAnswers({});
      setCurrentQuestionIndex(0);
      StorageService.set('mbti_answers', {});
      toast.info("Assessment reset", {
        description: "All answers have been cleared."
      });
    }
  };
  
  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.3,
        ease: [0.19, 1, 0.22, 1],
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.2,
        ease: [0.19, 1, 0.22, 1],
      } 
    },
  };
  
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Question {currentQuestionIndex + 1} of {mbtiQuestions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      {/* Question Navigation */}
      <div className="mb-4 overflow-x-auto">
        <div className="flex space-x-2 min-w-max py-2">
          {mbtiQuestions.map((q, index) => (
            <Button
              key={q.id}
              variant={currentQuestionIndex === index ? "default" : answers[q.id] ? "outline" : "ghost"}
              size="sm"
              onClick={() => jumpToQuestion(index)}
              className={`text-xs px-3 ${answers[q.id] ? "border-green-500" : ""} ${currentQuestionIndex === index ? "pointer-events-none" : ""}`}
            >
              {index + 1}
            </Button>
          ))}
        </div>
      </div>
      
      {/* Question Title */}
      <motion.div
        key={`title-${currentQuestion.id}`}
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={fadeVariants}
        className="text-center mb-6"
      >
        <h2 className="text-xl md:text-2xl font-semibold">
          Which statement describes you better?
        </h2>
      </motion.div>
      
      {/* Side-by-side choice boxes */}
      <div className={`grid grid-cols-1 ${isMobile ? "gap-4" : "md:grid-cols-2 gap-6"} mb-8`}>
        <motion.div
          key={`option-a-${currentQuestion.id}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={() => handleAnswer('A')}
            className={`w-full h-full min-h-[150px] p-6 md:p-8 rounded-xl text-left flex flex-col justify-center transition-all duration-200 ${
              answers[currentQuestion.id] === 'A' 
                ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300' 
                : 'bg-secondary/70 hover:bg-secondary hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                answers[currentQuestion.id] === 'A' ? 'bg-white text-blue-500' : 'border border-primary/50'
              }`}>
                {answers[currentQuestion.id] === 'A' ? <CheckCircle className="h-5 w-5" /> : <span className="text-sm">A</span>}
              </div>
              <span className="text-lg">{currentQuestion.optionA}</span>
            </div>
          </button>
        </motion.div>
        
        <motion.div
          key={`option-b-${currentQuestion.id}`}
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={fadeVariants}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            onClick={() => handleAnswer('B')}
            className={`w-full h-full min-h-[150px] p-6 md:p-8 rounded-xl text-left flex flex-col justify-center transition-all duration-200 ${
              answers[currentQuestion.id] === 'B' 
                ? 'bg-green-500 text-white shadow-lg ring-2 ring-green-300' 
                : 'bg-secondary/70 hover:bg-secondary hover:shadow-md'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                answers[currentQuestion.id] === 'B' ? 'bg-white text-green-500' : 'border border-primary/50'
              }`}>
                {answers[currentQuestion.id] === 'B' ? <CheckCircle className="h-5 w-5" /> : <span className="text-sm">B</span>}
              </div>
              <span className="text-lg">{currentQuestion.optionB}</span>
            </div>
          </button>
        </motion.div>
      </div>
      
      <div className="flex justify-between">
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentQuestionIndex === 0 || isSubmitting}
          >
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          
          <Button 
            variant="outline" 
            onClick={resetAssessment} 
            disabled={isSubmitting || Object.keys(answers).length === 0}
            className="text-destructive border-destructive hover:bg-destructive/10"
          >
            Reset
          </Button>
        </div>
        
        {currentQuestionIndex === mbtiQuestions.length - 1 ? (
          <Button 
            onClick={handleComplete} 
            disabled={isSubmitting || !answers[currentQuestion.id]}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <CheckCircle className="mr-2 h-4 w-4" />
                See Results
              </>
            )}
          </Button>
        ) : (
          <Button
            onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
            disabled={!answers[currentQuestion.id]}
          >
            Next
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Progress Saving Indicator */}
      <div className="flex justify-center mt-4">
        <div className="text-xs text-muted-foreground flex items-center">
          <Save className="h-3 w-3 mr-1" />
          Progress auto-saved. You can continue later.
        </div>
      </div>
    </div>
  );
};

export default MBTIAssessment;
