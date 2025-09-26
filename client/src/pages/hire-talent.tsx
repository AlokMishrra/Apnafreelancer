import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/navigation";
import FreelancerCard from "@/components/freelancer-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Users, Zap, Shield, Clock, Star, Award } from "lucide-react";
import type { User, Category } from "@shared/schema";

export default function HireTalent() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [experienceLevel, setExperienceLevel] = useState<string>("");
  const [budgetRange, setBudgetRange] = useState<string>("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: freelancers = [], isLoading } = useQuery<User[]>({
    queryKey: ["/api/freelancers", { categoryId: selectedCategory === "all" ? "" : selectedCategory, search: searchQuery }],
  });

  const { data: topFreelancers = [] } = useQuery<User[]>({
    queryKey: ["/api/freelancers/top", { limit: 6 }],
  });

  const handleSearch = () => {
    // Trigger refetch with new search params
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const filteredFreelancers = freelancers.filter(freelancer => {
    const rating = Number(freelancer.rating || 0);
    const hourlyRate = Number(freelancer.hourlyRate || 0);
    
    if (experienceLevel === "entry" && rating > 4.0) return false;
    if (experienceLevel === "intermediate" && (rating < 4.0 || rating > 4.7)) return false;
    if (experienceLevel === "expert" && rating < 4.7) return false;
    
    if (budgetRange === "budget" && hourlyRate > 40) return false;
    if (budgetRange === "standard" && (hourlyRate < 40 || hourlyRate > 80)) return false;
    if (budgetRange === "premium" && hourlyRate < 80) return false;
    
    return true;
  });

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <Users className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl font-poppins font-bold text-charcoal">
              Hire Top Talent
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect with skilled freelancers and build your dream team. 
            From quick tasks to complex projects, find the perfect professional for your needs.
          </p>
        </div>

        {/* Benefits Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="text-center border-border">
            <CardHeader>
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Zap className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle className="text-lg">Fast Hiring</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Find and hire qualified freelancers in minutes, not weeks</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-border">
            <CardHeader>
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-lg">Quality Guaranteed</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">All freelancers are vetted with verified skills and reviews</p>
            </CardContent>
          </Card>
          
          <Card className="text-center border-border">
            <CardHeader>
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle className="text-lg">Top Professionals</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Access to top-rated freelancers across all skill categories</p>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8">
          <h2 className="text-xl font-poppins font-semibold text-charcoal mb-4">
            Find Your Perfect Freelancer
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Skills, keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
              />
            </div>

            {/* Category */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Experience Level */}
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger>
                <SelectValue placeholder="Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="entry">Entry Level</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="expert">Expert</SelectItem>
              </SelectContent>
            </Select>

            {/* Budget Range */}
            <Select value={budgetRange} onValueChange={setBudgetRange}>
              <SelectTrigger>
                <SelectValue placeholder="Budget" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Any Budget</SelectItem>
                <SelectItem value="budget">₹800-3200/hr</SelectItem>
                <SelectItem value="standard">₹3200-6400/hr</SelectItem>
                <SelectItem value="premium">₹6400+/hr</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Top Freelancers Spotlight */}
        {topFreelancers.length > 0 && (
          <div className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <Star className="w-6 h-6 text-yellow-500 mr-2" />
                <h2 className="text-2xl font-poppins font-bold text-charcoal">
                  Featured Top Performers
                </h2>
              </div>
              <Button variant="outline" onClick={() => window.location.href = "/top-freelancers"}>
                View All Top Freelancers
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {topFreelancers.slice(0, 3).map((freelancer) => (
                <div key={freelancer.id} className="relative">
                  <Badge className="absolute -top-2 -right-2 z-10 bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900">
                    Top Rated
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

        {/* Search Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-poppins font-bold text-charcoal">
              {filteredFreelancers.length > 0 ? "Available Freelancers" : "All Freelancers"}
            </h2>
            <p className="text-muted-foreground">
              {filteredFreelancers.length} professionals found
            </p>
          </div>

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
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredFreelancers.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🔍</div>
                  <h3 className="text-xl font-semibold text-charcoal mb-2">No freelancers match your criteria</h3>
                  <p className="text-muted-foreground mb-6">
                    Try adjusting your filters or search terms to find more professionals
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("");
                      setExperienceLevel("");
                      setBudgetRange("");
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredFreelancers.map((freelancer, index) => (
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
              )}
            </>
          )}
        </div>

        {/* Call to Action */}
        <div className="text-center bg-gradient-to-r from-primary/10 to-purple-600/10 rounded-2xl p-8 shadow-lg border border-border">
          <h3 className="text-2xl font-poppins font-bold text-charcoal mb-4">
            Can't find the right fit?
          </h3>
          <p className="text-muted-foreground mb-6">
            Post your project requirements and let qualified freelancers come to you
          </p>
          <div className="flex justify-center gap-4">
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => window.location.href = "/post-job"}
            >
              <Clock className="w-5 h-5 mr-2" />
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
      </div>
    </div>
  );
}