import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { insertJobSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import type { z } from "zod";

const jobFormSchema = insertJobSchema.extend({
  skills: insertJobSchema.shape.skills.optional(),
});

type JobFormData = z.infer<typeof jobFormSchema>;

export default function JobPostForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      budget: "0",
      duration: "",
      experienceLevel: "",
      skills: [],
      categoryId: 0,
    },
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      const payload = {
        ...data,
        skills: data.skills || [],
      };
      return await apiRequest("POST", "/api/jobs", payload);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Job posted successfully! You'll start receiving proposals soon.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to post job. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JobFormData) => {
    createJobMutation.mutate(data);
  };

  return (
    <Card className="w-full max-w-4xl mx-auto animate-scale-in" data-testid="card-job-post-form">
      <CardContent className="p-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Project Title */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">Project Title *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="I need a professional website for my business"
                      className="w-full px-4 py-3 rounded-xl"
                      data-testid="input-job-title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Project Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal">Project Description *</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe your project in detail, including requirements, goals, and expectations..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl resize-none"
                      data-testid="textarea-job-description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category and Skills */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-charcoal">Category *</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value.toString()}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-3 rounded-xl" data-testid="select-job-category">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {(categories as any[]).map((category: any) => (
                          <SelectItem key={category.id} value={category.id.toString()}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="skills"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-charcoal">Required Skills</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., React, Node.js, MongoDB (comma separated)"
                        className="w-full px-4 py-3 rounded-xl"
                        value={field.value?.join(", ") || ""}
                        onChange={(e) => {
                          const skills = e.target.value.split(",").map((s) => s.trim()).filter(Boolean);
                          field.onChange(skills);
                        }}
                        data-testid="input-job-skills"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Budget and Timeline */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-charcoal">Budget *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="1000"
                        className="w-full px-4 py-3 rounded-xl"
                        data-testid="input-job-budget"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-charcoal">Project Duration *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="w-full px-4 py-3 rounded-xl" data-testid="select-job-duration">
                          <SelectValue placeholder="Select duration" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="less-than-1-week">Less than 1 week</SelectItem>
                        <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
                        <SelectItem value="2-4-weeks">2-4 weeks</SelectItem>
                        <SelectItem value="1-3-months">1-3 months</SelectItem>
                        <SelectItem value="3-plus-months">3+ months</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Experience Level */}
            <FormField
              control={form.control}
              name="experienceLevel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-charcoal mb-4">Preferred Experience Level</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={field.value}
                      className="grid md:grid-cols-3 gap-4"
                      data-testid="radio-group-experience"
                    >
                      <div className="flex items-center p-4 border border-border rounded-xl hover:bg-secondary transition-colors duration-200">
                        <RadioGroupItem value="entry" id="entry" className="mr-3" />
                        <Label htmlFor="entry" className="cursor-pointer">
                          <div className="font-medium text-charcoal">Entry Level</div>
                          <div className="text-sm text-muted-foreground">New freelancers</div>
                        </Label>
                      </div>
                      <div className="flex items-center p-4 border border-border rounded-xl hover:bg-secondary transition-colors duration-200">
                        <RadioGroupItem value="intermediate" id="intermediate" className="mr-3" />
                        <Label htmlFor="intermediate" className="cursor-pointer">
                          <div className="font-medium text-charcoal">Intermediate</div>
                          <div className="text-sm text-muted-foreground">Some experience</div>
                        </Label>
                      </div>
                      <div className="flex items-center p-4 border border-border rounded-xl hover:bg-secondary transition-colors duration-200">
                        <RadioGroupItem value="expert" id="expert" className="mr-3" />
                        <Label htmlFor="expert" className="cursor-pointer">
                          <div className="font-medium text-charcoal">Expert</div>
                          <div className="text-sm text-muted-foreground">Highly experienced</div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Submit Button */}
            <div className="pt-4">
              <Button
                type="submit"
                disabled={createJobMutation.isPending}
                className="w-full bg-gradient-to-r from-primary to-primary hover:from-primary hover:to-primary text-primary-foreground py-4 rounded-xl font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                data-testid="button-submit-job"
              >
                {createJobMutation.isPending ? "Posting..." : "Post Job - Find Freelancers"}
              </Button>
              <p className="text-center text-sm text-muted-foreground mt-3">
                You'll start receiving proposals within minutes
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
