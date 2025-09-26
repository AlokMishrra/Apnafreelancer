import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import Navigation from "@/components/navigation";
import ServiceCard from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Sparkles } from "lucide-react";
import type { Service, Category } from "@shared/schema";

// Dummy data for categories
const dummyCategories: Category[] = [
  { id: 1, name: "Web Development", description: "Frontend & Backend Development", icon: "💻", createdAt: null },
  { id: 2, name: "Graphic Design", description: "Logo, Branding, UI/UX", icon: "🎨", createdAt: null },
  { id: 3, name: "Digital Marketing", description: "SEO, Social Media, Ads", icon: "📱", createdAt: null },
  { id: 4, name: "Writing & Translation", description: "Content, Copywriting, Translation", icon: "✍️", createdAt: null },
  { id: 5, name: "Video & Animation", description: "Video Editing, Motion Graphics", icon: "🎬", createdAt: null },
  { id: 6, name: "Music & Audio", description: "Voice Over, Music Production", icon: "🎵", createdAt: null },
];

// Dummy data for services
const dummyServices: Service[] = [
  {
    id: 1,
    title: "Professional Website Development",
    description: "I will create a modern, responsive website with React and TypeScript. Perfect for businesses looking to establish their online presence.",
    price: "299",
    deliveryTime: 7,
    categoryId: 1,
    freelancerId: "1",
    skills: ["React", "TypeScript", "Node.js", "MongoDB"],
    images: ["https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400"],
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-01-15"),
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    title: "Logo Design & Brand Identity",
    description: "Custom logo design with complete brand identity package including color palette, typography, and brand guidelines.",
    price: "199",
    deliveryTime: 5,
    categoryId: 2,
    freelancerId: "2",
    skills: ["Adobe Illustrator", "Photoshop", "Brand Design"],
    images: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400"],
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-01-20"),
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    title: "SEO Optimization & Strategy",
    description: "Complete SEO audit and optimization to improve your website's ranking on Google and drive organic traffic.",
    price: "149",
    deliveryTime: 10,
    categoryId: 3,
    freelancerId: "3",
    skills: ["SEO", "Google Analytics", "Keyword Research"],
    images: ["https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=400"],
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-01-25"),
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: 4,
    title: "Content Writing & Copywriting",
    description: "Engaging blog posts, website copy, and marketing content that converts visitors into customers.",
    price: "99",
    deliveryTime: 3,
    categoryId: 4,
    freelancerId: "4",
    skills: ["Content Writing", "Copywriting", "Blog Writing"],
    images: ["https://images.unsplash.com/photo-1486312338219-ce68e2c6b952?w=400"],
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-02-01"),
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: 5,
    title: "Video Editing & Motion Graphics",
    description: "Professional video editing with motion graphics, color correction, and sound design for social media and marketing.",
    price: "249",
    deliveryTime: 5,
    categoryId: 5,
    freelancerId: "5",
    skills: ["After Effects", "Premiere Pro", "Motion Graphics"],
    images: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400"],
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-02-05"),
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: 6,
    title: "Voice Over & Audio Production",
    description: "Professional voice over services for commercials, explainer videos, and audiobooks with studio-quality audio.",
    price: "79",
    deliveryTime: 2,
    categoryId: 6,
    freelancerId: "6",
    skills: ["Voice Over", "Audio Editing", "Sound Design"],
    images: ["https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400"],
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-02-10"),
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: 7,
    title: "Mobile App Development",
    description: "Cross-platform mobile app development using React Native. From concept to App Store deployment.",
    price: "599",
    deliveryTime: 14,
    categoryId: 1,
    freelancerId: "7",
    skills: ["React Native", "Flutter", "iOS", "Android"],
    images: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400"],
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-02-12"),
    updatedAt: new Date("2024-02-12"),
  },
  {
    id: 8,
    title: "Social Media Design Package",
    description: "Complete social media design package with templates for Instagram, Facebook, and LinkedIn posts.",
    price: "129",
    deliveryTime: 4,
    categoryId: 2,
    freelancerId: "8",
    skills: ["Social Media Design", "Canva", "Adobe Creative Suite"],
    images: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400"],
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    createdAt: new Date("2024-02-15"),
    updatedAt: new Date("2024-02-15"),
  },
];

export default function Services() {
  const [location] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [sortBy, setSortBy] = useState("newest");
  const [isLoading, setIsLoading] = useState(false);

  // Use dummy data instead of API calls for now
  const categories = dummyCategories;
  const allServices = dummyServices;

  // Filter services based on search and category
  const filteredServices = allServices.filter(service => {
    const matchesSearch = searchQuery === "" || 
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.skills?.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = selectedCategory === "" || selectedCategory === "all" || 
      service.categoryId.toString() === selectedCategory;
    
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

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "price-low":
        return Number(a.price) - Number(b.price);
      case "price-high":
        return Number(b.price) - Number(a.price);
      case "newest":
      default:
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 transition-all duration-500">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <div className="flex items-center mb-4">
            <Sparkles className="w-8 h-8 text-primary mr-3 animate-pulse" />
            <h1 className="text-4xl font-poppins font-bold text-foreground dark:text-white" data-testid="title-services">
              Browse Services
            </h1>
          </div>
          <p className="text-xl text-muted-foreground dark:text-slate-300">
            Discover amazing freelance services from talented professionals worldwide
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-card/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-lg border border-border dark:border-slate-700 p-6 mb-8 animate-slide-up hover:shadow-xl transition-all duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pl-10"
                data-testid="input-search-services"
              />
            </div>

            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger data-testid="select-category-filter">
                <SelectValue placeholder="All Categories" />
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

            {/* Sort */}
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger data-testid="select-sort">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {/* Search Button */}
            <Button
              onClick={handleSearch}
              className="bg-primary text-primary-foreground"
              data-testid="button-search-services"
            >
              <Search className="w-4 h-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6">
          <p className="text-muted-foreground" data-testid="text-results-count">
            {sortedServices.length} services found
            {searchQuery && ` for "${searchQuery}"`}
          </p>
        </div>

        {/* Services Grid */}
        {sortedServices.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-charcoal mb-2">No services found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse different categories
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedServices.map((service, index) => {
              const category = categories.find((cat) => cat.id === service.categoryId);
              return (
                <div
                  key={service.id}
                  className="animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <ServiceCard
                    service={service}
                    category={category}
                    onClick={() => console.log("View service:", service.id)}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
