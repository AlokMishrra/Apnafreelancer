import React, { useState } from "react";
import { Service, Category } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Star, Calendar, Clock, Tag } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { dummyFreelancers } from "@/lib/dummy-data";
import ApplyToServiceDialog from "@/components/apply-to-service-dialog";

interface ServiceCardProps {
  service: Service;
  category?: Category;
  onClick?: () => void;
}

export default function ServiceCard({ service, category, onClick }: ServiceCardProps) {
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  
  return (
    <Card
      className="group hover:shadow-2xl dark:hover:shadow-slate-900/50 transition-all duration-300 transform hover:-translate-y-2 hover:scale-105 cursor-pointer animate-slide-up bg-card/80 dark:bg-slate-800/80 backdrop-blur-sm border border-border dark:border-slate-700 hover:border-primary/50 dark:hover:border-primary/50"
      onClick={onClick}
      data-testid={`card-service-${service.id}`}
    >
      {service.images && service.images.length > 0 ? (
        <img
          src={service.images[0]}
          alt={service.title}
          className="w-full h-48 object-cover rounded-t-2xl"
          data-testid={`img-service-${service.id}`}
        />
      ) : (
        <div className="w-full h-48 bg-gradient-to-br from-primary/10 to-accent/10 rounded-t-2xl flex items-center justify-center">
          <span className="text-4xl">🎨</span>
        </div>
      )}
      <CardContent className="p-6">
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-purple-600 rounded-xl flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-300">
            <span className="text-primary-foreground text-xl animate-bounce">
              {category?.icon || "💼"}
            </span>
          </div>
          <h3 className="text-xl font-poppins font-semibold text-foreground dark:text-white group-hover:text-primary transition-colors duration-300" data-testid={`title-service-${service.id}`}>
            {service.title}
          </h3>
        </div>
        <p className="text-muted-foreground dark:text-slate-300 mb-4 line-clamp-3 group-hover:text-foreground dark:group-hover:text-white transition-colors duration-300" data-testid={`description-service-${service.id}`}>
          {service.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {service.skills?.slice(0, 3).map((skill, index) => (
            <Badge 
              key={index} 
              variant="secondary" 
              className="text-xs bg-muted/50 dark:bg-slate-700 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-300 transform hover:scale-105"
            >
              {skill}
            </Badge>
          ))}
        </div>
        {/* Rating section for popular services */}
        {(service as any).rating && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star 
                  key={i} 
                  className={`w-4 h-4 ${i < Math.floor((service as any).rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} 
                />
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-foreground dark:text-white">
              {(service as any).rating} ({(service as any).reviewCount || 0} reviews)
            </span>
          </div>
        )}
        
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-bold text-primary group-hover:text-purple-600 transition-colors duration-300" data-testid={`price-service-${service.id}`}>
            Starting from ₹{service.price}
          </div>
          <div className="text-sm text-muted-foreground dark:text-slate-400 group-hover:text-foreground dark:group-hover:text-white transition-colors duration-300" data-testid={`delivery-service-${service.id}`}>
            {service.deliveryTime} days delivery
          </div>
        </div>
        
        {/* Action buttons for View Details and Apply */}
        <div className="grid grid-cols-2 gap-2 mt-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="w-full bg-muted/50 dark:bg-slate-700 hover:bg-primary/10 dark:hover:bg-primary/20 transition-colors duration-300"
                onClick={(e: React.MouseEvent) => {
                  e.stopPropagation(); // Prevent card onClick from triggering
                }}
                data-testid={`btn-view-details-${service.id}`}
              >
                View Details
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gray-800/95 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">{service.title}</DialogTitle>
                <DialogDescription className="text-base text-white/80">
                  Service ID: {service.id}
                </DialogDescription>
              </DialogHeader>
              
              {/* Service details */}
              <div className="mt-4 space-y-6">
                {/* Service image */}
                {service.images && service.images.length > 0 && (
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src={service.images[0]}
                      alt={service.title}
                      className="w-full h-64 object-cover"
                    />
                  </div>
                )}
                
                {/* Freelancer info */}
                {(() => {
                  const freelancer = dummyFreelancers.find(f => f.id === service.freelancerId);
                  if (freelancer) {
                    return (
                      <div className="flex items-center space-x-4 p-4 bg-muted/30 rounded-lg">
                        {freelancer.profileImageUrl && (
                          <img 
                            src={freelancer.profileImageUrl} 
                            alt={`${freelancer.firstName} ${freelancer.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        )}
                        <div>
                          <h3 className="font-semibold text-white">{freelancer.firstName} {freelancer.lastName}</h3>
                          <p className="text-sm text-white/80">{freelancer.location}</p>
                        </div>
                      </div>
                    );
                  }
                  return null;
                })()}
                
                {/* Description */}
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-white">Description</h3>
                  <div className="text-white whitespace-pre-line">
                    {service.description}
                  </div>
                </div>
                
                {/* Skills */}
                {service.skills && service.skills.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-white">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {service.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary">{skill}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Meta information */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <Tag className="h-5 w-5 text-primary" />
                    <span className="text-white font-medium">₹{service.price}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-white font-medium">{service.deliveryTime} days delivery</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-white font-medium">Created: {new Date(service.createdAt || Date.now()).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
              
              {/* Footer with Apply button */}
              <div className="mt-6 flex justify-end">
                <Button
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  onClick={() => setApplyDialogOpen(true)}
                >
                  Apply for This Service
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <Dialog open={applyDialogOpen} onOpenChange={setApplyDialogOpen}>
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-300"
              onClick={(e: React.MouseEvent) => {
                e.stopPropagation(); // Prevent card onClick from triggering
                setApplyDialogOpen(true); // Open the dialog manually
              }}
              data-testid={`btn-apply-${service.id}`}
            >
              Apply
            </Button>
            <DialogContent className="bg-gray-800/95 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-white">Apply for "{service.title}"</DialogTitle>
                <DialogDescription className="text-sm text-white/80">
                  Send your application to provide this service
                </DialogDescription>
              </DialogHeader>
              
              <ApplyToServiceDialog
                serviceId={service.id}
                serviceName={service.title}
                servicePrice={typeof service.price === 'string' ? parseFloat(service.price) : Number(service.price)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}