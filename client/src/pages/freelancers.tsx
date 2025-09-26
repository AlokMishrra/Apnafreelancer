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
import { Search, Filter, Users, Star } from "lucide-react";
import type { User, Category } from "@shared/schema";

// Custom interface for demo freelancers
interface DemoFreelancer {
  id: string;
  firstName: string;
  lastName: string;
  profileImageUrl: string;
  bio: string;
  skills: string[];
  hourlyRate: number;
  rating: number;
  totalReviews: number;
  location: string;
  availability: string;
  createdAt: Date;
}

// Dummy data for categories
const dummyCategories = [
  { id: 1, name: "Web Development", description: "Frontend & Backend Development", icon: "💻" },
  { id: 2, name: "Graphic Design", description: "Logo, Branding, UI/UX", icon: "🎨" },
  { id: 3, name: "Digital Marketing", description: "SEO, Social Media, Ads", icon: "📱" },
  { id: 4, name: "Writing & Translation", description: "Content, Copywriting, Translation", icon: "✍️" },
  { id: 5, name: "Video & Animation", description: "Video Editing, Motion Graphics", icon: "🎬" },
  { id: 6, name: "Music & Audio", description: "Voice Over, Music Production", icon: "🎵" },
];

// Dummy data for freelancers
const dummyFreelancers: DemoFreelancer[] = [
  {
    id: "1",
    firstName: "Alex",
    lastName: "Johnson",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    bio: "Full-stack developer with 5+ years experience in React, Node.js, and cloud technologies. Specialized in building scalable web applications.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    hourlyRate: 85,
    rating: 4.9,
    totalReviews: 127,
    location: "San Francisco, CA",
    availability: "available",
    createdAt: new Date("2023-01-15"),
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Williams",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b192?w=150",
    bio: "Creative graphic designer and UI/UX specialist. I help brands tell their story through beautiful, functional design.",
    location: "New York, NY",
    hourlyRate: 75,
    rating: 4.8,
    totalReviews: 89,
    skills: ["Adobe Creative Suite", "Figma", "UI/UX Design", "Brand Identity", "Web Design"],
    availability: "available",
    createdAt: new Date("2023-02-20"),
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Chen",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    bio: "Digital marketing expert with proven track record in SEO, PPC, and social media marketing. Helped 100+ businesses grow online.",
    location: "Austin, TX",
    hourlyRate: 65,
    rating: 4.7,
    totalReviews: 156,
    skills: ["SEO", "Google Ads", "Facebook Ads", "Content Marketing", "Analytics"],
    availability: "available",
    createdAt: new Date("2023-03-10"),
  },
  {
    id: "4",
    firstName: "Emma",
    lastName: "Thompson",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    bio: "Professional copywriter and content strategist. I create compelling content that drives engagement and conversions.",
    location: "London, UK",
    hourlyRate: 45,
    rating: 4.9,
    totalReviews: 203,
    skills: ["Copywriting", "Content Strategy", "Blog Writing", "Email Marketing", "SEO Writing"],
    availability: "available",
    createdAt: new Date("2023-04-05"),
  },
  {
    id: "5",
    firstName: "David",
    lastName: "Rodriguez",
    profileImageUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    bio: "Video editor and motion graphics artist. Specialized in creating engaging content for social media and marketing campaigns.",
    location: "Los Angeles, CA",
    hourlyRate: 70,
    rating: 4.8,
    totalReviews: 94,
    skills: ["After Effects", "Premiere Pro", "Motion Graphics", "Color Grading", "Sound Design"],
    availability: "available",
    createdAt: new Date("2023-05-12"),
  },
  {
    id: "6",
    firstName: "Lisa",
    lastName: "Park",
    profileImageUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150",
    bio: "Professional voice over artist with home studio. Experienced in commercials, e-learning, and audiobook narration.",
    location: "Toronto, Canada",
    hourlyRate: 55,
    rating: 4.9,
    totalReviews: 78,
    skills: ["Voice Over", "Audio Production", "Sound Editing", "Script Reading", "Dubbing"],
    availability: "available",
    createdAt: new Date("2023-06-18"),
  },
  {
    id: "7",
    firstName: "John",
    lastName: "Anderson",
    profileImageUrl: "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150",
    bio: "Mobile app developer with expertise in iOS and Android development. Created 50+ successful mobile applications.",
    location: "Seattle, WA",
    hourlyRate: 95,
    rating: 4.8,
    totalReviews: 67,
    skills: ["Swift", "Kotlin", "React Native", "Flutter", "Firebase"],
    availability: "available",
    createdAt: new Date("2023-07-22"),
  },
  {
    id: "8",
    firstName: "Anna",
    lastName: "Kowalski",
    profileImageUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
    bio: "Social media manager and content creator. I help businesses build engaged communities and increase brand awareness.",
    location: "Berlin, Germany",
    hourlyRate: 40,
    rating: 4.7,
    totalReviews: 112,
    skills: ["Social Media Management", "Content Creation", "Instagram Marketing", "TikTok", "Community Building"],
    availability: "available",
    createdAt: new Date("2023-08-14"),
  },
];

export default function Freelancers() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("rating");
  const [isLoadingState, setIsLoadingState] = useState(false);

  // Use dummy data instead of API calls for now
  const categories = dummyCategories;
  const allFreelancers = dummyFreelancers;

  // Filter freelancers based on search and category
  const filteredFreelancers = allFreelancers.filter(freelancer => {
    const matchesSearch = searchQuery === "" || 
      `${freelancer.firstName} ${freelancer.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      freelancer.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "" || selectedCategory === "all" || 
      freelancer.skills?.some(skill => {
        const category = categories.find(cat => cat.id.toString() === selectedCategory);
        return category && skill.toLowerCase().includes(category.name.toLowerCase().split(' ')[0]);
      });
    
    return matchesSearch && matchesCategory;
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

  const sortedFreelancers = [...filteredFreelancers].sort((a, b) => {
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center mb-4">
            <Users className="w-8 h-8 text-primary mr-3 animate-pulse" />
            <h1 className="text-4xl font-poppins font-bold text-foreground dark:text-white" data-testid="title-freelancers">
              Find Freelancers
            </h1>
          </div>
          <p className="text-xl text-muted-foreground dark:text-slate-300">
            Connect with talented professionals from around the world
          </p>
          <div className="flex items-center mt-4 text-sm text-muted-foreground dark:text-slate-400">
            <Star className="w-4 h-4 text-yellow-500 mr-1" />
            <span>Top-rated freelancers ready to bring your projects to life</span>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-card/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border dark:border-slate-700 p-6 mb-8 animate-slide-up hover:shadow-xl transition-all duration-300">
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
        {isLoadingState ? (
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
                      freelancer={freelancer as any}
                      onViewProfile={() => console.log("View freelancer profile:", freelancer.id)}
                    />
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Call to Action */}
        {!isLoadingState && sortedFreelancers.length > 0 && (
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
