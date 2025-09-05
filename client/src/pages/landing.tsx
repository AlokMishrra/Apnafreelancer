import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServiceCard from "@/components/service-card";
import FreelancerCard from "@/components/freelancer-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { Service, User, Category } from "@shared/schema";

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: services = [] } = useQuery<Service[]>({
    queryKey: ["/api/services"],
  });

  const { data: topFreelancers = [] } = useQuery<User[]>({
    queryKey: ["/api/freelancers/top", { limit: 8 }],
  });

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Navigate to services page with search query
    window.location.href = `/services?search=${encodeURIComponent(query)}`;
  };

  const handleServiceClick = (serviceId: number) => {
    // Navigate to service detail (could be implemented later)
    console.log("View service:", serviceId);
  };

  const handleFreelancerClick = (freelancerId: string) => {
    // Navigate to freelancer profile (could be implemented later)
    console.log("View freelancer:", freelancerId);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Service Categories */}
      <section className="py-20 bg-background" data-testid="section-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-poppins font-bold text-charcoal mb-4">
              Popular Services
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most in-demand freelance services across various categories
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {services.slice(0, 8).map((service, index) => {
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
                    onClick={() => handleServiceClick(service.id)}
                  />
                </div>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/services">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105"
                data-testid="button-view-all-services"
              >
                View All Services
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Top Freelancers */}
      <section className="py-20 bg-secondary" data-testid="section-freelancers">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-poppins font-bold text-charcoal mb-4">
              Top Freelancers
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with talented professionals who deliver exceptional results
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {topFreelancers.map((freelancer, index) => (
              <div
                key={freelancer.id}
                className="animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <FreelancerCard
                  freelancer={freelancer}
                  onViewProfile={() => handleFreelancerClick(freelancer.id)}
                />
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/freelancers">
              <Button
                size="lg"
                className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105"
                data-testid="button-view-all-freelancers"
              >
                View All Freelancers
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-background" data-testid="section-how-it-works">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-4xl font-poppins font-bold text-charcoal mb-4">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get started in minutes with our simple three-step process
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center animate-slide-up">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-primary-foreground">1</span>
              </div>
              <h3 className="text-2xl font-poppins font-semibold text-charcoal mb-4">
                Post Your Project
              </h3>
              <p className="text-muted-foreground text-lg">
                Tell us about your project requirements, budget, and timeline. Our platform will
                match you with suitable freelancers.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.2s" }}>
              <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-accent-foreground">2</span>
              </div>
              <h3 className="text-2xl font-poppins font-semibold text-charcoal mb-4">
                Choose Your Freelancer
              </h3>
              <p className="text-muted-foreground text-lg">
                Review proposals, check portfolios and ratings, then select the perfect freelancer
                for your project.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <div className="w-20 h-20 bg-gradient-to-br from-chart-3 to-chart-3 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <span className="text-2xl font-bold text-primary-foreground">3</span>
              </div>
              <h3 className="text-2xl font-poppins font-semibold text-charcoal mb-4">
                Get Work Done
              </h3>
              <p className="text-muted-foreground text-lg">
                Collaborate with your freelancer, track progress, and receive high-quality results
                on time and budget.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-charcoal text-primary-foreground py-16" data-testid="section-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center">
                  <span className="text-primary-foreground text-lg">🛡️</span>
                </div>
                <div className="text-xl font-poppins font-bold">ApnaFreelancer</div>
              </div>
              <p className="text-muted-foreground mb-4">
                Connecting talented freelancers with businesses worldwide. Build your career or grow
                your business with confidence.
              </p>
            </div>

            {/* For Clients */}
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4">For Clients</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/post-job">
                    <a className="text-muted-foreground hover:text-primary transition-colors duration-200">
                      How to Hire
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/freelancers">
                    <a className="text-muted-foreground hover:text-primary transition-colors duration-200">
                      Talent Marketplace
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/services">
                    <a className="text-muted-foreground hover:text-primary transition-colors duration-200">
                      Project Catalog
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Freelancers */}
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4">For Freelancers</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/services">
                    <a className="text-muted-foreground hover:text-primary transition-colors duration-200">
                      How to Find Work
                    </a>
                  </Link>
                </li>
                <li>
                  <Link href="/services">
                    <a className="text-muted-foreground hover:text-primary transition-colors duration-200">
                      Find Freelance Jobs
                    </a>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div>
              <h3 className="font-poppins font-semibold text-lg mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-muted-foreground hover:text-primary transition-colors duration-200"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="text-muted-foreground text-sm">
                © 2024 ApnaFreelancer. All rights reserved.
              </div>
              <div className="flex items-center space-x-6 mt-4 md:mt-0">
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  Privacy Policy
                </a>
                <a
                  href="#"
                  className="text-muted-foreground hover:text-primary transition-colors duration-200 text-sm"
                >
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
