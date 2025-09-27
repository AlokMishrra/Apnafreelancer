import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MessageCircle } from "lucide-react";

interface ApplyToServiceProps {
  serviceId: number;
  freelancerId?: string;
  serviceName: string;
  servicePrice: number; // Original service price
  freelancerName?: string;
}

export default function ApplyToServiceDialog({
  serviceId,
  serviceName,
  servicePrice,
}: ApplyToServiceProps) {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [price, setPrice] = useState(servicePrice.toString());
  const [deliveryDays, setDeliveryDays] = useState("7");

  const applyMutation = useMutation({
    mutationFn: async (data: any) => {
      // Import the apiRequest function
      const { apiRequest } = await import('@/lib/queryClient');
      
      try {
        const response = await apiRequest("POST", `/api/services/${serviceId}/apply`, data);
        return await response.json();
      } catch (error: any) {
        console.error("Error applying to service:", error);
        throw new Error(error.message || "Failed to apply to service");
      }
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your application has been submitted successfully.",
      });
      // Reset form
      setMessage("");
      setPrice(servicePrice.toString());
      setDeliveryDays("7");
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to submit application",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to apply for this service",
        variant: "destructive",
      });
      return;
    }

    if (!message.trim()) {
      toast({
        title: "Message Required",
        description: "Please provide a message to the client",
        variant: "destructive",
      });
      return;
    }

    const priceValue = parseFloat(price);
    const daysValue = parseInt(deliveryDays);

    if (isNaN(priceValue) || priceValue <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }

    if (isNaN(daysValue) || daysValue <= 0) {
      toast({
        title: "Invalid Delivery Time",
        description: "Please enter a valid number of days",
        variant: "destructive",
      });
      return;
    }

    const applicationData = {
      serviceId,
      freelancerId: user.id,
      message: message.trim(),
      proposedPrice: priceValue,
      deliveryTime: daysValue,
    };

    applyMutation.mutate(applicationData);
  };

  // Check authentication immediately
  if (!isAuthenticated) {
    return (
      <>
        <div className="p-4 text-center">
          <p className="text-lg font-semibold mb-3">Authentication Required</p>
          <p className="text-muted-foreground mb-4">
            Please sign in to apply for this service
          </p>
          <Button 
            variant="outline"
            onClick={() => {
              // Close any open dialogs first
              document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true
              }));
              
              // Redirect to the home page with auth modal open
              window.location.href = '/?auth=login';
            }}
            data-testid="btn-auth-sign-in"
          >
            Sign In
          </Button>
        </div>
      </>
    );
  }

  // Check if user is a freelancer
  if (user && !user.isFreelancer) {
    return (
      <div className="p-4 text-center">
        <p className="text-lg font-semibold mb-3">Freelancer Profile Required</p>
        <p className="text-muted-foreground mb-4">
          You need a freelancer profile to apply for services
        </p>
        <Button 
          variant="outline"
          onClick={() => window.location.href = "/create-profile"}
        >
          Create Freelancer Profile
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid gap-2">
          <Label htmlFor="message">Message to Client</Label>
          <Textarea
            id="message"
            placeholder="Introduce yourself and explain why you're interested in this service"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="h-32"
            required
          />
          <p className="text-xs text-muted-foreground">
            Provide relevant details about your experience and skills
          </p>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="price">Proposed Price (₹)</Label>
            <Input
              id="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="Enter your price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="days">Delivery Time (days)</Label>
            <Input
              id="days"
              type="number"
              min="1"
              placeholder="Number of days"
              value={deliveryDays}
              onChange={(e) => setDeliveryDays(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            // Find the closest dialog and use standard DialogClose behavior
            const dialog = document.querySelector('[data-state="open"]');
            if (dialog) {
              // Close the dialog by calling onOpenChange
              document.dispatchEvent(new KeyboardEvent('keydown', {
                key: 'Escape',
                bubbles: true
              }));
            }
          }}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={applyMutation.isPending}
        >
          {applyMutation.isPending ? "Sending..." : "Send Application"}
        </Button>
      </div>
    </form>
  );
}