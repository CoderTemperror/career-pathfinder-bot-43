
import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { pageVariants } from '@/utils/animations';

interface TransitionLayoutProps {
  children: ReactNode;
  className?: string;
}

const TransitionLayout = ({ children, className = "" }: TransitionLayoutProps) => {
  return (
    <motion.div
      initial="initial"
      animate="enter"
      exit="exit"
      variants={pageVariants}
      className={`w-full min-h-screen ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default TransitionLayout;
