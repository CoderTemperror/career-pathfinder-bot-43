
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  GraduationCap, 
  Briefcase, 
  Globe, 
  Lightbulb, 
  School, 
  Compass,
  Award,
  Target,
  TrendingUp,
  MenuIcon,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SuggestedPromptsSidebarProps {
  onSelectPrompt: (prompt: string) => void;
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

const careerStreams = [
  {
    title: "Science Stream",
    icon: <BookOpen className="h-4 w-4 mr-2" />,
    prompt: "What career options do I have after 12th science? Compare engineering, medicine, research, and IT careers with future scope, required exams, and top colleges."
  },
  {
    title: "Commerce Stream",
    icon: <Briefcase className="h-4 w-4 mr-2" />,
    prompt: "What are the best career options after 12th commerce? Compare CA, MBA, finance, economics with job prospects, required qualifications, and top colleges."
  },
  {
    title: "Arts/Humanities Stream",
    icon: <GraduationCap className="h-4 w-4 mr-2" />,
    prompt: "What career paths can I pursue after 12th arts/humanities? Compare law, psychology, journalism, design with required qualifications and future prospects."
  },
  {
    title: "Vocational/Skill-Based Careers",
    icon: <Lightbulb className="h-4 w-4 mr-2" />,
    prompt: "What skill-based or vocational career options don't require traditional degrees? Compare opportunities, training paths, and future growth potential."
  },
];

const promptCategories = [
  {
    title: "Explore Specific Careers",
    prompts: [
      "What are the top 10 highest paying careers with the best future growth potential?",
      "What careers are best suited for someone interested in technology but not coding?",
      "Compare careers in data science, artificial intelligence, and machine learning - requirements, salaries, and future scope.",
      "What healthcare careers have the best work-life balance?",
      "What creative careers have the best job prospects and stability?",
    ]
  },
  {
    title: "Education Guidance",
    prompts: [
      "What are the top universities worldwide for computer science?",
      "Compare IITs, NITs, and private engineering colleges in India - pros, cons, and placement opportunities.",
      "What entrance exams should I prepare for a career in medicine in India?",
      "What qualifications do I need for a career in investment banking?",
      "What are the best international universities for business management?",
    ]
  },
  {
    title: "Skills & Development",
    prompts: [
      "What skills will be most in-demand in the next 10 years?",
      "What certifications provide the best return on investment for IT professionals?",
      "What soft skills should I develop for leadership roles?",
      "How can I develop skills for a career in digital marketing?",
      "What languages should I learn for international business careers?",
    ]
  },
];

const SuggestedPromptsSidebar = ({ onSelectPrompt, isOpen, onToggle, className = "" }: SuggestedPromptsSidebarProps) => {
  return (
    <>
      {/* Mobile sidebar toggle button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onToggle}
        className="fixed left-4 top-20 z-50 md:hidden bg-background border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20"
      >
        {isOpen ? (
          <X className="h-4 w-4 text-blue-500" />
        ) : (
          <MenuIcon className="h-4 w-4 text-blue-500" />
        )}
      </Button>

      {/* Sidebar overlay on mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={onToggle}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className={`fixed top-0 left-0 z-40 h-full w-[280px] md:w-[320px] bg-background border-r overflow-y-auto pt-20 pb-6 px-4 md:translate-x-0 ${className}`}
      >
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-4 flex items-center text-blue-500">
              <Compass className="mr-2 h-5 w-5" />
              Career Streams After 12th
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {careerStreams.map((stream, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="justify-start h-auto py-3 px-4 text-left border-blue-200 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                  onClick={() => {
                    onSelectPrompt(stream.prompt);
                    if (window.innerWidth < 768) {
                      onToggle();
                    }
                  }}
                >
                  {stream.icon}
                  <div>
                    <div className="font-medium">{stream.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">Explore options & colleges</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          {promptCategories.map((category, categoryIndex) => (
            <div key={categoryIndex}>
              <h2 className="text-lg font-semibold mb-3 flex items-center text-indigo-500">
                {categoryIndex === 0 && <Briefcase className="mr-2 h-5 w-5" />}
                {categoryIndex === 1 && <School className="mr-2 h-5 w-5" />}
                {categoryIndex === 2 && <Award className="mr-2 h-5 w-5" />}
                {category.title}
              </h2>
              <div className="grid grid-cols-1 gap-1.5">
                {category.prompts.map((prompt, promptIndex) => (
                  <Button
                    key={promptIndex}
                    variant="ghost"
                    className="justify-start h-auto py-2 text-left hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                    onClick={() => {
                      onSelectPrompt(prompt);
                      if (window.innerWidth < 768) {
                        onToggle();
                      }
                    }}
                  >
                    <TrendingUp className="h-3 w-3 mr-2 text-indigo-400" />
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </>
  );
};

export default SuggestedPromptsSidebar;
