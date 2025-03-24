
import { motion } from 'framer-motion';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Career } from '@/types';
import { Briefcase, TrendingUp, DollarSign, CheckCircle, AlertCircle } from 'lucide-react';

export interface CareerCardProps {
  career: Career;
  isSelected?: boolean;
  onClick: () => void;
}

const CareerCard = ({ career, isSelected = false, onClick }: CareerCardProps) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className={`cursor-pointer h-full transition-all ${
          isSelected ? 'border-primary shadow-md' : 'hover:border-primary/50'
        }`}
        onClick={onClick}
      >
        <CardContent className="pt-6">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-primary" />
              <h3 className="font-semibold text-lg">{career.title}</h3>
            </div>
            <Badge variant={career.matchScore > 85 ? "default" : "secondary"}>
              {career.matchScore}% Match
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
            {career.description}
          </p>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <DollarSign className="h-4 w-4 text-green-500" />
              <span>
                {career.salary.currency}{career.salary.min.toLocaleString()} - {career.salary.currency}{career.salary.max.toLocaleString()}
              </span>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              {career.outlook === 'Excellent' && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-500" />
                  <span className="text-green-700">Excellent Outlook</span>
                </>
              )}
              {career.outlook === 'Good' && (
                <>
                  <CheckCircle className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-700">Good Outlook</span>
                </>
              )}
              {career.outlook === 'Fair' || career.outlook === 'Poor' && (
                <>
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                  <span className="text-amber-700">{career.outlook} Outlook</span>
                </>
              )}
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2">Key Skills</h4>
            <div className="flex flex-wrap gap-1">
              {career.skills.slice(0, 4).map((skill) => (
                <Badge key={skill.name} variant="outline" className="text-xs">
                  {skill.name}
                </Badge>
              ))}
              {career.skills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{career.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="pt-0">
          {isSelected && (
            <Badge variant="outline" className="bg-primary/10 border-primary">
              Selected
            </Badge>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CareerCard;
