import { useLocation } from 'wouter';

// Helper hook to get current page context for the chatbot
export function useChatbotContext() {
  const [location] = useLocation();
  
  // Get the current page path without leading slash
  const currentPath = location.substring(1) || 'home';
  
  // Map paths to context-aware messages
  const getContextMessage = (): string => {
    switch (currentPath) {
      case 'home':
        return "I see you're on the homepage. Would you like to learn more about ApnaFreelancer's services or how to get started?";
      
      case 'services':
        return "You're browsing services. Looking for something specific? I can help filter services based on categories or price ranges.";
      
      case 'create-service':
        return "Creating a service? Make sure to include detailed descriptions, clear deliverables, and high-quality images to attract more clients.";
      
      case 'freelancers':
        return "Browsing freelancers? I can help you find the right talent for your project based on skills, reviews, or experience level.";
      
      case 'hire-talent':
        return "Looking to hire talent? I can help you understand the best ways to write job descriptions that attract qualified freelancers.";
      
      case 'post-job':
        return "Posting a job? Be specific about requirements, timeline, and budget to attract the right freelancers for your project.";
      
      case 'find-work':
        return "Looking for work? I can help you with tips on creating winning proposals and standing out among other freelancers.";
      
      case 'messages':
        return "Need help with your conversations? Professional communication is key to successful freelancing relationships.";
      
      case 'learning-roadmap':
        return "Exploring learning roadmaps? These personalized paths can help you acquire the skills most in-demand in today's freelancing market.";
      
      default:
        return "How can I help you with ApnaFreelancer today?";
    }
  };
  
  return {
    currentPath,
    contextMessage: getContextMessage()
  };
}

export default useChatbotContext;