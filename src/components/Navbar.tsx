
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, BookOpen, MessageSquare, Compass, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIsMobile } from '@/hooks/use-mobile';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/', icon: <Compass className="w-4 h-4" /> },
    { name: 'Assessment', path: '/assessment', icon: <BookOpen className="w-4 h-4" /> },
    { name: 'Chat', path: '/chat', icon: <MessageSquare className="w-4 h-4" /> },
    { name: 'Pathways', path: '/pathway', icon: <Briefcase className="w-4 h-4" /> },
    { name: 'Resources', path: '/resources', icon: <BookOpen className="w-4 h-4" /> },
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const navContainerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1],
        staggerChildren: 0.1,
      }
    }
  };

  const navItemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.19, 1, 0.22, 1],
      }
    }
  };

  return (
    <motion.header
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled ? 'glass shadow-sm' : 'bg-transparent'
      }`}
      initial="hidden"
      animate="visible"
      variants={navContainerVariants}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div
            className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            CP
          </motion.div>
          <span className="font-display text-xl font-medium">CareerPath</span>
        </Link>

        {isMobile ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        ) : (
          <motion.nav className="flex items-center gap-6">
            {navLinks.map((link) => (
              <motion.div key={link.path} variants={navItemVariants}>
                <Link 
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg transition-all duration-300 ${
                    isActive(link.path)
                      ? 'bg-primary text-primary-foreground font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
                >
                  {link.icon}
                  <span>{link.name}</span>
                </Link>
              </motion.div>
            ))}
          </motion.nav>
        )}
      </div>

      {/* Mobile menu */}
      {isMobile && (
        <motion.div
          className={`fixed inset-0 z-40 pt-20 bg-background/95 backdrop-blur-lg transform transition-transform duration-300 ease-out-expo ${
            mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          initial={false}
        >
          <div className="flex flex-col items-center gap-2 p-6">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`w-full flex items-center justify-center gap-2 p-4 rounded-xl text-lg transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-primary text-primary-foreground font-medium'
                    : 'text-foreground hover:bg-secondary'
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};

export default Navbar;
