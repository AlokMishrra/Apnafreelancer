import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import Landing from "@/pages/landing";
import SignIn from "@/pages/sign-in";
import Home from "@/pages/home";
import Services from "@/pages/services";
import ServiceDetail from "@/pages/service-detail";
import CreateService from "@/pages/create-service";
import Freelancers from "@/pages/freelancers";
import FreelancerProfile from "@/pages/freelancer-profile";
import TopFreelancers from "@/pages/top-freelancers";
import HireTalent from "@/pages/hire-talent";
import PostJob from "@/pages/post-job";
import FindWork from "@/pages/find-work";
import Messages from "@/pages/messages";
import NotFound from "@/pages/not-found";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/sign-in" component={SignIn} />
          <Route path="/services" component={Services} />
          <Route path="/services/:id" component={ServiceDetail} />
          <Route path="/freelancers" component={Freelancers} />
          <Route path="/freelancers/:id" component={FreelancerProfile} />
          <Route path="/top-freelancers" component={TopFreelancers} />
          <Route path="/hire-talent" component={HireTalent} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/services" component={Services} />
          <Route path="/services/:id" component={ServiceDetail} />
          <Route path="/create-service" component={CreateService} />
          <Route path="/freelancers" component={Freelancers} />
          <Route path="/freelancers/:id" component={FreelancerProfile} />
          <Route path="/top-freelancers" component={TopFreelancers} />
          <Route path="/hire-talent" component={HireTalent} />
          <Route path="/post-job" component={PostJob} />
          <Route path="/find-work" component={FindWork} />
          <Route path="/messages" component={Messages} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
