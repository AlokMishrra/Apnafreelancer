import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import FreelancerCard from "@/components/freelancer-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Crown, Star, TrendingUp, Users } from "lucide-react";
import type { User } from "@shared/schema";

export default function TopFreelancers() {
  const { data: topFreelancers = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/freelancers/top"],
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Crown className="w-8 h-8 text-yellow-500 mr-3" />
            <h1 className="text-4xl font-poppins font-bold text-charcoal">
              Top Freelancers
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Meet our highest-rated and most successful freelancers. 
            These talented professionals have consistently delivered exceptional work.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-card rounded-2xl p-6 text-center border border-border shadow-lg">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">4.9+</h3>
            <p className="text-muted-foreground">Average Rating</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 text-center border border-border shadow-lg">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">98%</h3>
            <p className="text-muted-foreground">Success Rate</p>
          </div>
          
          <div className="bg-card rounded-2xl p-6 text-center border border-border shadow-lg">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-charcoal mb-2">500+</h3>
            <p className="text-muted-foreground">Projects Completed</p>
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-card rounded-2xl shadow-lg border border-border p-6 animate-pulse">
                <div className="text-center mb-4">
                  <div className="w-20 h-20 bg-muted rounded-full mx-auto mb-4" />
                  <div className="h-4 bg-muted rounded w-3/4 mx-auto mb-2" />
                  <div className="h-3 bg-muted rounded w-1/2 mx-auto" />
                </div>
                <div className="space-y-3">
                  <div className="h-3 bg-muted rounded" />
                  <div className="h-3 bg-muted rounded w-3/4" />
                </div>
                <div className="mt-4">
                  <div className="h-3 bg-muted rounded mb-3" />
                  <div className="flex justify-between items-center">
                    <div className="h-4 bg-muted rounded w-1/3" />
                    <div className="h-8 bg-muted rounded w-1/3" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <>
            {/* Top Freelancers Grid */}
            {topFreelancers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👑</div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">No top freelancers available</h3>
                <p className="text-muted-foreground">
                  Check back soon to see our highest-rated professionals
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Featured Top 3 */}
                {topFreelancers.slice(0, 3).length > 0 && (
                  <div className="mb-12">
                    <h2 className="text-2xl font-poppins font-bold text-charcoal mb-6 text-center">
                      🥇 Featured Top Performers
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {topFreelancers.slice(0, 3).map((freelancer, index) => (
                        <div key={freelancer.id} className="relative">
                          <Badge 
                            className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900"
                          >
                            #{index + 1}
                          </Badge>
                          <FreelancerCard
                            freelancer={freelancer}
                            onViewProfile={() => console.log("View top freelancer:", freelancer.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Top Freelancers */}
                {topFreelancers.slice(3).length > 0 && (
                  <div>
                    <h2 className="text-2xl font-poppins font-bold text-charcoal mb-6">
                      🌟 More Top Talent
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {topFreelancers.slice(3).map((freelancer, index) => (
                        <div
                          key={freelancer.id}
                          className="animate-slide-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <FreelancerCard
                            freelancer={freelancer}
                            onViewProfile={() => console.log("View freelancer:", freelancer.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        {!isLoading && topFreelancers.length > 0 && (
          <div className="text-center mt-12 bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-8 shadow-lg border border-border">
            <h3 className="text-2xl font-poppins font-bold text-charcoal mb-4">
              Ready to work with top talent?
            </h3>
            <p className="text-muted-foreground mb-6">
              Post your project and get proposals from these exceptional freelancers
            </p>
            <div className="flex justify-center gap-4">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105"
                onClick={() => window.location.href = "/post-job"}
              >
                Post a Job
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => window.location.href = "/freelancers"}
              >
                Browse All Freelancers
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}