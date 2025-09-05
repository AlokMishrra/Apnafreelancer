import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogIn, Users, Briefcase, Star, Shield, Zap } from "lucide-react";

export default function SignIn() {
  const { isAuthenticated, isLoading } = useAuth();

  // Redirect to home if already authenticated
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      window.location.href = "/";
    }
  }, [isAuthenticated, isLoading]);

  const handleSignIn = () => {
    window.location.href = "/api/login";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-600/5 flex items-center justify-center">
        <div className="animate-pulse">
          <div className="w-8 h-8 bg-primary rounded-full"></div>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to home
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-purple-600/5">
      {/* Header */}
      <div className="bg-background/80 backdrop-blur-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-purple-600 rounded-lg mr-3"></div>
              <span className="text-xl font-poppins font-bold text-charcoal">FreelanceHub</span>
            </div>
            <Button variant="ghost" onClick={handleSignIn}>
              Already have an account?
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Welcome Content */}
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-poppins font-bold text-charcoal mb-4">
                Welcome to Your
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600"> Freelance Journey</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Connect with opportunities, showcase your skills, and build your dream career in the world's leading freelance marketplace.
              </p>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Global Network</h3>
                  <p className="text-sm text-muted-foreground">Connect with clients and freelancers worldwide</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Secure Platform</h3>
                  <p className="text-sm text-muted-foreground">Safe payments and verified professionals</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Briefcase className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Quality Projects</h3>
                  <p className="text-sm text-muted-foreground">Find work that matches your expertise</p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="bg-yellow-100 p-3 rounded-lg">
                  <Star className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-charcoal mb-1">Build Reputation</h3>
                  <p className="text-sm text-muted-foreground">Earn reviews and grow your profile</p>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-charcoal">10K+</div>
                <div className="text-sm text-muted-foreground">Active Projects</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-charcoal">5K+</div>
                <div className="text-sm text-muted-foreground">Freelancers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-charcoal">98%</div>
                <div className="text-sm text-muted-foreground">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Side - Sign In Card */}
          <div className="flex justify-center">
            <Card className="w-full max-w-md shadow-xl border-border">
              <CardHeader className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center mx-auto">
                  <LogIn className="w-8 h-8 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-poppins text-charcoal">
                    Get Started Today
                  </CardTitle>
                  <CardDescription className="text-base mt-2">
                    Sign in with your Replit account to access all features
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <Badge variant="secondary" className="w-full justify-center p-3 text-sm">
                    <Zap className="w-4 h-4 mr-2" />
                    Quick & Secure Login with Replit
                  </Badge>
                  
                  <Button
                    onClick={handleSignIn}
                    size="lg"
                    className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In with Replit
                  </Button>
                  
                  <p className="text-xs text-center text-muted-foreground">
                    By signing in, you agree to our Terms of Service and Privacy Policy
                  </p>
                </div>

                {/* Benefits for new users */}
                <div className="border-t border-border pt-6">
                  <h4 className="font-medium text-charcoal mb-3">What you get:</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Access to thousands of projects
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Connect with verified clients
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Secure payment processing
                    </li>
                    <li className="flex items-center">
                      <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                      Professional portfolio tools
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <h3 className="text-xl font-poppins font-semibold text-charcoal mb-4">
            Ready to transform your career?
          </h3>
          <p className="text-muted-foreground mb-6">
            Join thousands of successful freelancers who have built their careers with us.
          </p>
          <Button
            onClick={handleSignIn}
            variant="outline"
            size="lg"
            className="border-primary text-primary hover:bg-primary hover:text-white"
          >
            Get Started Now
          </Button>
        </div>
      </div>
    </div>
  );
}