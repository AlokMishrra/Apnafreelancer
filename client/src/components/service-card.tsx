import { Service, Category } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star } from "lucide-react";

interface ServiceCardProps {
  service: Service;
  category?: Category;
  onClick?: () => void;
}

export default function ServiceCard({ service, category, onClick }: ServiceCardProps) {
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
        
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-primary group-hover:text-purple-600 transition-colors duration-300" data-testid={`price-service-${service.id}`}>
            Starting from ₹{service.price}
          </div>
          <div className="text-sm text-muted-foreground dark:text-slate-400 group-hover:text-foreground dark:group-hover:text-white transition-colors duration-300" data-testid={`delivery-service-${service.id}`}>
            {service.deliveryTime} days delivery
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
