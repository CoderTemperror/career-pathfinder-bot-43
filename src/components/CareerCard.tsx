
import { motion } from 'framer-motion';
import { Career } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Briefcase, TrendingUp, Banknote, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CareerCardProps {
  career: Career;
  index: number;
}

const CareerCard = ({ career, index }: CareerCardProps) => {
  const formatSalaryRange = (min: number, max: number, currency: string) => {
    return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
  };

  // Determine color based on match score
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800 border-green-200';
    if (score >= 70) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (score >= 50) return 'bg-amber-100 text-amber-800 border-amber-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Determine color based on outlook
  const getOutlookColor = (outlook: string) => {
    switch (outlook) {
      case 'Excellent': return 'text-green-600';
      case 'Good': return 'text-blue-600';
      case 'Fair': return 'text-amber-600';
      case 'Poor': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="w-full"
    >
      <Card className="overflow-hidden h-full transition-all duration-300 hover:shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getMatchScoreColor(career.matchScore)}`}>
                {career.matchScore}% Match
              </div>
              <CardTitle className="text-xl">{career.title}</CardTitle>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-foreground/70" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground text-sm line-clamp-3">
            {career.description}
          </p>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Banknote className="w-3.5 h-3.5" />
                <span>Salary Range</span>
              </div>
              <p className="text-sm font-medium">
                {formatSalaryRange(career.salary.min, career.salary.max, career.salary.currency)}
              </p>
            </div>
            
            <div className="space-y-1">
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>Job Outlook</span>
              </div>
              <p className={`text-sm font-medium ${getOutlookColor(career.outlook)}`}>
                {career.outlook}
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Award className="w-3.5 h-3.5" />
              <span>Key Skills</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {career.skills.slice(0, 4).map((skill, i) => (
                <span 
                  key={i} 
                  className="bg-secondary px-2 py-1 rounded-md text-xs"
                >
                  {skill.name}
                </span>
              ))}
              {career.skills.length > 4 && (
                <span className="bg-secondary px-2 py-1 rounded-md text-xs">
                  +{career.skills.length - 4} more
                </span>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Link to={`/pathway?careerId=${career.id}`} className="w-full">
            <Button className="w-full">
              View Career Pathway
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default CareerCard;
