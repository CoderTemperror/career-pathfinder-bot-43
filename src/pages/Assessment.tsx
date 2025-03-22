
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';

const questions = [
  {
    id: 'education',
    title: 'What is your highest level of education?',
    type: 'radio',
    options: [
      { value: 'high-school', label: 'High School' },
      { value: 'some-college', label: 'Some College' },
      { value: 'associates', label: 'Associate\'s Degree' },
      { value: 'bachelors', label: 'Bachelor\'s Degree' },
      { value: 'masters', label: 'Master\'s Degree' },
      { value: 'doctorate', label: 'Doctorate or Professional Degree' },
    ],
  },
  {
    id: 'field',
    title: 'What field or major did you study?',
    type: 'text',
    placeholder: 'e.g., Computer Science, Business, Psychology...',
  },
  {
    id: 'skills',
    title: 'What skills do you have? (Select all that apply)',
    type: 'checkbox',
    options: [
      { value: 'programming', label: 'Programming/Coding' },
      { value: 'design', label: 'Design' },
      { value: 'writing', label: 'Writing' },
      { value: 'leadership', label: 'Leadership' },
      { value: 'problem-solving', label: 'Problem Solving' },
      { value: 'analytics', label: 'Data Analysis' },
      { value: 'communication', label: 'Communication' },
      { value: 'languages', label: 'Foreign Languages' },
      { value: 'project-management', label: 'Project Management' },
      { value: 'customer-service', label: 'Customer Service' },
    ],
  },
  {
    id: 'interests',
    title: 'What are your interests? (Select all that apply)',
    type: 'checkbox',
    options: [
      { value: 'technology', label: 'Technology' },
      { value: 'business', label: 'Business' },
      { value: 'healthcare', label: 'Healthcare' },
      { value: 'education', label: 'Education' },
      { value: 'arts', label: 'Arts/Entertainment' },
      { value: 'sciences', label: 'Sciences' },
      { value: 'law', label: 'Law/Legal' },
      { value: 'engineering', label: 'Engineering' },
      { value: 'environment', label: 'Environment' },
      { value: 'social-work', label: 'Social Work' },
    ],
  },
  {
    id: 'personality',
    title: 'How would you describe your work personality?',
    type: 'radio',
    options: [
      { value: 'analytical', label: 'Analytical & Logical' },
      { value: 'creative', label: 'Creative & Innovative' },
      { value: 'social', label: 'People-Oriented & Collaborative' },
      { value: 'detail', label: 'Detail-Oriented & Organized' },
      { value: 'leadership', label: 'Leadership & Decisive' },
      { value: 'adaptable', label: 'Adaptable & Flexible' },
    ],
  },
  {
    id: 'environments',
    title: 'What type of work environments do you prefer?',
    type: 'checkbox',
    options: [
      { value: 'remote', label: 'Remote Work' },
      { value: 'office', label: 'Traditional Office' },
      { value: 'hybrid', label: 'Hybrid (Mix of Remote and Office)' },
      { value: 'outdoors', label: 'Outdoors/Field Work' },
      { value: 'travel', label: 'Involves Travel' },
      { value: 'independent', label: 'Independent Work' },
      { value: 'team', label: 'Team-Based' },
    ],
  },
  {
    id: 'career_goals',
    title: 'What are your career goals?',
    type: 'textarea',
    placeholder: 'Describe your short and long-term career aspirations...',
  },
];

const Assessment = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  
  const handleNext = () => {
    const currentQuestionId = currentQuestion.id;
    
    // Validate current question has an answer
    if (!answers[currentQuestionId] || 
       (Array.isArray(answers[currentQuestionId]) && answers[currentQuestionId].length === 0)) {
      toast({
        title: "Input Required",
        description: "Please answer the current question before proceeding.",
        variant: "destructive",
      });
      return;
    }
    
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Assessment complete, process results
      handleComplete();
    }
  };
  
  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const handleComplete = () => {
    setLoading(true);
    
    // Simulate processing delay
    setTimeout(() => {
      setLoading(false);
      // Navigate to results page
      navigate('/pathway');
    }, 2000);
  };
  
  const handleInputChange = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
  };
  
  // Render different input types based on question type
  const renderQuestionInput = () => {
    const question = currentQuestion;
    
    switch (question.type) {
      case 'text':
        return (
          <Input
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            placeholder={question.placeholder}
            value={answers[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full min-h-[150px]"
          />
        );
      
      case 'radio':
        return (
          <RadioGroup
            value={answers[question.id] || ''}
            onValueChange={(value) => handleInputChange(question.id, value)}
            className="space-y-3"
          >
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value} id={option.value} />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        );
      
      case 'checkbox':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={option.value}
                  checked={(answers[question.id] || []).includes(option.value)}
                  onCheckedChange={(checked) => {
                    const currentValues = answers[question.id] || [];
                    const newValues = checked
                      ? [...currentValues, option.value]
                      : currentValues.filter((v: string) => v !== option.value);
                    handleInputChange(question.id, newValues);
                  }}
                />
                <Label htmlFor={option.value} className="cursor-pointer">
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        );
      
      default:
        return null;
    }
  };
  
  const fadeVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1],
      } 
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: {
        duration: 0.3,
        ease: [0.19, 1, 0.22, 1],
      } 
    },
  };
  
  return (
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Career Assessment
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Answer a few questions to help us find the best career matches for you.
            </p>
          </div>
          
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span>Question {currentStep + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Question card */}
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
                <h2 className="text-xl font-semibold mb-4">{currentQuestion.title}</h2>
                {renderQuestionInput()}
              </motion.div>
            </CardContent>
          </Card>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0 || loading}
            >
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back
            </Button>
            
            <Button onClick={handleNext} disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : currentStep === questions.length - 1 ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Complete
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Assessment;
