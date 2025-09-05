import { Service, Category } from "@shared/schema";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ServiceCardProps {
  service: Service;
  category?: Category;
  onClick?: () => void;
}

export default function ServiceCard({ service, category, onClick }: ServiceCardProps) {
  return (
    <Card
      className="group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer animate-slide-up"
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
          <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary rounded-xl flex items-center justify-center mr-4">
            <span className="text-primary-foreground text-xl">
              {category?.icon || "💼"}
            </span>
          </div>
          <h3 className="text-xl font-poppins font-semibold text-charcoal" data-testid={`title-service-${service.id}`}>
            {service.title}
          </h3>
        </div>
        <p className="text-muted-foreground mb-4 line-clamp-3" data-testid={`description-service-${service.id}`}>
          {service.description}
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {service.skills?.slice(0, 3).map((skill, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {skill}
            </Badge>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-primary" data-testid={`price-service-${service.id}`}>
            Starting from ${service.price}
          </div>
          <div className="text-sm text-muted-foreground" data-testid={`delivery-service-${service.id}`}>
            {service.deliveryTime} days delivery
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
