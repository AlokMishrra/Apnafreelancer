import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { ChevronDown, Menu, Shield, X } from "lucide-react";
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
  const { isAuthenticated, user } = useAuth();
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "register">("login");

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/services", label: "Browse Services" },
  ];

  if (isAuthenticated) {
    navItems.push(
      { href: "/create-service", label: "Create Service" },
      { href: "/find-work", label: "Find Work" },
      { href: "/messages", label: "Messages" }
    );
  }

  const NavLink = ({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) => (
    <Link href={href}>
      <a
        className={`text-charcoal hover:text-primary transition-all duration-300 font-medium relative group ${className} ${
          location === href ? "text-primary" : ""
        }`}
        data-testid={`nav-${href.replace("/", "") || "home"}`}
      >
        {children}
        <span
          className={`absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300 ${
            location === href ? "w-full" : "w-0 group-hover:w-full"
          }`}
        />
      </a>
    </Link>
  );

  return (
    <nav className="bg-background/95 backdrop-blur-md shadow-lg border-b border-border sticky top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/">
            <a className="flex items-center space-x-3" data-testid="logo">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center shadow-lg">
                <Shield className="w-7 h-7 text-primary-foreground" />
              </div>
              <div className="text-2xl font-poppins font-bold bg-gradient-to-r from-primary to-primary bg-clip-text text-transparent">
                ApnaFreelancer
              </div>
            </a>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <NavLink key={item.href} href={item.href}>
                {item.label}
              </NavLink>
            ))}

            {/* Find Work Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-charcoal hover:text-primary font-medium"
                  data-testid="dropdown-find-work"
                >
                  Find Work
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Link href="/services">
                    <span className="w-full" data-testid="link-browse-services">Browse Services</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/find-work">
                    <span className="w-full" data-testid="link-find-work">Find Jobs</span>
                  </Link>
                </DropdownMenuItem>
                {isAuthenticated && (
                  <DropdownMenuItem>
                    <Link href="/create-service">
                      <span className="w-full" data-testid="link-create-service">Create Service</span>
                    </Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Hire Talent Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-charcoal hover:text-primary font-medium"
                  data-testid="dropdown-hire-talent"
                >
                  Hire Talent
                  <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>
                  <Link href="/post-job">
                    <span className="w-full" data-testid="link-post-job">Post a Job</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/freelancers">
                    <span className="w-full" data-testid="link-find-freelancers">Find Freelancers</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/top-freelancers">
                    <span className="w-full" data-testid="link-top-freelancers">Top Freelancers</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/hire-talent">
                    <span className="w-full" data-testid="link-hire-talent">Hire Talent</span>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-charcoal text-sm" data-testid="user-welcome">
                  Welcome, {(user as any)?.firstName || (user as any)?.email}
                </span>
                <Button
                  onClick={() => (window.location.href = "/api/logout")}
                  variant="outline"
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
                  className="text-charcoal hover:text-primary"
                  data-testid="button-signin"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => {
                    setAuthModalTab("register");
                    setAuthModalOpen(true);
                  }}
                  className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105"
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
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px]">
                <div className="flex flex-col space-y-4 mt-8">
                  {navItems.map((item) => (
                    <Link key={item.href} href={item.href}>
                      <a
                        className="block px-3 py-2 text-charcoal hover:text-primary font-medium"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid={`mobile-nav-${item.href.replace("/", "") || "home"}`}
                      >
                        {item.label}
                      </a>
                    </Link>
                  ))}
                  
                  <div className="pt-4 border-t border-border space-y-2">
                    {isAuthenticated ? (
                      <>
                        <div className="px-3 py-2 text-sm text-muted-foreground">
                          Welcome, {(user as any)?.firstName || (user as any)?.email}
                        </div>
                        <Button
                          onClick={() => (window.location.href = "/api/logout")}
                          variant="outline"
                          className="w-full"
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
                          className="w-full text-left justify-start"
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
                          className="w-full bg-primary text-primary-foreground"
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
