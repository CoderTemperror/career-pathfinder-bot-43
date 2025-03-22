
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Book, Award, Briefcase, GraduationCap, Clock } from 'lucide-react';
import { PathwayStep as PathwayStepType } from '@/types';

interface PathwayStepProps {
  step: PathwayStepType;
  index: number;
  isLast: boolean;
}

const PathwayStep = ({ step, index, isLast }: PathwayStepProps) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'Education':
        return <GraduationCap className="w-5 h-5" />;
      case 'Training':
        return <Book className="w-5 h-5" />;
      case 'Experience':
        return <Briefcase className="w-5 h-5" />;
      case 'Certification':
        return <Award className="w-5 h-5" />; // Changed from Certificate to Award
      default:
        return <Book className="w-5 h-5" />;
    }
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Education':
        return 'bg-blue-100 border-blue-200 text-blue-800';
      case 'Training':
        return 'bg-purple-100 border-purple-200 text-purple-800';
      case 'Experience':
        return 'bg-green-100 border-green-200 text-green-800';
      case 'Certification':
        return 'bg-amber-100 border-amber-200 text-amber-800';
      default:
        return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };
  
  return (
    <div className="relative">
      {/* Timeline connector */}
      {!isLast && (
        <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-border" />
      )}
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="mb-8 ml-12"
      >
        <div className="flex items-start gap-4">
          {/* Step number badge */}
          <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg -ml-12 z-10">
            {index + 1}
          </div>
          
          <Card className="w-full">
            <CardHeader className="pb-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-2">
                  <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getTypeColor(step.type)}`}>
                    <span className="mr-1.5">{getIcon(step.type)}</span>
                    {step.type}
                    {step.required && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-white/50 rounded-full text-[10px]">
                        Required
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg">{step.title}</CardTitle>
                </div>
                
                <div className="flex items-center text-sm text-muted-foreground">
                  <Clock className="w-4 h-4 mr-1" />
                  {step.duration}
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {step.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </motion.div>
    </div>
  );
};

export default PathwayStep;
