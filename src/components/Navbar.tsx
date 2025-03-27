
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, X } from "lucide-react";
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

  const routes = [
    { href: "/", label: "Home" },
    { href: "/mbti", label: "MBTI Test" },
    { href: "/chat", label: "Chat" },
  ];

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
            className="font-display text-xl font-bold tracking-tight inline-flex flex-col items-center"
          >
            <span className="text-gradient-primary bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">Career Compass</span>
            <span className="text-xs text-muted-foreground">SBH 2025 Junior</span>
          </Link>

          <div className="hidden md:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-2">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  className={`px-4 py-2 rounded-md text-sm transition-colors ${
                    location.pathname === route.href
                      ? "bg-primary/10 font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent"
                  }`}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
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
                  <MenuIcon className="h-5 w-5" />
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
            <div className="container px-4 py-4 space-y-1">
              {routes.map((route) => (
                <Link
                  key={route.href}
                  to={route.href}
                  className={`block px-3 py-2 rounded-md ${
                    location.pathname === route.href
                      ? "bg-primary/10 font-medium text-foreground"
                      : "text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {route.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
