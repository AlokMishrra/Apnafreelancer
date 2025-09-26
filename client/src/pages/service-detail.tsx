import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, User, ArrowLeft, MessageCircle } from "lucide-react";
import type { Service, User as UserType } from "@shared/schema";

export default function ServiceDetail() {
  const { id } = useParams();

  const { data: service, isLoading: serviceLoading } = useQuery<Service>({
    queryKey: [`/api/services/${id}`],
    enabled: !!id,
  });

  const { data: freelancer, isLoading: freelancerLoading } = useQuery<UserType>({
    queryKey: [`/api/users/${service?.freelancerId}`],
    enabled: !!service?.freelancerId,
  });

  if (serviceLoading || freelancerLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Service Not Found</h1>
            <p className="text-gray-600 mb-8">The service you're looking for doesn't exist.</p>
            <Link href="/services">
              <Button>Browse Services</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <Link href="/services">
          <Button variant="ghost" className="mb-6" data-testid="button-back-to-services">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Services
          </Button>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-4" data-testid="service-title">
                {service.title}
              </h1>
              
              {/* Service images */}
              {service.images && service.images.length > 0 && (
                <div className="mb-6">
                  <img
                    src={service.images[0]}
                    alt={service.title}
                    className="w-full h-64 object-cover rounded-lg"
                    data-testid="service-image"
                  />
                </div>
              )}

              {/* Description */}
              <div className="prose max-w-none">
                <h2 className="text-xl font-semibold mb-4">About This Service</h2>
                <p className="text-gray-700 leading-relaxed" data-testid="service-description">
                  {service.description}
                </p>
              </div>

              {/* Skills */}
              {service.skills && service.skills.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-3">Skills & Technologies</h3>
                  <div className="flex flex-wrap gap-2">
                    {service.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" data-testid={`skill-${index}`}>
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary" data-testid="service-price">
                  ₹{service.price}
                </CardTitle>
                <CardDescription>
                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {service.deliveryTime} days delivery
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            {/* Freelancer Card */}
            {freelancer && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">About the Freelancer</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start space-x-4">
                    <Avatar className="w-16 h-16">
                      <AvatarFallback className="bg-gradient-to-br from-primary to-primary text-white">
                        {freelancer.firstName?.[0]}{freelancer.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold" data-testid="freelancer-name">
                        {freelancer.firstName} {freelancer.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2" data-testid="freelancer-location">
                        {freelancer.location}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1" data-testid="freelancer-rating">
                            {freelancer.rating}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 ml-2" data-testid="freelancer-reviews">
                          ({freelancer.totalReviews} reviews)
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3" data-testid="freelancer-bio">
                        {freelancer.bio?.slice(0, 100)}...
                      </p>

                      <Link href={`/freelancers/${freelancer.id}`}>
                        <Button variant="outline" size="sm" data-testid="button-view-profile">
                          <User className="w-4 h-4 mr-2" />
                          View Profile
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Service Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Service ID</span>
                  <span className="font-medium" data-testid="service-id">#{service.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Time</span>
                  <span className="font-medium" data-testid="service-delivery-time">
                    {service.deliveryTime} days
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Status</span>
                  <Badge 
                    variant={service.isActive ? "default" : "secondary"} 
                    data-testid="service-status"
                  >
                    {service.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}