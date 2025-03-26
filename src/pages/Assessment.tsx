
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle, Loader2, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/components/ui/use-toast';
import { toast as sonnerToast } from 'sonner';
import TransitionLayout from '@/components/TransitionLayout';
import Navbar from '@/components/Navbar';
import GeminiService from '@/services/gemini';
import StorageService from '@/services/storage';
import { Sparkles } from 'lucide-react';
import { mbtiQuestions, calculateMBTIType, personalityDescriptions } from '@/utils/mbtiCalculator';

interface QuestionOption {
  value: string;
  label: string;
}

interface BaseQuestion {
  id: string;
  title: string;
  type: 'radio' | 'checkbox' | 'text' | 'textarea';
}

interface TextQuestion extends BaseQuestion {
  type: 'text' | 'textarea';
  placeholder: string;
}

interface ChoiceQuestion extends BaseQuestion {
  type: 'radio' | 'checkbox';
  options: QuestionOption[];
}

type Question = TextQuestion | ChoiceQuestion;

interface MBTIQuestion {
  id: string;
  title: string;
  type: 'radio';
  optionA?: string;
  optionB?: string;
}

const questions: Question[] = [
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
  const [isDataSaved, setIsDataSaved] = useState(false);
  const [mbtiAnswers, setMbtiAnswers] = useState<{[key: number]: 'A' | 'B'}>({});
  const [showingMbtiQuestions, setShowingMbtiQuestions] = useState(false);
  const [currentMbtiQuestionIndex, setCurrentMbtiQuestionIndex] = useState(0);
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const mbtiProgress = showingMbtiQuestions ? 
    ((currentMbtiQuestionIndex + 1) / mbtiQuestions.length) * 100 : 0;
  const regularProgress = !showingMbtiQuestions ? 
    ((currentStep + 1) / questions.length) * 100 : 0;
  
  const currentQuestion: Question | MBTIQuestion = !showingMbtiQuestions ? 
    questions[currentStep] : 
    { 
      id: `mbti-${mbtiQuestions[currentMbtiQuestionIndex].id}`, 
      title: "Which statement describes you better?", 
      type: "radio" 
    };
  
  useEffect(() => {
    const savedAnswers = StorageService.getAssessmentData();
    const savedMbtiAnswers = StorageService.get('mbti_answers');
    
    if (savedAnswers) {
      setAnswers(savedAnswers);
      setIsDataSaved(true);
      
      sonnerToast.success("Previous assessment data loaded", {
        description: "Your previous answers have been restored.",
      });
    }
    
    if (savedMbtiAnswers) {
      setMbtiAnswers(savedMbtiAnswers);
    }
  }, []);
  
  useEffect(() => {
    if (Object.keys(answers).length > 0) {
      StorageService.saveAssessmentData(answers);
      setIsDataSaved(true);
    }
  }, [answers]);
  
  useEffect(() => {
    if (Object.keys(mbtiAnswers).length > 0) {
      StorageService.set('mbti_answers', mbtiAnswers);
    }
  }, [mbtiAnswers]);
  
  const handleNext = () => {
    if (showingMbtiQuestions) {
      if (!mbtiAnswers[mbtiQuestions[currentMbtiQuestionIndex].id]) {
        toast({
          title: "Input Required",
          description: "Please answer the current question before proceeding.",
          variant: "destructive",
        });
        return;
      }
      
      if (currentMbtiQuestionIndex < mbtiQuestions.length - 1) {
        setCurrentMbtiQuestionIndex(currentMbtiQuestionIndex + 1);
      } else {
        processMbtiResults();
        setShowingMbtiQuestions(false);
        
        if (currentStep >= questions.length - 1) {
          handleComplete();
        } else {
          setCurrentStep(currentStep + 1);
        }
      }
    } else {
      const currentQuestionId = currentQuestion.id;
      
      if (!answers[currentQuestionId] || 
         (Array.isArray(answers[currentQuestionId]) && answers[currentQuestionId].length === 0)) {
        toast({
          title: "Input Required",
          description: "Please answer the current question before proceeding.",
          variant: "destructive",
        });
        return;
      }
      
      if (currentQuestion.id === 'personality') {
        setShowingMbtiQuestions(true);
        return;
      }
      
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleComplete();
      }
    }
  };
  
  const handleBack = () => {
    if (showingMbtiQuestions) {
      if (currentMbtiQuestionIndex > 0) {
        setCurrentMbtiQuestionIndex(currentMbtiQuestionIndex - 1);
      } else {
        setShowingMbtiQuestions(false);
      }
    } else {
      if (currentStep > 0) {
        setCurrentStep(currentStep - 1);
      }
    }
  };
  
  const jumpToQuestion = (index: number) => {
    if (showingMbtiQuestions) {
      setCurrentMbtiQuestionIndex(index);
    } else {
      setCurrentStep(index);
    }
  };
  
  const processMbtiResults = () => {
    const formattedAnswers = Object.entries(mbtiAnswers).map(([questionId, answer]) => ({
      questionId: parseInt(questionId),
      answer
    }));
    
    const mbtiType = calculateMBTIType(formattedAnswers);
    
    const personalityInfo = personalityDescriptions[mbtiType] || {
      description: "Your personality type combines several traits.",
      careers: []
    };
    
    StorageService.set('mbti_result', {
      type: mbtiType,
      description: personalityInfo.description,
      careers: personalityInfo.careers,
      timestamp: new Date().toISOString()
    });
    
    sonnerToast.success(`Your personality type is ${mbtiType}!`, {
      description: personalityInfo.description,
    });
  };
  
  const analyzeResultsWithGemini = async () => {
    try {
      const mbtiResult = StorageService.get('mbti_result');
      const mbtiType = mbtiResult ? mbtiResult.type : null;
      
      const userProfile = Object.entries(answers).map(([questionId, answer]) => {
        const question = questions.find(q => q.id === questionId);
        if (!question) return '';
        
        let answerText = '';
        if (Array.isArray(answer)) {
          const options = (question as ChoiceQuestion).options || [];
          const selectedOptions = options
            .filter(opt => answer.includes(opt.value))
            .map(opt => opt.label);
          answerText = selectedOptions.join(', ');
        } else if (typeof answer === 'string') {
          if ((question as ChoiceQuestion).options) {
            const option = (question as ChoiceQuestion).options.find(opt => opt.value === answer);
            answerText = option ? option.label : answer;
          } else {
            answerText = answer;
          }
        }
        
        return `${question.title}: ${answerText}`;
      }).join('\n');
      
      const prompt = `
Based on the following user profile for career assessment, identify the top 3 most suitable career matches.
Focus on providing detailed education paths, required qualifications, skills, and job opportunities.
For each match, provide a match score percentage (0-100).

USER PROFILE:
${userProfile}
${mbtiType ? `MBTI Personality Type: ${mbtiType}` : ''}
      
Respond in the following JSON format:
{
  "topMatches": [
    {"id": "career-id", "title": "Career Title", "matchScore": percentage, "description": "Brief reason why this matches", "educationPath": ["Step 1", "Step 2"], "requiredSkills": ["Skill 1", "Skill 2"], "jobOpportunities": ["Job 1", "Job 2"], "colleges": ["College 1", "College 2"], "exams": ["Exam 1", "Exam 2"]}
  ]
}

Choose career IDs from this list:
- computer-science
- medicine
- business-management
- engineering
- creative-arts
- education
- law
- science-research
      `;
      
      const messages = [
        {
          role: 'system' as const,
          content: 'You are a career assessment AI that analyzes user profiles and provides detailed career matches with education paths, skills, job opportunities, and top colleges in JSON format.'
        },
        {
          role: 'user' as const,
          content: prompt
        }
      ];
      
      const response = await GeminiService.generateChatCompletion(messages, {
        temperature: 0.3,
        max_tokens: 1500
      });
      
      try {
        const jsonMatch = response.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Invalid response format from Gemini');
        }
        
        const jsonResponse = JSON.parse(jsonMatch[0]);
        
        if (!jsonResponse.topMatches || !Array.isArray(jsonResponse.topMatches)) {
          throw new Error('Invalid response format from Gemini');
        }
        
        return jsonResponse.topMatches;
      } catch (parseError) {
        console.error('Error parsing Gemini response:', parseError);
        throw new Error('Failed to parse AI response');
      }
    } catch (error) {
      console.error('Error analyzing results with Gemini:', error);
      throw error;
    }
  };
  
  const analyzeResultsLocally = () => {
    const education = answers.education || '';
    const field = answers.field || '';
    const skills = answers.skills || [];
    const interests = answers.interests || [];
    const personality = answers.personality || '';
    const environments = answers.environments || [];
    const careerGoals = answers.career_goals || '';
    
    let careerScores = {
      'software-developer': 0,
      'data-scientist': 0,
      'healthcare-professional': 0,
      'financial-analyst': 0,
      'marketing-specialist': 0,
      'educator': 0,
      'creative-professional': 0,
      'management': 0,
      'research-scientist': 0,
      'legal-professional': 0
    };
    
    if (['bachelors', 'masters', 'doctorate'].includes(education)) {
      careerScores['data-scientist'] += 15;
      careerScores['research-scientist'] += 15;
      careerScores['legal-professional'] += 10;
    }
    
    if (['high-school', 'some-college', 'associates'].includes(education)) {
      careerScores['creative-professional'] += 10;
      careerScores['marketing-specialist'] += 5;
    }
    
    const fieldLower = field.toLowerCase();
    if (fieldLower.includes('comput') || fieldLower.includes('software') || fieldLower.includes('engineer')) {
      careerScores['software-developer'] += 20;
      careerScores['data-scientist'] += 15;
    }
    
    if (fieldLower.includes('business') || fieldLower.includes('management') || fieldLower.includes('econom')) {
      careerScores['financial-analyst'] += 20;
      careerScores['management'] += 15;
      careerScores['marketing-specialist'] += 10;
    }
    
    if (fieldLower.includes('health') || fieldLower.includes('medic') || fieldLower.includes('nurs')) {
      careerScores['healthcare-professional'] += 25;
    }
    
    if (fieldLower.includes('educat') || fieldLower.includes('teach')) {
      careerScores['educator'] += 25;
    }
    
    if (fieldLower.includes('art') || fieldLower.includes('design') || fieldLower.includes('creativ')) {
      careerScores['creative-professional'] += 25;
    }
    
    if (fieldLower.includes('law') || fieldLower.includes('legal')) {
      careerScores['legal-professional'] += 25;
    }
    
    if (fieldLower.includes('science') || fieldLower.includes('research') || fieldLower.includes('biology') || fieldLower.includes('chemistry')) {
      careerScores['research-scientist'] += 25;
      careerScores['data-scientist'] += 10;
    }
    
    if (skills.includes('programming')) {
      careerScores['software-developer'] += 15;
      careerScores['data-scientist'] += 10;
    }
    
    if (skills.includes('analytics')) {
      careerScores['data-scientist'] += 15;
      careerScores['financial-analyst'] += 15;
      careerScores['research-scientist'] += 10;
    }
    
    if (skills.includes('leadership')) {
      careerScores['management'] += 15;
      careerScores['educator'] += 5;
    }
    
    if (skills.includes('writing')) {
      careerScores['marketing-specialist'] += 10;
      careerScores['legal-professional'] += 10;
      careerScores['creative-professional'] += 10;
    }
    
    if (skills.includes('design')) {
      careerScores['creative-professional'] += 15;
      careerScores['marketing-specialist'] += 5;
    }
    
    if (interests.includes('technology')) {
      careerScores['software-developer'] += 15;
      careerScores['data-scientist'] += 10;
    }
    
    if (interests.includes('business')) {
      careerScores['financial-analyst'] += 15;
      careerScores['management'] += 15;
      careerScores['marketing-specialist'] += 10;
    }
    
    if (interests.includes('healthcare')) {
      careerScores['healthcare-professional'] += 20;
    }
    
    if (interests.includes('education')) {
      careerScores['educator'] += 20;
    }
    
    if (interests.includes('arts')) {
      careerScores['creative-professional'] += 20;
    }
    
    if (interests.includes('law')) {
      careerScores['legal-professional'] += 20;
    }
    
    if (interests.includes('sciences')) {
      careerScores['research-scientist'] += 20;
      careerScores['data-scientist'] += 10;
    }
    
    if (personality === 'analytical') {
      careerScores['data-scientist'] += 10;
      careerScores['financial-analyst'] += 10;
      careerScores['research-scientist'] += 10;
    }
    
    if (personality === 'creative') {
      careerScores['creative-professional'] += 15;
      careerScores['marketing-specialist'] += 10;
    }
    
    if (personality === 'social') {
      careerScores['educator'] += 15;
      careerScores['healthcare-professional'] += 10;
      careerScores['marketing-specialist'] += 10;
    }
    
    if (personality === 'leadership') {
      careerScores['management'] += 15;
    }
    
    const careerMatches = Object.entries(careerScores).map(([id, score]) => {
      const percentage = Math.min(Math.round(score), 100);
      return { id, matchScore: percentage };
    }).sort((a, b) => b.matchScore - a.matchScore);
    
    const topMatches = careerMatches.slice(0, 3);
    
    return topMatches;
  };
  
  const handleComplete = async () => {
    setLoading(true);
    
    try {
      let results;
      
      try {
        results = await analyzeResultsWithGemini();
      } catch (error) {
        console.error('Gemini analysis failed, using local fallback:', error);
        results = analyzeResultsLocally();
      }
      
      const mbtiResult = StorageService.get('mbti_result');
      
      StorageService.set('assessmentResults', {
        topMatches: results,
        answers,
        mbtiType: mbtiResult ? mbtiResult.type : null,
        timestamp: new Date().toISOString(),
        aiPowered: true
      });
      
      sonnerToast.success("Assessment completed successfully!", {
        description: "Navigating to your personalized career pathway...",
      });
      
      setTimeout(() => {
        setLoading(false);
        navigate('/pathway');
      }, 1500);
    } catch (error) {
      console.error('Error completing assessment:', error);
      setLoading(false);
      
      toast({
        title: "Error",
        description: "An error occurred while analyzing your results. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  const handleResetAssessment = () => {
    if (confirm("Are you sure you want to reset all your answers? This cannot be undone.")) {
      StorageService.clearAssessmentData();
      StorageService.set('mbti_answers', {});
      setAnswers({});
      setMbtiAnswers({});
      setCurrentStep(0);
      setCurrentMbtiQuestionIndex(0);
      setShowingMbtiQuestions(false);
      setIsDataSaved(false);
      
      sonnerToast.info("Assessment reset", {
        description: "All your answers have been cleared.",
      });
    }
  };
  
  const handleInputChange = (questionId: string, value: string | string[]) => {
    setAnswers({ ...answers, [questionId]: value });
    setIsDataSaved(false);
  };
  
  const handleMbtiAnswer = (answer: 'A' | 'B') => {
    setMbtiAnswers({ 
      ...mbtiAnswers, 
      [mbtiQuestions[currentMbtiQuestionIndex].id]: answer 
    });
  };
  
  const renderQuestionInput = () => {
    if (showingMbtiQuestions) {
      return renderMbtiQuestionInput();
    }
    
    const question = currentQuestion as Question;
    
    switch (question.type) {
      case 'text':
        return (
          <Input
            placeholder={(question as TextQuestion).placeholder || ''}
            value={answers[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            className="w-full"
          />
        );
      
      case 'textarea':
        return (
          <Textarea
            placeholder={(question as TextQuestion).placeholder || ''}
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
            {(question as ChoiceQuestion).options && (question as ChoiceQuestion).options.map((option) => (
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
            {(question as ChoiceQuestion).options && (question as ChoiceQuestion).options.map((option) => (
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
  
  const renderMbtiQuestionInput = () => {
    const question = mbtiQuestions[currentMbtiQuestionIndex];
    
    return (
      <RadioGroup
        value={mbtiAnswers[question.id]}
        onValueChange={(value: 'A' | 'B') => handleMbtiAnswer(value)}
        className="space-y-4"
      >
        <div className="flex items-start space-x-2 p-4 border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
          <RadioGroupItem value="A" id={`option-a-${question.id}`} className="mt-1" />
          <Label htmlFor={`option-a-${question.id}`} className="cursor-pointer flex-1">
            {question.optionA}
          </Label>
        </div>
        
        <div className="flex items-start space-x-2 p-4 border rounded-lg hover:bg-secondary/30 transition-colors cursor-pointer">
          <RadioGroupItem value="B" id={`option-b-${question.id}`} className="mt-1" />
          <Label htmlFor={`option-b-${question.id}`} className="cursor-pointer flex-1">
            {question.optionB}
          </Label>
        </div>
      </RadioGroup>
    );
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
    <TransitionLayout>
      <Navbar />
      <div className="min-h-screen pt-24 pb-12 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-4">
              Career Assessment
            </h1>
            <div className="flex items-center justify-center">
              <p className="text-xl text-muted-foreground max-w-2xl">
                Answer a few questions to help us find the best career matches for you.
              </p>
            </div>
            <p className="text-sm text-primary mt-2 flex items-center justify-center gap-2">
              <Sparkles className="h-4 w-4" />
              Powered by Google Gemini AI
            </p>
          </div>
          
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              {showingMbtiQuestions ? (
                <>
                  <span>Personality Question {currentMbtiQuestionIndex + 1} of {mbtiQuestions.length}</span>
                  <span>{Math.round(mbtiProgress)}% Complete</span>
                </>
              ) : (
                <>
                  <span>Question {currentStep + 1} of {questions.length}</span>
                  <span>{Math.round(regularProgress)}% Complete</span>
                </>
              )}
            </div>
            <Progress value={showingMbtiQuestions ? mbtiProgress : regularProgress} className="h-2" />
          </div>
          
          <div className="mb-4 overflow-x-auto">
            <div className="flex space-x-2 min-w-max py-2">
              {!showingMbtiQuestions ? (
                questions.map((q, index) => (
                  <Button
                    key={q.id}
                    variant={currentStep === index ? "default" : answers[q.id] ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => jumpToQuestion(index)}
                    className={`text-xs px-3 ${answers[q.id] ? "border-green-500" : ""} ${currentStep === index ? "pointer-events-none" : ""}`}
                  >
                    {index + 1}. {q.id.charAt(0).toUpperCase() + q.id.slice(1).replace('_', ' ')}
                  </Button>
                ))
              ) : (
                mbtiQuestions.map((q, index) => (
                  <Button
                    key={q.id}
                    variant={currentMbtiQuestionIndex === index ? "default" : mbtiAnswers[q.id] ? "outline" : "ghost"}
                    size="sm"
                    onClick={() => jumpToQuestion(index)}
                    className={`text-xs px-3 ${mbtiAnswers[q.id] ? "border-green-500" : ""} ${currentMbtiQuestionIndex === index ? "pointer-events-none" : ""}`}
                  >
                    {index + 1}
                  </Button>
                ))
              )}
            </div>
          </div>
          
          <Card className="mb-8">
            <CardContent className="p-6 md:p-8">
              <motion.div
                key={showingMbtiQuestions ? `mbti-${currentMbtiQuestionIndex}` : currentQuestion.id}
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={fadeVariants}
                className="space-y-6"
              >
                {showingMbtiQuestions ? (
                  <>
                    <h2 className="text-xl font-semibold mb-4">
                      {currentMbtiQuestionIndex + 1}. Which of the following statements describe you more?
                    </h2>
                    {renderMbtiQuestionInput()}
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold mb-4">{currentQuestion.title}</h2>
                    {renderQuestionInput()}
                  </>
                )}
              </motion.div>
            </CardContent>
          </Card>
          
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 0 && !showingMbtiQuestions || loading}
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back
              </Button>
              
              <Button 
                variant="outline" 
                onClick={handleResetAssessment} 
                disabled={loading || (Object.keys(answers).length === 0 && Object.keys(mbtiAnswers).length === 0)}
                className="text-destructive border-destructive hover:bg-destructive/10"
              >
                Reset
              </Button>
            </div>
            
            <Button 
              onClick={handleNext} 
              disabled={loading}
              className="relative"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : showingMbtiQuestions && currentMbtiQuestionIndex === mbtiQuestions.length - 1 ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Finish Personality Test
                </>
              ) : !showingMbtiQuestions && currentStep === questions.length - 1 ? (
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
              
              {!isDataSaved && !loading && (
                <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-amber-500 animate-pulse">
                  <span className="sr-only">Unsaved changes</span>
                </span>
              )}
            </Button>
          </div>
          
          <div className="flex justify-center mt-4">
            <div className="text-xs text-muted-foreground flex items-center">
              <Save className="h-3 w-3 mr-1" />
              Progress auto-saved. You can continue later.
            </div>
          </div>
        </div>
      </div>
    </TransitionLayout>
  );
};

export default Assessment;
