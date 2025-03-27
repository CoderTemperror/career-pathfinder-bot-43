
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Lightbulb, X, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/ThemeToggle";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <div
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-background/80 backdrop-blur-md border-b" : ""
      }`}
    >
      <nav className="container flex flex-col items-center justify-between py-4 px-4 md:px-8">
        <div className="flex w-full items-center justify-between">
          <Link
            to="/"
            className="font-display text-xl font-bold tracking-tight"
          >
            <div className="flex flex-col">
              <span className="text-blue-500 dark:text-blue-400">Career Compass</span>
              <span className="text-xs text-muted-foreground -mt-1">SBH 2025 Junior</span>
            </div>
          </Link>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-6">
              <Link
                to="/"
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  location.pathname === "/"
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                Home
              </Link>
              
              <Link
                to="/mbti"
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  location.pathname === "/mbti"
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                MBTI Test
              </Link>
              
              <Link
                to="/chat"
                className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                  location.pathname === "/chat"
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent"
                }`}
              >
                Chat
              </Link>
            </div>
            
            <ThemeToggle />
            
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleMenu}
                aria-label={isOpen ? "Close menu" : "Open menu"}
              >
                {isOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden overflow-hidden bg-background border-b"
          >
            <div className="container px-4 py-4 space-y-1 flex flex-col items-center">
              <Link
                to="/"
                className={`block px-3 py-2 rounded-md w-full text-center ${
                  location.pathname === "/"
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                Home
              </Link>
              <Link
                to="/mbti"
                className={`block px-3 py-2 rounded-md w-full text-center ${
                  location.pathname === "/mbti"
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                MBTI Test
              </Link>
              <Link
                to="/chat"
                className={`block px-3 py-2 rounded-md w-full text-center ${
                  location.pathname === "/chat"
                    ? "bg-primary/10 font-medium text-foreground"
                    : "text-muted-foreground hover:bg-accent"
                }`}
              >
                Chat
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
