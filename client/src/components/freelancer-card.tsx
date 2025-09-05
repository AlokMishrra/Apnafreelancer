import { User } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Star } from "lucide-react";

interface FreelancerCardProps {
  freelancer: User;
  onViewProfile?: () => void;
}

export default function FreelancerCard({ freelancer, onViewProfile }: FreelancerCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-accent text-accent" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-accent/50 text-accent" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-muted-foreground" />);
    }

    return stars;
  };

  return (
    <Card
      className="hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 animate-slide-up"
      data-testid={`card-freelancer-${freelancer.id}`}
    >
      <CardContent className="p-6">
        <div className="text-center mb-4">
          <img
            src={
              freelancer.profileImageUrl ||
              `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150`
            }
            alt={`${freelancer.firstName} ${freelancer.lastName}`}
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-4 border-primary"
            data-testid={`img-freelancer-${freelancer.id}`}
          />
          <h3 className="font-poppins font-semibold text-charcoal" data-testid={`name-freelancer-${freelancer.id}`}>
            {freelancer.firstName} {freelancer.lastName}
          </h3>
          <p className="text-muted-foreground text-sm mb-2">
            {freelancer.skills?.[0] || "Freelancer"}
          </p>
          <div className="flex items-center justify-center">
            <div className="flex">
              {renderStars(Number(freelancer.rating) || 5)}
            </div>
            <span className="ml-2 text-charcoal font-medium text-sm" data-testid={`rating-freelancer-${freelancer.id}`}>
              {freelancer.rating || "5.0"} ({freelancer.totalReviews || 0})
            </span>
          </div>
        </div>

        <div className="space-y-3">
          {freelancer.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-2" />
              <span data-testid={`location-freelancer-${freelancer.id}`}>{freelancer.location}</span>
            </div>
          )}
          <div className="flex items-center text-sm text-muted-foreground">
            <Clock className="w-4 h-4 mr-2" />
            <span data-testid={`availability-freelancer-${freelancer.id}`}>
              {freelancer.availability === "available" ? "Available now" : "Busy"}
            </span>
          </div>
        </div>

        <div className="mt-4">
          <p className="text-sm text-muted-foreground mb-3 line-clamp-3" data-testid={`bio-freelancer-${freelancer.id}`}>
            {freelancer.bio || "Experienced freelancer ready to help with your projects."}
          </p>
          <div className="flex flex-wrap gap-1 mb-3">
            {freelancer.skills?.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
          </div>
          <div className="flex justify-between items-center">
            <div className="text-lg font-bold text-primary" data-testid={`rate-freelancer-${freelancer.id}`}>
              ${freelancer.hourlyRate || "50"}/hr
            </div>
            <Button
              onClick={onViewProfile}
              size="sm"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              data-testid={`button-view-profile-${freelancer.id}`}
            >
              View Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
