import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, ChevronUp, Menu, Shield, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import AuthModal from "./auth-modal";


export default function Navigation() {
  const { isAuthenticated, user, signOut } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [findWorkOpen, setFindWorkOpen] = useState(false);
  const [hireTalentOpen, setHireTalentOpen] = useState(false);
  const [learningOpen, setLearningOpen] = useState(false);



  // Refs for timeout management
  const findWorkTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hireTalentTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const learningTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize theme from localStorage or default to dark
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const shouldBeDark = savedTheme === 'dark' || (!savedTheme && prefersDark);
    
    setIsDarkMode(shouldBeDark);
    document.documentElement.classList.toggle('dark', shouldBeDark);
  }, []);

  const toggleTheme = () => {
    const newIsDarkMode = !isDarkMode;
    setIsDarkMode(newIsDarkMode);
    document.documentElement.classList.toggle('dark', newIsDarkMode);
    localStorage.setItem('theme', newIsDarkMode ? 'dark' : 'light');
  };

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      if (findWorkTimeoutRef.current) clearTimeout(findWorkTimeoutRef.current);
      if (hireTalentTimeoutRef.current) clearTimeout(hireTalentTimeoutRef.current);
      if (learningTimeoutRef.current) clearTimeout(learningTimeoutRef.current);
    };
  }, []);

  // Improved hover handlers with proper timeout management
  const handleFindWorkEnter = () => {
    if (findWorkTimeoutRef.current) {
      clearTimeout(findWorkTimeoutRef.current);
      findWorkTimeoutRef.current = null;
    }
    setFindWorkOpen(true);
  };

  const handleFindWorkLeave = () => {
    findWorkTimeoutRef.current = setTimeout(() => {
      setFindWorkOpen(false);
      findWorkTimeoutRef.current = null;
    }, 300);
  };

  const handleHireTalentEnter = () => {
    if (hireTalentTimeoutRef.current) {
      clearTimeout(hireTalentTimeoutRef.current);
      hireTalentTimeoutRef.current = null;
    }
    setHireTalentOpen(true);
  };

  const handleHireTalentLeave = () => {
    hireTalentTimeoutRef.current = setTimeout(() => {
      setHireTalentOpen(false);
      hireTalentTimeoutRef.current = null;
    }, 300);
  };

  const handleLearningEnter = () => {
    if (learningTimeoutRef.current) {
      clearTimeout(learningTimeoutRef.current);
      learningTimeoutRef.current = null;
    }
    setLearningOpen(true);
  };

  const handleLearningLeave = () => {
    learningTimeoutRef.current = setTimeout(() => {
      setLearningOpen(false);
      learningTimeoutRef.current = null;
    }, 300);
  };

  // Clean navigation structure - items are now organized in JSX

  const NavLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link href={href}>
      <span
        className={`font-medium backdrop-blur-sm rounded-lg px-4 py-2 transition-all duration-200 relative group cursor-pointer inline-flex items-center h-10 ${className} ${
          isDarkMode 
            ? `text-white hover:text-white hover:bg-white/20 ${location === href ? "text-white bg-white/10" : ""}`
            : `text-slate-700 hover:text-blue-700 hover:bg-blue-100/60 ${location === href ? "text-blue-700 bg-blue-100/40" : ""}`
        }`}
        data-testid={`nav-${href.replace("/", "") || "home"}`}
      >
        {children}
        <span
          className={`absolute -bottom-1 left-0 h-0.5 transition-all duration-300 ${
            isDarkMode ? 'bg-white' : 'bg-blue-600'
          } ${location === href ? "w-full" : "w-0 group-hover:w-full"}`}
        />
      </span>
    </Link>
  );

  // Zoom effect and reload for Home
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    const main = document.getElementById('main-content') || document.body;
    main.classList.add('animate-zoom-in-out');
    setTimeout(() => {
      main.classList.remove('animate-zoom-in-out');
      window.location.href = '/';
    }, 700);
  };

  return (
    <nav className={`backdrop-blur-xl sticky top-4 z-50 transition-all duration-300 mx-4 rounded-2xl shadow-2xl ${
      isDarkMode 
        ? 'bg-gradient-to-r from-slate-900/80 via-slate-800/70 to-slate-900/80 border-slate-700/30' 
        : 'bg-gradient-to-r from-white/95 via-blue-50/80 to-white/95 border-blue-200/40'
    } border`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <span onClick={handleHomeClick} style={{display: 'inline-block'}}>
            <Link href="/">
              <div className="flex items-center space-x-3 cursor-pointer" data-testid="logo">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <div className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'}`}>
                  ApnaFreelancer
                </div>
              </div>
            </Link>
          </span>

          {/* Desktop Navigation - Clean Layout */}
          <div className="hidden lg:flex items-center space-x-1">
            <span onClick={handleHomeClick} style={{display: 'inline-block'}}>
              <NavLink href="/">Home</NavLink>
            </span>

            {/* Find Work Dropdown */}
            <div onMouseEnter={handleFindWorkEnter} onMouseLeave={handleFindWorkLeave}>
              <DropdownMenu open={findWorkOpen} onOpenChange={setFindWorkOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={`font-medium backdrop-blur-sm rounded-lg px-4 py-2 transition-all duration-200 flex items-center h-10 ${
                      isDarkMode 
                        ? 'text-white hover:text-white hover:bg-white/20'
                        : 'text-slate-700 hover:text-blue-700 hover:bg-blue-100/60'
                    }`}
                    data-testid="dropdown-find-work"
                  >
                  Find Work
                  {findWorkOpen ? (
                    <ChevronUp className="w-4 h-4 ml-1 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className={`w-56 backdrop-blur-xl shadow-2xl border ${
                  isDarkMode 
                    ? 'bg-slate-900/95 border-slate-700/30' 
                    : 'bg-white/95 border-blue-200/40'
                }`}
                sideOffset={4}
              >
                <DropdownMenuItem asChild className={isDarkMode ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-blue-50/80 focus:bg-blue-50/80"}>
                  <Link href="/services">
                    <span className={`w-full ${isDarkMode ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-700'}`} data-testid="link-browse-services">Browse Services</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={isDarkMode ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-blue-50/80 focus:bg-blue-50/80"}>
                  <Link href="/find-work">
                    <span className={`w-full ${isDarkMode ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-700'}`} data-testid="link-find-work">Find Jobs</span>
                  </Link>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <DropdownMenuItem asChild className={isDarkMode ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-blue-50/80 focus:bg-blue-50/80"}>
                    <Link href="/create-service">
                      <span className={`w-full ${isDarkMode ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-700'}`} data-testid="link-create-service">Create Service</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
            </div>

            {/* Hire Talent Dropdown */}
            <div onMouseEnter={handleHireTalentEnter} onMouseLeave={handleHireTalentLeave}>
              <DropdownMenu open={hireTalentOpen} onOpenChange={setHireTalentOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`font-medium backdrop-blur-sm rounded-lg px-4 py-2 transition-all duration-200 flex items-center h-10 ${
                    isDarkMode 
                      ? 'text-white hover:text-white hover:bg-white/20'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-blue-100/60'
                  }`}
                  data-testid="dropdown-hire-talent"
                >
                  Hire Talent
                  {hireTalentOpen ? (
                    <ChevronUp className="w-4 h-4 ml-1 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className={`w-56 backdrop-blur-xl shadow-2xl border ${
                  isDarkMode 
                    ? 'bg-slate-900/95 border-slate-700/30' 
                    : 'bg-white/95 border-blue-200/40'
                }`}
                sideOffset={4}
              >
                <DropdownMenuItem asChild className={isDarkMode ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-blue-50/80 focus:bg-blue-50/80"}>
                  <Link href="/post-job">
                    <span className={`w-full ${isDarkMode ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-700'}`} data-testid="link-post-job">Post a Job</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={isDarkMode ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-blue-50/80 focus:bg-blue-50/80"}>
                  <Link href="/freelancers">
                    <span className={`w-full ${isDarkMode ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-700'}`} data-testid="link-find-freelancers">Find Freelancers</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={isDarkMode ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-blue-50/80 focus:bg-blue-50/80"}>
                  <Link href="/top-freelancers">
                    <span className={`w-full ${isDarkMode ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-700'}`} data-testid="link-top-freelancers">Top Freelancers</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>

            {/* Learning Dropdown */}
            <div onMouseEnter={handleLearningEnter} onMouseLeave={handleLearningLeave}>
              <DropdownMenu open={learningOpen} onOpenChange={setLearningOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className={`font-medium backdrop-blur-sm rounded-lg px-4 py-2 transition-all duration-200 flex items-center h-10 ${
                    isDarkMode 
                      ? 'text-white hover:text-white hover:bg-white/20'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-blue-100/60'
                  }`}
                  data-testid="dropdown-learning"
                >
                  Learning
                  <span className="ml-2 px-2 py-1 text-xs font-semibold bg-orange-400 text-white rounded-full shadow-sm">
                    New
                  </span>
                  {learningOpen ? (
                    <ChevronUp className="w-4 h-4 ml-1 transition-transform duration-200" />
                  ) : (
                    <ChevronDown className="w-4 h-4 ml-1 transition-transform duration-200" />
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent 
                className={`w-56 backdrop-blur-xl shadow-2xl border ${
                  isDarkMode 
                    ? 'bg-slate-900/95 border-slate-700/30' 
                    : 'bg-white/95 border-blue-200/40'
                }`}
                sideOffset={4}
              >
                <DropdownMenuItem asChild className={isDarkMode ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-blue-50/80 focus:bg-blue-50/80"}>
                  <button 
                    onClick={() => {
                      window.open(
                        'https://akool.com/apps/streaming-avatar/edit?avatar_id=dvp_Alinna_realisticbg_20241224&auto_open_camera=true',
                        'avatar_window',
                        'fullscreen=yes,width=' + screen.width + ',height=' + screen.height + ',left=0,top=0,scrollbars=no,resizable=no,toolbar=no,menubar=no,location=no,status=no,titlebar=no,directories=no,chrome=no'
                      );
                    }}
                    className={`w-full cursor-pointer text-left ${isDarkMode ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-700'}`}
                    data-testid="button-streaming-avatar"
                  >
                    🎥 Streaming Avatar
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={isDarkMode ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-blue-50/80 focus:bg-blue-50/80"}>
                  <Link href="/tutorials">
                    <span className={`w-full cursor-pointer ${isDarkMode ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-700'}`} data-testid="link-tutorials">
                      📚 Tutorials
                    </span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild className={isDarkMode ? "hover:bg-white/10 focus:bg-white/10" : "hover:bg-blue-50/80 focus:bg-blue-50/80"}>
                  <Link href="/learning-roadmap">
                    <span className={`w-full cursor-pointer ${isDarkMode ? 'text-white/90 hover:text-white' : 'text-slate-700 hover:text-blue-700'}`} data-testid="link-roadmap">
                      🗺️ Roadmap
                      <span className="ml-2 px-1.5 py-0.5 text-xs font-semibold bg-green-400 text-white rounded-full shadow-sm">
                        New
                      </span>
                    </span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            </div>

            <NavLink href="/services">Browse Services</NavLink>
            
            {isAuthenticated && (
              <NavLink href="/messages">Messages</NavLink>
            )}
            
            {isAuthenticated && (
              <NavLink href="/admin">Admin</NavLink>
            )}
          </div>

          {/* Theme Toggle & Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-2">
            {/* Theme Toggle Button */}
            <Button
              onClick={toggleTheme}
              variant="ghost"
              size="icon"
              className={`backdrop-blur-sm rounded-lg transition-all duration-200 w-10 h-10 ${
                isDarkMode 
                  ? 'text-white hover:bg-white/20'
                  : 'text-blue-600 hover:bg-blue-100/60'
              }`}
              data-testid="theme-toggle"
            >
              {isDarkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            {isAuthenticated ? (
              <>
                <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-slate-700'}`} data-testid="user-welcome">
                  Welcome, {(user as any)?.firstName || (user as any)?.email}
                </span>
                <Button
                  onClick={async () => {
                    await signOut();
                    window.location.href = "/";
                  }}
                  variant="outline"
                  className={`backdrop-blur-sm rounded-lg transition-all duration-200 ${
                    isDarkMode 
                      ? 'border-white/30 text-white hover:bg-white/20'
                      : 'border-blue-300/60 text-blue-700 hover:bg-blue-50/60'
                  }`}
                  data-testid="button-logout"
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => {
                    setAuthModalTab("login");
                    setAuthModalOpen(true);
                  }}
                  variant="ghost"
                  className={`font-medium backdrop-blur-sm rounded-lg px-4 py-2 transition-all duration-200 h-10 ${
                    isDarkMode 
                      ? 'text-white hover:text-white hover:bg-white/20'
                      : 'text-slate-700 hover:text-blue-700 hover:bg-blue-100/60'
                  }`}
                  data-testid="button-signin"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    setAuthModalTab("register");
                    setAuthModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 rounded-xl backdrop-blur-sm h-10"
                  data-testid="button-join"
                >
                  Join Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className={isDarkMode ? "text-white hover:bg-white/10" : "text-gray-700 hover:bg-gray-200/50"} data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className={`w-[300px] backdrop-blur-xl ${
                isDarkMode 
                  ? 'bg-slate-900/95 border-slate-700/30' 
                  : 'bg-white/95 border-blue-200/40'
              }`}>
                <div className="flex flex-col space-y-4 mt-8">
                  <Link href="/">
                    <div
                      className={`block px-3 py-2 font-medium cursor-pointer rounded-lg ${
                        isDarkMode 
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="mobile-nav-home"
                    >
                      Home
                    </div>
                  </Link>
                  
                  <Link href="/services">
                    <div
                      className={`block px-3 py-2 font-medium cursor-pointer rounded-lg ${
                        isDarkMode 
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="mobile-nav-services"
                    >
                      Browse Services
                    </div>
                  </Link>
                  
                  <Link href="/find-work">
                    <div
                      className={`block px-3 py-2 font-medium cursor-pointer rounded-lg ${
                        isDarkMode 
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="mobile-nav-find-work"
                    >
                      Find Work
                    </div>
                  </Link>
                  
                  <Link href="/post-job">
                    <div
                      className={`block px-3 py-2 font-medium cursor-pointer rounded-lg ${
                        isDarkMode 
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="mobile-nav-post-job"
                    >
                      Post a Job
                    </div>
                  </Link>
                  
                  <Link href="/freelancers">
                    <div
                      className={`block px-3 py-2 font-medium cursor-pointer rounded-lg ${
                        isDarkMode 
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="mobile-nav-freelancers"
                    >
                      Find Freelancers
                    </div>
                  </Link>
                  
                  <button
                    className={`block px-3 py-2 font-medium cursor-pointer rounded-lg w-full text-left ${
                      isDarkMode 
                        ? 'text-white/90 hover:text-white hover:bg-white/10'
                        : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                    }`}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      window.open(
                        'https://akool.com/apps/streaming-avatar/edit?avatar_id=dvp_Alinna_realisticbg_20241224&auto_open_camera=true',
                        'avatar_window',
                        'fullscreen=yes,width=' + screen.width + ',height=' + screen.height + ',left=0,top=0,scrollbars=no,resizable=no,toolbar=no,menubar=no,location=no,status=no,titlebar=no,directories=no,chrome=no'
                      );
                    }}
                    data-testid="mobile-button-streaming-avatar"
                  >
                    🎥 Learning - Streaming Avatar
                  </button>

                  <Link href="/tutorials">
                    <div
                      className={`block px-3 py-2 font-medium cursor-pointer rounded-lg ${
                        isDarkMode 
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                      data-testid="mobile-nav-tutorials"
                    >
                      📚 Learning - Tutorials
                    </div>
                  </Link>
                  
                  {isAuthenticated && (
                    <>
                      <Link href="/messages">
                        <div
                          className={`block px-3 py-2 font-medium cursor-pointer rounded-lg ${
                            isDarkMode 
                              ? 'text-white/90 hover:text-white hover:bg-white/10'
                              : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid="mobile-nav-messages"
                        >
                          Messages
                        </div>
                      </Link>
                      
                      <Link href="/create-service">
                        <div
                          className={`block px-3 py-2 font-medium cursor-pointer rounded-lg ${
                            isDarkMode 
                              ? 'text-white/90 hover:text-white hover:bg-white/10'
                              : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid="mobile-nav-create-service"
                        >
                          Create Service
                        </div>
                      </Link>
                      
                      <Link href="/admin">
                        <div
                          className={`block px-3 py-2 font-medium cursor-pointer rounded-lg ${
                            isDarkMode 
                              ? 'text-white/90 hover:text-white hover:bg-white/10'
                              : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                          data-testid="mobile-nav-admin"
                        >
                          Admin
                        </div>
                      </Link>
                    </>
                  )}
                  
                  {/* Theme Toggle in Mobile */}
                  <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-blue-200/50'}`}>
                    <Button
                      onClick={toggleTheme}
                      variant="ghost"
                      className={`w-full text-left justify-start rounded-lg flex items-center gap-3 ${
                        isDarkMode 
                          ? 'text-white/90 hover:text-white hover:bg-white/10'
                          : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                      }`}
                      data-testid="mobile-theme-toggle"
                    >
                      {isDarkMode ? (
                        <>
                          <Sun className="h-5 w-5" />
                          Switch to Light Mode
                        </>
                      ) : (
                        <>
                          <Moon className="h-5 w-5" />
                          Switch to Dark Mode
                        </>
                      )}
                    </Button>
                  </div>
                  
                  <div className={`pt-4 border-t ${isDarkMode ? 'border-slate-700/50' : 'border-blue-200/50'} space-y-2`}>
                    {isAuthenticated ? (
                      <>
                        <div className={`px-3 py-2 text-sm ${isDarkMode ? 'text-white/70' : 'text-slate-600'}`}>
                          Welcome, {(user as any)?.firstName || (user as any)?.email}
                        </div>
                        <Button
                          onClick={async () => {
                            await signOut();
                            window.location.href = "/";
                          }}
                          variant="outline"
                          className={`w-full ${
                            isDarkMode 
                              ? 'border-white/20 text-white hover:bg-white/10'
                              : 'border-blue-300/60 text-blue-700 hover:bg-blue-50/60'
                          }`}
                          data-testid="mobile-button-logout"
                        >
                          Logout
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => {
                            setAuthModalTab("login");
                            setAuthModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          variant="ghost"
                          className={`w-full text-left justify-start ${
                            isDarkMode 
                              ? 'text-white/90 hover:text-white hover:bg-white/10'
                              : 'text-slate-700 hover:text-blue-700 hover:bg-blue-50/70'
                          }`}
                          data-testid="mobile-button-signin"
                        >
                          Sign In
                        </Button>
                        <Button
                          onClick={() => {
                            setAuthModalTab("register");
                            setAuthModalOpen(true);
                            setMobileMenuOpen(false);
                          }}
                          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl"
                          data-testid="mobile-button-join"
                        >
                          Join Now
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        defaultTab={authModalTab}
      />



    </nav>
  );
}
