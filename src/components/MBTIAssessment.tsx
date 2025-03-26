
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { mbtiQuestions, calculateMBTIType, personalityDescriptions } from '@/utils/mbtiCalculator';

const MBTIAssessment = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{[key: number]: 'A' | 'B'}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  
  const currentQuestion = mbtiQuestions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / mbtiQuestions.length) * 100;
  
  const handleAnswer = (answer: 'A' | 'B') => {
    setAnswers({ ...answers, [currentQuestion.id]: answer });
    
    // Automatically move to the next question after answering
    if (currentQuestionIndex < mbtiQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
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
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="mb-4">
        <div className="flex justify-between text-sm mb-2">
          <span>Question {currentQuestionIndex + 1} of {mbtiQuestions.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
      
      <Card className="mb-8">
        <CardContent className="p-6 md:p-8">
          <motion.div
            key={currentQuestion.id}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeVariants}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold mb-4">
              {currentQuestionIndex + 1}. Which of the following statements describe you more?
            </h2>
            
            <RadioGroup
              value={answers[currentQuestion.id]}
              onValueChange={(value: 'A' | 'B') => handleAnswer(value)}
              className="space-y-4"
            >
              <div className="flex items-start space-x-2 p-4 border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
                <RadioGroupItem value="A" id={`option-a-${currentQuestion.id}`} className="mt-1" />
                <Label htmlFor={`option-a-${currentQuestion.id}`} className="cursor-pointer flex-1">
                  {currentQuestion.optionA}
                </Label>
              </div>
              
              <div className="flex items-start space-x-2 p-4 border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
                <RadioGroupItem value="B" id={`option-b-${currentQuestion.id}`} className="mt-1" />
                <Label htmlFor={`option-b-${currentQuestion.id}`} className="cursor-pointer flex-1">
                  {currentQuestion.optionB}
                </Label>
              </div>
            </RadioGroup>
          </motion.div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentQuestionIndex === 0 || isSubmitting}
        >
          <ArrowLeft className="mr-2 w-4 h-4" />
          Back
        </Button>
        
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
    </div>
  );
};

export default MBTIAssessment;
