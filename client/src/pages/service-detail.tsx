import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/navigation";
import ApplyToServiceDialog from "@/components/apply-to-service-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star, Clock, User, ArrowLeft, MessageCircle, CheckCircle } from "lucide-react";
import type { Service, User as UserType } from "@shared/schema";

export default function ServiceDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

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
        
        {/* Service status banner */}
        {!service.isActive && (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-md p-4 mb-6">
            <p className="flex items-center text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              This service is currently pending approval and not visible to clients
            </p>
          </div>
        )}

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

              {/* Features & Benefits */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-3">Features & Benefits</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">Professional Service</p>
                      <p className="text-sm text-gray-600">Delivered by an experienced professional</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">Customized Solutions</p>
                      <p className="text-sm text-gray-600">Tailored to your specific requirements</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">Fast Delivery</p>
                      <p className="text-sm text-gray-600">Receive your work in {service.deliveryTime} days</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-primary mt-0.5 mr-2" />
                    <div>
                      <p className="font-medium">Revisions Included</p>
                      <p className="text-sm text-gray-600">Get adjustments until you're satisfied</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* What you'll get */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h3 className="text-lg font-semibold mb-3 text-blue-800">What You'll Get</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                    <p className="text-blue-800">Complete service as described above</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                    <p className="text-blue-800">Delivery in {service.deliveryTime} days</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                    <p className="text-blue-800">Professional communication throughout the process</p>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-blue-600 mt-0.5 mr-2" />
                    <p className="text-blue-800">100% satisfaction guarantee</p>
                  </li>
                </ul>
              </div>

              {/* Skills */}
              {service.skills && service.skills.length > 0 && (
                <div className="mt-8">
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
                {/* Show different buttons based on user type */}
                {isAuthenticated ? (
                  user?.isFreelancer ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium text-green-600">You are a freelancer - you can apply for this service!</p>
                      <ApplyToServiceDialog 
                        serviceId={service.id}
                        serviceName={service.title}
                        servicePrice={parseFloat(service.price.toString())}
                      />
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Button 
                        className="w-full bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary"
                        data-testid="button-contact-freelancer"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Contact Freelancer
                      </Button>
                      <p className="text-xs text-center text-muted-foreground">
                        Connect directly with this service provider
                      </p>
                    </div>
                  )
                ) : (
                  <div className="space-y-3">
                    <Link href="/sign-in">
                      <Button className="w-full">
                        Sign In to Contact Freelancer
                      </Button>
                    </Link>
                    <p className="text-xs text-center text-muted-foreground">
                      You need to be signed in to interact with freelancers
                    </p>
                  </div>
                )}
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
                      {freelancer.profileImageUrl ? (
                        <img src={freelancer.profileImageUrl} alt={`${freelancer.firstName} ${freelancer.lastName}`} />
                      ) : (
                        <AvatarFallback className="bg-gradient-to-br from-primary to-primary text-white">
                          {freelancer.firstName?.[0]}{freelancer.lastName?.[0]}
                        </AvatarFallback>
                      )}
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="font-semibold" data-testid="freelancer-name">
                        {freelancer.firstName} {freelancer.lastName}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2" data-testid="freelancer-location">
                        {freelancer.location || 'Location not specified'}
                      </p>
                      
                      {/* Rating */}
                      <div className="flex items-center mb-2">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium ml-1" data-testid="freelancer-rating">
                            {freelancer.rating || '0.0'}
                          </span>
                        </div>
                        <span className="text-sm text-gray-500 ml-2" data-testid="freelancer-reviews">
                          ({freelancer.totalReviews || 0} reviews)
                        </span>
                      </div>

                      <p className="text-sm text-gray-700 mb-3" data-testid="freelancer-bio">
                        {freelancer.bio ? (freelancer.bio.length > 100 ? `${freelancer.bio.slice(0, 100)}...` : freelancer.bio) : 'No bio available'}
                      </p>

                      {/* Skills */}
                      {freelancer.skills && freelancer.skills.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1 mb-2">
                            {freelancer.skills.slice(0, 3).map((skill, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {skill}
                              </Badge>
                            ))}
                            {freelancer.skills.length > 3 && (
                              <Badge variant="outline" className="text-xs">+{freelancer.skills.length - 3} more</Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <Link href={`/freelancers/${freelancer.id}`}>
                        <Button variant="outline" size="sm" data-testid="button-view-profile">
                          <User className="w-4 h-4 mr-2" />
                          View Full Profile
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