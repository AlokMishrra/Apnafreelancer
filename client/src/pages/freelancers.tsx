import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/navigation";
import FreelancerCard from "@/components/freelancer-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Users } from "lucide-react";
import type { User, Category } from "@shared/schema";

export default function Freelancers() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("rating");

  // No authentication required for browsing freelancers

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: freelancers = [], isLoading: freelancersLoading } = useQuery<User[]>({
    queryKey: ["/api/freelancers", { categoryId: selectedCategory === "all" ? "" : selectedCategory, search: searchQuery }],
  });

  // Get search query from URL params
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchParam = urlParams.get("search");
    if (searchParam) {
      setSearchQuery(searchParam);
    }
  }, [location]);

  const handleSearch = () => {
    // Trigger refetch with new search params
    // The query will automatically refetch due to the dependency
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const sortedFreelancers = [...freelancers].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return (Number(b.rating) || 0) - (Number(a.rating) || 0);
      case "rate-low":
        return (Number(a.hourlyRate) || 0) - (Number(b.hourlyRate) || 0);
      case "rate-high":
        return (Number(b.hourlyRate) || 0) - (Number(a.hourlyRate) || 0);
      case "newest":
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  // Remove authentication check for public freelancer browsing

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl font-poppins font-bold text-charcoal" data-testid="title-freelancers">
              Find Freelancers
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Connect with talented professionals from around the world
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card rounded-2xl shadow-lg border border-border p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search freelancers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                data-testid="input-search-freelancers"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="select-category-filter">
                <SelectValue placeholder="All Skills" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Skills</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id.toString()}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="rate-low">Rate: Low to High</SelectItem>
                <SelectItem value="rate-high">Rate: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground"
              data-testid="button-search-freelancers"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground" data-testid="text-results-count">
            {sortedFreelancers.length} freelancers found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Loading State */}
        {freelancersLoading ? (
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
            {/* Freelancers Grid */}
            {sortedFreelancers.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-charcoal mb-2">No freelancers found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your search criteria or browse different skill categories
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {sortedFreelancers.map((freelancer, index) => (
                  <div
                    key={freelancer.id}
                    className="animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <FreelancerCard
                      freelancer={freelancer}
                      onViewProfile={() => console.log("View freelancer profile:", freelancer.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        {!freelancersLoading && sortedFreelancers.length > 0 && (
          <div className="text-center mt-12 bg-card rounded-2xl p-8 shadow-lg border border-border">
            <h3 className="text-2xl font-poppins font-bold text-charcoal mb-4">
              Ready to start your project?
            </h3>
            <p className="text-muted-foreground mb-6">
              Post your job requirements and get proposals from these talented freelancers
            </p>
            <Button
              size="lg"
              className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105"
              onClick={() => window.location.href = "/post-job"}
              data-testid="button-post-job-cta"
            >
              Post a Job
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
