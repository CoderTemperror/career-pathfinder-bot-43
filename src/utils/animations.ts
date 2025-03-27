
import { Variants } from 'framer-motion';

// Page transition animations
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: 'easeInOut',
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: 'easeInOut',
    },
  },
};

// Chat message animation
export const chatMessageAnimation: Variants = {
  initial: { 
    opacity: 0,
    y: 20,
    scale: 0.97,
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { 
      duration: 0.25,
    }
  },
  exit: { 
    opacity: 0,
    transition: { 
      duration: 0.2,
    }
  }
};

// Sidebar animation
export const sidebarAnimation: Variants = {
  closed: {
    x: "-100%",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  },
  open: {
    x: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 40
    }
  }
};

// Fade in animation
export const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, transition: { duration: 0.2 } }
};

// Notification animation
export const notificationAnimation: Variants = {
  initial: { 
    opacity: 0,
    y: -20,
    scale: 0.9,
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30
    }
  },
  exit: { 
    opacity: 0,
    y: -20,
    transition: { 
      duration: 0.2,
    }
  }
};
