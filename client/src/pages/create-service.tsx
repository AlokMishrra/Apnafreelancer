import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, X, DollarSign, Tag, FileText, Zap } from "lucide-react";
import type { Category } from "@shared/schema";
import { useEffect } from "react";

export default function CreateService() {
  const { isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [requirements, setRequirements] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a service",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const createServiceMutation = useMutation({
    mutationFn: async (serviceData: any) => {
      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(serviceData),
        credentials: "include", // Include session cookies
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create service");
      }

      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Success!",
        description: "Your service has been created successfully",
      });
      // Reset form
      setTitle("");
      setDescription("");
      setPrice("");
      setCategoryId("");
      setTags([]);
      setDeliveryTime("");
      setRequirements("");
      // Redirect to services page
      window.location.href = "/services";
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create service",
        variant: "destructive",
      });
    },
  });

  const handleAddTag = () => {
    if (currentTag.trim() && !tags.includes(currentTag.trim())) {
      setTags([...tags, currentTag.trim()]);
      setCurrentTag("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim() || !description.trim() || !price || !categoryId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const serviceData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      categoryId: parseInt(categoryId),
      tags,
      deliveryTime: parseInt(deliveryTime) || 7,
      requirements: requirements.trim(),
    };

    createServiceMutation.mutate(serviceData);
  };

  if (!isAuthenticated && !isLoading) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <Zap className="w-8 h-8 text-primary mr-3" />
            <h1 className="text-4xl font-poppins font-bold text-charcoal">
              Create a Service
            </h1>
          </div>
          <p className="text-xl text-muted-foreground">
            Offer your skills and expertise to clients around the world
          </p>
        </div>

        {/* Service Creation Form */}
        <Card className="shadow-lg border-border">
          <CardHeader>
            <CardTitle className="flex items-center text-xl">
              <FileText className="w-5 h-5 mr-2 text-primary" />
              Service Details
            </CardTitle>
            <CardDescription>
              Provide detailed information about your service to attract the right clients
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Service Title *
                </Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., I will create a professional website for your business"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="text-base"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Write a clear, descriptive title that explains what you'll deliver
                </p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category *
                </Label>
                <Select value={categoryId} onValueChange={setCategoryId} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category for your service" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id.toString()}>
                        <div className="flex items-center">
                          <Tag className="w-4 h-4 mr-2" />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Service Description *
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your service in detail. What will you deliver? What's your process? What makes you unique?"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-32 text-base"
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Minimum 50 characters. Be specific about what clients will receive.
                </p>
              </div>

              {/* Price and Delivery */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-sm font-medium">
                    Price (USD) *
                  </Label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                    <Input
                      id="price"
                      type="number"
                      placeholder="50"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="pl-10 text-base"
                      min="5"
                      step="5"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliveryTime" className="text-sm font-medium">
                    Delivery Time (Days)
                  </Label>
                  <Select value={deliveryTime} onValueChange={setDeliveryTime}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select delivery time" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 day</SelectItem>
                      <SelectItem value="3">3 days</SelectItem>
                      <SelectItem value="7">1 week</SelectItem>
                      <SelectItem value="14">2 weeks</SelectItem>
                      <SelectItem value="30">1 month</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">
                  Tags
                </Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X
                        className="w-3 h-3 cursor-pointer hover:text-destructive"
                        onClick={() => handleRemoveTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Add a tag (e.g., react, design, writing)"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="text-base"
                  />
                  <Button
                    type="button"
                    onClick={handleAddTag}
                    variant="outline"
                    size="icon"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Add relevant tags to help clients find your service
                </p>
              </div>

              {/* Requirements */}
              <div className="space-y-2">
                <Label htmlFor="requirements" className="text-sm font-medium">
                  Requirements from Buyer
                </Label>
                <Textarea
                  id="requirements"
                  placeholder="What information do you need from the client to get started? (e.g., brand guidelines, content, specific requirements)"
                  value={requirements}
                  onChange={(e) => setRequirements(e.target.value)}
                  className="min-h-24 text-base"
                />
                <p className="text-xs text-muted-foreground">
                  Optional: List what you need from clients to start working
                </p>
              </div>

              {/* Submit Button */}
              <div className="flex justify-end pt-6">
                <Button
                  type="submit"
                  size="lg"
                  className="bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transform hover:scale-105"
                  disabled={createServiceMutation.isPending}
                >
                  {createServiceMutation.isPending ? (
                    <>Creating Service...</>
                  ) : (
                    <>
                      <Plus className="w-5 h-5 mr-2" />
                      Create Service
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Section */}
        <Card className="mt-8 border-border">
          <CardHeader>
            <CardTitle className="text-lg">💡 Tips for Success</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Use a clear, action-oriented title that describes exactly what you'll deliver</li>
              <li>• Include examples of your previous work or results in the description</li>
              <li>• Price competitively based on the value you provide</li>
              <li>• Set realistic delivery times to ensure client satisfaction</li>
              <li>• Use relevant tags to improve your service's discoverability</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}