import { useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import MessagingInterface from "@/components/messaging-interface";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle, Users, Clock, Shield } from "lucide-react";

export default function Messages() {
  const { isAuthenticated, isLoading, user } = useAuth();
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
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <MessageCircle className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl font-poppins font-bold text-charcoal" data-testid="title-messages">
              Messages
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Stay connected with your clients and freelancers
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center mr-4">
                  <MessageCircle className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-charcoal" data-testid="stat-total-messages">--</div>
                  <div className="text-sm text-muted-foreground">Total Messages</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-accent rounded-xl flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-accent-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-charcoal" data-testid="stat-active-chats">--</div>
                  <div className="text-sm text-muted-foreground">Active Chats</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-chart-3 to-chart-3 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-charcoal" data-testid="stat-response-time">{'< 1h'}</div>
                  <div className="text-sm text-muted-foreground">Avg Response</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-chart-4 to-chart-4 rounded-xl flex items-center justify-center mr-4">
                  <Shield className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <div className="text-2xl font-bold text-charcoal" data-testid="stat-secure">100%</div>
                  <div className="text-sm text-muted-foreground">Secure</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message for New Users */}
        <div className="mb-8 bg-gradient-to-r from-primary/5 to-accent/5 rounded-2xl p-6 border border-primary/20">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-poppins font-semibold text-charcoal mb-2">
                Welcome to Messages, {(user as any)?.firstName || 'User'}! 👋
              </h3>
              <p className="text-muted-foreground">
                Connect with freelancers and clients through our secure messaging system. 
                All conversations are encrypted and safe.
              </p>
            </div>
            <div className="hidden md:block">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-primary-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Messaging Interface */}
        <MessagingInterface />

        {/* Tips Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-0">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary" />
              </div>
              <h4 className="font-poppins font-semibold text-charcoal mb-2">Professional Communication</h4>
              <p className="text-sm text-muted-foreground">
                Keep conversations professional and project-focused. Clear communication leads to better results.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-0">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h4 className="font-poppins font-semibold text-charcoal mb-2">Quick Responses</h4>
              <p className="text-sm text-muted-foreground">
                Respond promptly to messages to maintain good relationships and project momentum.
              </p>
            </CardContent>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-300">
            <CardContent className="pt-0">
              <div className="w-12 h-12 bg-chart-3/10 rounded-xl flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-chart-3" />
              </div>
              <h4 className="font-poppins font-semibold text-charcoal mb-2">Stay Secure</h4>
              <p className="text-sm text-muted-foreground">
                Never share personal information or conduct business outside of our secure platform.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Call to Action */}
        <div className="mt-12 text-center bg-card rounded-2xl p-8 shadow-lg border border-border">
          <h3 className="text-2xl font-poppins font-bold text-charcoal mb-4">
            No conversations yet?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Start by browsing our talented freelancers or posting a job to receive proposals. 
            Great projects begin with great conversations!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => window.location.href = "/freelancers"}
              data-testid="button-browse-freelancers"
            >
              Browse Freelancers
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              onClick={() => window.location.href = "/post-job"}
              data-testid="button-post-job"
            >
              Post a Job
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
