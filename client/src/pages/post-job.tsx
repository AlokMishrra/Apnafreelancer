import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import JobPostForm from "@/components/job-post-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Briefcase, Clock, DollarSign, Shield, Users } from "lucide-react";

export default function PostJob() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  if (!isAuthenticated && !isLoading) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background via-secondary to-background overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-float" />
          <div
            className="absolute top-40 right-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-float"
            style={{ animationDelay: "2s" }}
          />
        </div>
        
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center px-4 py-2 bg-primary/10 rounded-full text-primary font-medium text-sm mb-8">
            <Briefcase className="w-4 h-4 mr-2" />
            Post Your Project & Get Started
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold text-charcoal mb-6 leading-tight" data-testid="title-post-job">
            Find the Perfect
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {" "}Freelancer{" "}
            </span>
            for Your Project
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Post your project requirements and receive proposals from talented freelancers within minutes. 
            Our secure platform ensures quality work delivered on time and budget.
          </p>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-charcoal mb-3">Fast Turnaround</h3>
                <p className="text-muted-foreground">
                  Get proposals within minutes and start your project immediately with pre-vetted freelancers.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-charcoal mb-3">Secure Payments</h3>
                <p className="text-muted-foreground">
                  Protected payments with milestone-based releases ensure you only pay for satisfactory work.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow duration-300">
              <CardContent className="pt-6">
                <div className="w-16 h-16 bg-gradient-to-br from-chart-3 to-chart-3 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-poppins font-semibold text-charcoal mb-3">Quality Talent</h3>
                <p className="text-muted-foreground">
                  Access to 50,000+ skilled freelancers across all industries with verified portfolios and reviews.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Job Posting Form Section */}
      <section className="py-20 bg-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-poppins font-bold text-charcoal mb-4">
              Post Your Job
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Fill out the form below to describe your project and find the perfect freelancer
            </p>
          </div>

          <JobPostForm />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-poppins font-bold text-charcoal mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Simple steps to get your project completed
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-lg font-poppins font-semibold text-charcoal mb-3">Post Your Job</h3>
              <p className="text-muted-foreground text-sm">
                Describe your project, set your budget, and specify requirements
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold text-accent-foreground">2</span>
              </div>
              <h3 className="text-lg font-poppins font-semibold text-charcoal mb-3">Review Proposals</h3>
              <p className="text-muted-foreground text-sm">
                Receive proposals from qualified freelancers within minutes
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-chart-3 to-chart-3 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-lg font-poppins font-semibold text-charcoal mb-3">Choose & Hire</h3>
              <p className="text-muted-foreground text-sm">
                Select the best freelancer and start working together
              </p>
            </div>

            {/* Step 4 */}
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-chart-4 to-chart-4 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                <span className="text-xl font-bold text-primary-foreground">4</span>
              </div>
              <h3 className="text-lg font-poppins font-semibold text-charcoal mb-3">Get Results</h3>
              <p className="text-muted-foreground text-sm">
                Collaborate, review progress, and receive quality deliverables
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-projects">25K+</div>
              <div className="text-muted-foreground">Projects Completed</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-freelancers">50K+</div>
              <div className="text-muted-foreground">Active Freelancers</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-clients">15K+</div>
              <div className="text-muted-foreground">Happy Clients</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2" data-testid="stat-rating">4.9★</div>
              <div className="text-muted-foreground">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
