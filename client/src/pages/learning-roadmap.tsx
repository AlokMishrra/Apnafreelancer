import { useState } from "react";
import RoadmapForm from "@/components/roadmap-form";
import { Button } from "@/components/ui/button";
import { Sparkles, BookOpen, ChevronRight } from "lucide-react";

export default function LearningRoadmap() {
  const [roadmapModalOpen, setRoadmapModalOpen] = useState(false);
  
  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
            Roadmaps
          </span>
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get personalized learning paths tailored to your skills, goals, and timeframe. Our AI-generated roadmaps help you navigate your educational journey.
        </p>
        <Button 
          onClick={() => setRoadmapModalOpen(true)}
          className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-6 h-auto text-lg"
        >
          <Sparkles className="mr-2 h-5 w-5" />
          Generate Your Roadmap
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="mb-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-4">
              <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold">How It Works</h2>
          </div>
          <ul className="space-y-4 mt-6">
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 font-medium">1</span>
              </div>
              <div>
                <h3 className="font-medium">Share Your Background</h3>
                <p className="text-muted-foreground mt-1">Tell us about your current education level and existing skills</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 font-medium">2</span>
              </div>
              <div>
                <h3 className="font-medium">Define Your Goals</h3>
                <p className="text-muted-foreground mt-1">Select what you want to learn and your target timeframe</p>
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-blue-100 dark:bg-blue-900/30 w-6 h-6 rounded-full flex items-center justify-center mr-3 mt-0.5">
                <span className="text-blue-600 dark:text-blue-400 font-medium">3</span>
              </div>
              <div>
                <h3 className="font-medium">Get Your Roadmap</h3>
                <p className="text-muted-foreground mt-1">Receive a structured learning path with resources and milestones</p>
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
          <div className="mb-4 flex items-center">
            <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-4">
              <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <h2 className="text-2xl font-bold">Features</h2>
          </div>
          <ul className="space-y-3 mt-6">
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
              <span>Personalized skill development paths</span>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
              <span>Course recommendations based on your goals</span>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
              <span>Industry-aligned learning resources</span>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
              <span>Structured timeline with milestones</span>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
              <span>Certification recommendations</span>
            </li>
            <li className="flex items-center">
              <ChevronRight className="h-5 w-5 text-purple-500 mr-2 flex-shrink-0" />
              <span>Regularly updated with industry trends</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-muted/50 rounded-xl p-8 border border-border">
        <h2 className="text-2xl font-bold mb-6 text-center">Available Roadmap Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {[
            { name: "Web Development", icon: "🌐" },
            { name: "Mobile Apps", icon: "📱" },
            { name: "Data Science", icon: "📊" },
            { name: "UI/UX Design", icon: "🎨" },
            { name: "Digital Marketing", icon: "📈" },
            { name: "AI & ML", icon: "🤖" },
            { name: "Blockchain", icon: "⛓️" },
            { name: "Cyber Security", icon: "🔒" },
          ].map((category) => (
            <button
              key={category.name}
              onClick={() => setRoadmapModalOpen(true)}
              className="bg-background hover:bg-accent/50 transition-colors rounded-lg p-4 text-center border border-border flex flex-col items-center"
            >
              <span className="text-3xl mb-2">{category.icon}</span>
              <span className="font-medium">{category.name}</span>
            </button>
          ))}
        </div>
      </div>

      <RoadmapForm
        isOpen={roadmapModalOpen}
        onClose={() => setRoadmapModalOpen(false)}
      />
    </div>
  );
}