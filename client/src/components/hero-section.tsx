import { useState } from "react";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroSectionProps {
  onSearch?: (query: string) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (onSearch) {
      onSearch(searchQuery);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const popularSearches = [
    "Web Development",
    "Logo Design", 
    "Mobile Apps",
    "Content Writing"
  ];

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-background via-secondary to-background overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-float" />
        <div
          className="absolute top-40 right-20 w-72 h-72 bg-accent rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 left-1/3 w-72 h-72 bg-primary rounded-full mix-blend-multiply filter blur-xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Hero Content */}
          <div className="text-center lg:text-left animate-fade-in">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-poppins font-bold text-charcoal mb-6 leading-tight">
              Find the Perfect
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                {" "}Freelance{" "}
              </span>
              Services for Your Business
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0">
              Connect with talented freelancers from around the world. Get quality work done faster,
              easier, and more securely than ever before.
            </p>

            {/* Hero Search Bar */}
            <div className="bg-card p-2 rounded-2xl shadow-xl border border-border max-w-2xl mx-auto lg:mx-0 mb-8">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="What service are you looking for?"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="w-full pl-12 pr-4 py-4 rounded-xl border-0 focus:outline-none focus:ring-2 focus:ring-ring bg-background"
                    data-testid="input-hero-search"
                  />
                </div>
                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center"
                  data-testid="button-hero-search"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Search
                </Button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
              <span className="text-muted-foreground text-sm">Popular:</span>
              {popularSearches.map((search) => (
                <Button
                  key={search}
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchQuery(search);
                    if (onSearch) onSearch(search);
                  }}
                  className="text-sm hover:bg-accent hover:text-accent-foreground transition-colors duration-200"
                  data-testid={`button-popular-${search.toLowerCase().replace(" ", "-")}`}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Hero Visual */}
          <div className="relative animate-scale-in">
            <img
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
              alt="Team of professionals collaborating on digital projects"
              className="rounded-2xl shadow-2xl w-full h-auto"
              data-testid="img-hero"
            />

            {/* Floating stats cards */}
            <div className="absolute -top-4 -left-4 bg-card p-4 rounded-xl shadow-xl border border-border animate-float">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <span className="text-primary-foreground text-sm font-bold">👥</span>
                </div>
                <div>
                  <div className="font-bold text-charcoal" data-testid="stat-freelancers">50K+</div>
                  <div className="text-sm text-muted-foreground">Active Freelancers</div>
                </div>
              </div>
            </div>

            <div
              className="absolute -bottom-4 -right-4 bg-card p-4 rounded-xl shadow-xl border border-border animate-float"
              style={{ animationDelay: "1s" }}
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center">
                  <span className="text-accent-foreground text-sm font-bold">⭐</span>
                </div>
                <div>
                  <div className="font-bold text-charcoal" data-testid="stat-rating">4.9/5</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
