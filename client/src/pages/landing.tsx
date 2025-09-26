import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import ServiceCard from "@/components/service-card";
import FreelancerCard from "@/components/freelancer-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, TrendingUp, Zap } from "lucide-react";
import type { Service, User, Category } from "@shared/schema";

// Popular services dummy data
const popularServices = [
  {
    id: 1,
    title: "I will create a modern website with React",
    description: "Professional website development with React, TypeScript, and modern design principles. Mobile-responsive and SEO optimized.",
    price: "299",
    deliveryTime: 7,
    categoryId: 1,
    freelancerId: "1",
    skills: ["React", "TypeScript", "Tailwind CSS", "Node.js"],
    images: ["https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400"],
    rating: 4.9,
    reviewCount: 156,
    isPopular: true,
    createdAt: new Date("2024-01-15"),
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    updatedAt: new Date("2024-01-15"),
  },
  {
    id: 2,
    title: "I will design your logo and brand identity",
    description: "Complete brand identity package including logo design, color palette, typography, and brand guidelines for your business.",
    price: "199",
    deliveryTime: 5,
    categoryId: 2,
    freelancerId: "2",
    skills: ["Logo Design", "Brand Identity", "Adobe Illustrator", "Figma"],
    images: ["https://images.unsplash.com/photo-1626785774573-4b799315345d?w=400"],
    rating: 4.8,
    reviewCount: 243,
    isPopular: true,
    createdAt: new Date("2024-01-20"),
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    updatedAt: new Date("2024-01-20"),
  },
  {
    id: 3,
    title: "I will boost your SEO rankings",
    description: "Complete SEO optimization service to improve your website's visibility and drive organic traffic from search engines.",
    price: "149",
    deliveryTime: 14,
    categoryId: 3,
    freelancerId: "3",
    skills: ["SEO", "Google Analytics", "Keyword Research", "Link Building"],
    images: ["https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400"],
    rating: 4.7,
    reviewCount: 189,
    isPopular: true,
    createdAt: new Date("2024-01-25"),
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    updatedAt: new Date("2024-01-25"),
  },
  {
    id: 4,
    title: "I will write engaging content for your blog",
    description: "High-quality, SEO-optimized blog posts and articles that engage your audience and drive conversions.",
    price: "79",
    deliveryTime: 3,
    categoryId: 4,
    freelancerId: "4",
    skills: ["Content Writing", "SEO Writing", "Copywriting", "Research"],
    images: ["https://images.unsplash.com/photo-1486312338219-ce68e2c6b952?w=400"],
    rating: 4.9,
    reviewCount: 312,
    isPopular: true,
    createdAt: new Date("2024-02-01"),
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    updatedAt: new Date("2024-02-01"),
  },
  {
    id: 5,
    title: "I will create stunning video content",
    description: "Professional video editing and motion graphics for social media, marketing campaigns, and promotional content.",
    price: "249",
    deliveryTime: 5,
    categoryId: 5,
    freelancerId: "5",
    skills: ["Video Editing", "After Effects", "Motion Graphics", "Color Grading"],
    images: ["https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?w=400"],
    rating: 4.8,
    reviewCount: 127,
    isPopular: true,
    createdAt: new Date("2024-02-05"),
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    updatedAt: new Date("2024-02-05"),
  },
  {
    id: 6,
    title: "I will provide professional voice over",
    description: "High-quality voice over services for commercials, explainer videos, audiobooks, and e-learning content.",
    price: "89",
    deliveryTime: 2,
    categoryId: 6,
    freelancerId: "6",
    skills: ["Voice Over", "Audio Production", "Script Reading", "Sound Design"],
    images: ["https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400"],
    rating: 4.9,
    reviewCount: 198,
    isPopular: true,
    createdAt: new Date("2024-02-10"),
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    updatedAt: new Date("2024-02-10"),
  },
  {
    id: 7,
    title: "I will develop your mobile app",
    description: "Cross-platform mobile application development using React Native or Flutter for iOS and Android.",
    price: "599",
    deliveryTime: 21,
    categoryId: 1,
    freelancerId: "7",
    skills: ["React Native", "Flutter", "Mobile Development", "UI/UX"],
    images: ["https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400"],
    rating: 4.8,
    reviewCount: 89,
    isPopular: true,
    createdAt: new Date("2024-02-12"),
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    updatedAt: new Date("2024-02-12"),
  },
  {
    id: 8,
    title: "I will manage your social media",
    description: "Complete social media management including content creation, posting schedule, and community engagement.",
    price: "299",
    deliveryTime: 30,
    categoryId: 3,
    freelancerId: "8",
    skills: ["Social Media", "Content Creation", "Community Management", "Analytics"],
    images: ["https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400"],
    rating: 4.7,
    reviewCount: 156,
    isPopular: true,
    createdAt: new Date("2024-02-15"),
    status: "approved",
    isActive: true,
    approvedBy: null,
    approvedAt: null,
    rejectionReason: null,
    updatedAt: new Date("2024-02-15"),
  },
];

// Categories data
const serviceCategories = [
  { id: 1, name: "Web Development", description: "Frontend & Backend Development", icon: "💻", createdAt: null },
  { id: 2, name: "Graphic Design", description: "Logo, Branding, UI/UX", icon: "🎨", createdAt: null },
  { id: 3, name: "Digital Marketing", description: "SEO, Social Media, Ads", icon: "📱", createdAt: null },
  { id: 4, name: "Writing & Translation", description: "Content, Copywriting, Translation", icon: "✍️", createdAt: null },
  { id: 5, name: "Video & Animation", description: "Video Editing, Motion Graphics", icon: "🎬", createdAt: null },
  { id: 6, name: "Music & Audio", description: "Voice Over, Music Production", icon: "🎵", createdAt: null },
];

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState("");

  // Use dummy data instead of API calls for now
  const categories = serviceCategories;
  const services = popularServices as any[];
  // Top Freelancers - using dummy data and type assertions for demo purposes
const topFreelancers = [
  {
    id: "1",
    firstName: "Alex",
    lastName: "Johnson",
    profileImageUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
    bio: "Full-stack developer with 5+ years experience in React, Node.js, and cloud technologies. Specialized in building scalable web applications.",
    skills: ["React", "Node.js", "TypeScript", "AWS", "MongoDB"],
    hourlyRate: "800",
    rating: "4.9",
    totalReviews: 127,
    location: "Mumbai, India",
    availability: "available",
    createdAt: new Date("2023-01-15"),
    email: null,
    password: null,
    isFreelancer: true,
    isClient: false,
    isAdmin: false,
    status: "approved",
    updatedAt: null,
    approvedBy: null,
    approvedAt: null
  },
  {
    id: "2",
    firstName: "Sarah",
    lastName: "Williams",
    profileImageUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b192?w=150",
    bio: "Creative graphic designer and UI/UX specialist. I help brands tell their story through beautiful, functional design.",
    location: "Bangalore, India",
    hourlyRate: "750",
    rating: "4.8",
    totalReviews: 89,
    skills: ["Adobe Creative Suite", "Figma", "UI/UX Design", "Brand Identity", "Web Design"],
    availability: "available",
    createdAt: new Date("2023-02-20"),
    email: null,
    password: null,
    isFreelancer: true,
    isClient: false,
    isAdmin: false,
    status: "approved",
    updatedAt: null,
    approvedBy: null,
    approvedAt: null
  },
  {
    id: "3",
    firstName: "Mike",
    lastName: "Kumar",
    profileImageUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    bio: "Digital marketing expert with proven track record in SEO, PPC, and social media marketing. Helped 100+ businesses grow online.",
    location: "Delhi, India",
    hourlyRate: "650",
    rating: "4.7",
    totalReviews: 156,
    skills: ["SEO", "Google Ads", "Facebook Ads", "Content Marketing", "Analytics"],
    availability: "available",
    createdAt: new Date("2023-03-10"),
    email: null,
    password: null,
    isFreelancer: true,
    isClient: false,
    isAdmin: false,
    status: "approved",
    updatedAt: null,
    approvedBy: null,
    approvedAt: null
  },
  {
    id: "4",
    firstName: "Priya",
    lastName: "Sharma",
    profileImageUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    bio: "Professional copywriter and content strategist. I create compelling content that drives engagement and conversions.",
    location: "Hyderabad, India",
    hourlyRate: "450",
    rating: "4.9",
    totalReviews: 203,
    skills: ["Copywriting", "Content Strategy", "Blog Writing", "Email Marketing", "SEO Writing"],
    availability: "available",
    createdAt: new Date("2023-04-05"),
    email: null,
    password: null,
    isFreelancer: true,
    isClient: false,
    isAdmin: false,
    status: "approved",
    updatedAt: null,
    approvedBy: null,
    approvedAt: null
  }
] as User[];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Navigate to services page with search query
    window.location.href = `/services?search=${encodeURIComponent(query)}`;
  };

  const handleServiceClick = (serviceId: number) => {
    window.location.href = `/services/${serviceId}`;
  };

  const handleFreelancerClick = (freelancerId: string) => {
    window.location.href = `/freelancers/${freelancerId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <HeroSection onSearch={handleSearch} />

      {/* Service Categories */}
      <section className="py-20 bg-gradient-to-br from-background via-background to-muted/20 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900" data-testid="section-services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 animate-fade-in">
            <div className="flex items-center justify-center mb-4">
              <TrendingUp className="w-8 h-8 text-primary mr-3 animate-pulse" />
              <h2 className="text-4xl font-poppins font-bold text-foreground dark:text-white">
                Popular Services
              </h2>
              <Zap className="w-8 h-8 text-yellow-500 ml-3 animate-bounce" />
            </div>
            <p className="text-xl text-muted-foreground dark:text-slate-300 max-w-2xl mx-auto">
              Discover the most in-demand freelance services across various categories
            </p>
            <div className="flex items-center justify-center mt-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                ⭐ Top Rated Services
              </Badge>
            </div>
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
                    service={service as any}
                    category={category as any}
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
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-purple-600 hover:to-blue-500 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 py-3 rounded-xl"
                data-testid="button-view-all-services"
              >
                <TrendingUp className="w-5 h-5 mr-2" />
                View All Services
                <span className="ml-2 bg-white/20 px-2 py-1 rounded-full text-xs">1000+</span>
              </Button>
            </Link>
            <p className="text-sm text-muted-foreground dark:text-slate-400 mt-3">
              Join thousands of satisfied clients who found their perfect freelancer
            </p>
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
