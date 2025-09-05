import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Navigation from "@/components/navigation";
import ServiceCard from "@/components/service-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, MapPin, Clock, DollarSign, ArrowLeft, MessageCircle, Briefcase } from "lucide-react";
import type { Service, User } from "@shared/schema";

export default function FreelancerProfile() {
  const { id } = useParams();

  const { data: freelancer, isLoading: freelancerLoading } = useQuery<User>({
    queryKey: [`/api/users/${id}`],
    enabled: !!id,
  });

  const { data: services = [], isLoading: servicesLoading } = useQuery<Service[]>({
    queryKey: [`/api/services/by-freelancer/${id}`],
    enabled: !!id,
  });

  if (freelancerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!freelancer) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Freelancer Not Found</h1>
            <p className="text-gray-600 mb-8">The freelancer profile you're looking for doesn't exist.</p>
            <Link href="/freelancers">
              <Button>Browse Freelancers</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleServiceClick = (serviceId: number) => {
    window.location.href = `/services/${serviceId}`;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href="/freelancers">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-freelancers">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Freelancers
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Profile sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Profile Card */}
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="w-24 h-24 mx-auto mb-4">
                    <AvatarFallback className="bg-gradient-to-br from-primary to-primary text-white text-2xl">
                      {freelancer.firstName?.[0]}{freelancer.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  
                  <h1 className="text-2xl font-bold text-gray-900 mb-2" data-testid="freelancer-name">
                    {freelancer.firstName} {freelancer.lastName}
                  </h1>
                  
                  {freelancer.location && (
                    <div className="flex items-center justify-center text-gray-600 mb-4">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span data-testid="freelancer-location">{freelancer.location}</span>
                    </div>
                  )}

                  {/* Rating */}
                  <div className="flex items-center justify-center mb-4">
                    <div className="flex items-center">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="font-semibold ml-1" data-testid="freelancer-rating">
                        {freelancer.rating}
                      </span>
                    </div>
                    <span className="text-gray-500 ml-2" data-testid="freelancer-reviews">
                      ({freelancer.totalReviews} reviews)
                    </span>
                  </div>

                  {/* Hourly Rate */}
                  {freelancer.hourlyRate && (
                    <div className="flex items-center justify-center mb-6">
                      <DollarSign className="w-5 h-5 text-green-600" />
                      <span className="text-xl font-bold text-green-600" data-testid="freelancer-hourly-rate">
                        ${freelancer.hourlyRate}/hr
                      </span>
                    </div>
                  )}

                  {/* Availability */}
                  <div className="mb-6">
                    <Badge 
                      variant={freelancer.availability === "available" ? "default" : "secondary"}
                      data-testid="freelancer-availability"
                    >
                      <Clock className="w-3 h-3 mr-1" />
                      {freelancer.availability === "available" ? "Available Now" : "Busy"}
                    </Badge>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      className="w-full bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary"
                      data-testid="button-contact-freelancer"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Contact Freelancer
                    </Button>
                    <Button variant="outline" className="w-full" data-testid="button-add-to-favorites">
                      Add to Favorites
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Skills Card */}
              {freelancer.skills && freelancer.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Skills & Expertise</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {freelancer.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" data-testid={`skill-${index}`}>
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">About {freelancer.firstName}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed" data-testid="freelancer-bio">
                  {freelancer.bio || "This freelancer hasn't added a bio yet."}
                </p>
              </CardContent>
            </Card>

            {/* Services Section */}
            <div>
              <div className="flex items-center mb-6">
                <Briefcase className="w-6 h-6 mr-2 text-primary" />
                <h2 className="text-2xl font-bold text-gray-900">Services Offered</h2>
                <Badge variant="secondary" className="ml-3" data-testid="services-count">
                  {services.length} {services.length === 1 ? 'service' : 'services'}
                </Badge>
              </div>

              {servicesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  ))}
                </div>
              ) : services.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6" data-testid="services-grid">
                  {services.map((service) => (
                    <ServiceCard
                      key={service.id}
                      service={service}
                      onClick={() => handleServiceClick(service.id)}
                    />
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No Services Yet</h3>
                    <p className="text-gray-600">
                      {freelancer.firstName} hasn't listed any services yet.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Stats Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Profile Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="stat-services">
                      {services.length}
                    </div>
                    <div className="text-sm text-gray-600">Active Services</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="stat-reviews">
                      {freelancer.totalReviews}
                    </div>
                    <div className="text-sm text-gray-600">Reviews</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="stat-rating">
                      {freelancer.rating}★
                    </div>
                    <div className="text-sm text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary" data-testid="stat-rate">
                      ${freelancer.hourlyRate}
                    </div>
                    <div className="text-sm text-gray-600">Per Hour</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}