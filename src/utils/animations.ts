
import { AnimationProps } from "framer-motion";

// Page transitions
export const pageVariants = {
  initial: {
    opacity: 0,
    scale: 0.98,
  },
  enter: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.19, 1, 0.22, 1], // Expo ease out
      staggerChildren: 0.1,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.4,
      ease: [0.19, 1, 0.22, 1], // Expo ease out
    },
  },
};

// Content item animations
export const itemVariants = {
  hidden: { 
    opacity: 0, 
    y: 20 
  },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: {
      duration: 0.6,
      ease: [0.19, 1, 0.22, 1], // Expo ease out
    }
  },
};

// Staggered children animation
export const staggerContainer: AnimationProps = {
  initial: "hidden",
  animate: "visible",
  variants: {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  },
};

// Subtle hover animation for cards and interactive elements
export const hoverAnimation = {
  whileHover: {
    y: -5,
    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

// Chat message animations
export const chatMessageAnimation = {
  initial: { opacity: 0, y: 20 },
  animate: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.19, 1, 0.22, 1],
    }
  },
  exit: { 
    opacity: 0,
    height: 0,
    marginTop: 0,
    marginBottom: 0,
    transition: {
      duration: 0.3,
      ease: [0.19, 1, 0.22, 1],
    }
  },
};

// Progress bar animation
export const progressAnimation = {
  initial: { width: 0 },
  animate: { 
    width: "100%",
    transition: { 
      duration: 3, 
      ease: "easeOut" 
    } 
  },
};

// Button press animation
export const buttonTapAnimation = {
  whileTap: { scale: 0.98 },
};

// Shared layout animation for cards
export const cardAnimation = {
  layout: true,
  initial: { opacity: 0, scale: 0.96 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 350,
      damping: 25,
    }
  },
  exit: { 
    opacity: 0, 
    scale: 0.96,
    transition: {
      duration: 0.2,
    }
  },
};
