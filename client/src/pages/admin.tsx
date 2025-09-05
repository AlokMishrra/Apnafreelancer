import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Clock, Users, Briefcase, FileText, DollarSign, Calendar, ShieldAlert } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

interface PendingUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isFreelancer: boolean;
  isClient: boolean;
  bio?: string;
  skills?: string[];
  location?: string;
  createdAt: string;
}

interface PendingService {
  id: number;
  title: string;
  description: string;
  price: string;
  deliveryTime: number;
  skills?: string[];
  freelancerId: string;
  createdAt: string;
}

interface PendingHireRequest {
  id: number;
  projectTitle: string;
  projectDescription: string;
  budget?: string;
  deadline?: string;
  clientMessage?: string;
  clientId: string;
  freelancerId: string;
  createdAt: string;
}

interface PendingJob {
  id: number;
  title: string;
  description: string;
  budget: string;
  duration: string;
  experienceLevel: string;
  skills?: string[];
  clientId: string;
  categoryId: number;
  createdAt: string;
}

export default function AdminPage() {
  const [rejectReason, setRejectReason] = useState("");
  const [adminResponse, setAdminResponse] = useState("");
  const queryClient = useQueryClient();
  const { user, isLoading } = useAuth();

  // Check if user is admin
  useEffect(() => {
    if (!isLoading && (!user || !user.isAdmin)) {
      toast({
        title: "Access Denied",
        description: "Admin access required to view this page.",
        variant: "destructive",
      });
      // Redirect to home page after a brief delay
      setTimeout(() => {
        window.location.href = "/";
      }, 2000);
    }
  }, [user, isLoading]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
            <h2 className="text-lg font-semibold mb-2">Checking Access...</h2>
            <p className="text-muted-foreground">Verifying admin permissions</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show access denied if not admin
  if (!user || !user.isAdmin) {
    return (
      <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <ShieldAlert className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-xl font-semibold mb-2 text-red-600">Access Denied</h2>
            <p className="text-muted-foreground mb-4">
              You don't have admin permissions to access this page.
            </p>
            <p className="text-sm text-muted-foreground">
              Redirecting to home page...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const { data: pendingUsers = [], isLoading: usersLoading } = useQuery<PendingUser[]>({
    queryKey: ['/api/admin/pending-users'],
  });

  const { data: pendingServices = [], isLoading: servicesLoading } = useQuery<PendingService[]>({
    queryKey: ['/api/admin/pending-services'],
  });

  const { data: pendingHireRequests = [], isLoading: hireRequestsLoading } = useQuery<PendingHireRequest[]>({
    queryKey: ['/api/admin/pending-hire-requests'],
  });

  const { data: pendingJobs = [], isLoading: jobsLoading } = useQuery<PendingJob[]>({
    queryKey: ['/api/admin/pending-jobs'],
  });

  const approveUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}/approve`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to approve user');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "User approved successfully" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-users'] });
    },
    onError: () => {
      toast({ title: "Failed to approve user", variant: "destructive" });
    }
  });

  const rejectUserMutation = useMutation({
    mutationFn: async (userId: string) => {
      const response = await fetch(`/api/admin/users/${userId}/reject`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to reject user');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "User rejected" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-users'] });
    },
    onError: () => {
      toast({ title: "Failed to reject user", variant: "destructive" });
    }
  });

  const approveServiceMutation = useMutation({
    mutationFn: async (serviceId: number) => {
      const response = await fetch(`/api/admin/services/${serviceId}/approve`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to approve service');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Service approved and published" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-services'] });
    },
    onError: () => {
      toast({ title: "Failed to approve service", variant: "destructive" });
    }
  });

  const rejectServiceMutation = useMutation({
    mutationFn: async ({ serviceId, reason }: { serviceId: number; reason?: string }) => {
      const response = await fetch(`/api/admin/services/${serviceId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      if (!response.ok) throw new Error('Failed to reject service');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Service rejected" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-services'] });
      setRejectReason("");
    },
    onError: () => {
      toast({ title: "Failed to reject service", variant: "destructive" });
    }
  });

  const approveHireRequestMutation = useMutation({
    mutationFn: async (hireRequestId: number) => {
      const response = await fetch(`/api/admin/hire-requests/${hireRequestId}/approve`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to approve hire request');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Hire request approved" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-hire-requests'] });
    },
    onError: () => {
      toast({ title: "Failed to approve hire request", variant: "destructive" });
    }
  });

  const rejectHireRequestMutation = useMutation({
    mutationFn: async ({ hireRequestId, response }: { hireRequestId: number; response?: string }) => {
      const res = await fetch(`/api/admin/hire-requests/${hireRequestId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ response })
      });
      if (!res.ok) throw new Error('Failed to reject hire request');
      return res.json();
    },
    onSuccess: () => {
      toast({ title: "Hire request rejected" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-hire-requests'] });
      setAdminResponse("");
    },
    onError: () => {
      toast({ title: "Failed to reject hire request", variant: "destructive" });
    }
  });

  const handleApproveUser = (userId: string) => {
    approveUserMutation.mutate(userId);
  };

  const handleRejectUser = (userId: string) => {
    rejectUserMutation.mutate(userId);
  };

  const handleApproveService = (serviceId: number) => {
    approveServiceMutation.mutate(serviceId);
  };

  const handleRejectService = (serviceId: number) => {
    rejectServiceMutation.mutate({ serviceId, reason: rejectReason });
  };

  const handleApproveHireRequest = (hireRequestId: number) => {
    approveHireRequestMutation.mutate(hireRequestId);
  };

  const handleRejectHireRequest = (hireRequestId: number) => {
    rejectHireRequestMutation.mutate({ hireRequestId, response: adminResponse });
  };

  const approveJobMutation = useMutation({
    mutationFn: async (jobId: number) => {
      const response = await fetch(`/api/admin/jobs/${jobId}/approve`, { method: 'POST' });
      if (!response.ok) throw new Error('Failed to approve job');
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "Job approved and published" });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/pending-jobs'] });
    },
    onError: () => {
      toast({ title: "Failed to approve job", variant: "destructive" });
    }
  });

  const handleApproveJob = (jobId: number) => {
    approveJobMutation.mutate(jobId);
  };

  return (
    <div className="container mx-auto px-4 py-8" data-testid="admin-dashboard">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" data-testid="page-title">Admin Dashboard</h1>
        <p className="text-muted-foreground" data-testid="page-description">
          Manage user approvals, service reviews, and hire talent requests
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card data-testid="stat-pending-users">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Users</p>
                <p className="text-2xl font-bold">{pendingUsers.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-pending-services">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Services</p>
                <p className="text-2xl font-bold">{pendingServices.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-pending-jobs">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Briefcase className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Jobs</p>
                <p className="text-2xl font-bold">{pendingJobs.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-pending-hire-requests">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Hire Requests</p>
                <p className="text-2xl font-bold">{pendingHireRequests.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card data-testid="stat-total-pending">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Pending</p>
                <p className="text-2xl font-bold">
                  {pendingUsers.length + pendingServices.length + pendingJobs.length + pendingHireRequests.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6" data-testid="admin-tabs">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="users" data-testid="tab-users">Pending Users</TabsTrigger>
          <TabsTrigger value="services" data-testid="tab-services">Pending Services</TabsTrigger>
          <TabsTrigger value="jobs" data-testid="tab-jobs">Pending Jobs</TabsTrigger>
          <TabsTrigger value="hire-requests" data-testid="tab-hire-requests">Hire Requests</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-4" data-testid="users-tab-content">
          <Card>
            <CardHeader>
              <CardTitle>Pending User Registrations</CardTitle>
              <CardDescription>
                Review and approve new freelancer and client registrations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {usersLoading ? (
                <div data-testid="users-loading">Loading users...</div>
              ) : pendingUsers.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="no-pending-users">
                  No pending user registrations
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map((user: PendingUser) => (
                    <Card key={user.id} className="border" data-testid={`user-card-${user.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <h3 className="font-semibold" data-testid={`user-name-${user.id}`}>
                                {user.firstName} {user.lastName}
                              </h3>
                              <div className="flex space-x-2">
                                {user.isFreelancer && (
                                  <Badge variant="secondary" data-testid={`user-freelancer-badge-${user.id}`}>
                                    Freelancer
                                  </Badge>
                                )}
                                {user.isClient && (
                                  <Badge variant="outline" data-testid={`user-client-badge-${user.id}`}>
                                    Client
                                  </Badge>
                                )}
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2" data-testid={`user-email-${user.id}`}>
                              {user.email}
                            </p>
                            {user.bio && (
                              <p className="text-sm mb-2" data-testid={`user-bio-${user.id}`}>
                                {user.bio}
                              </p>
                            )}
                            {user.skills && user.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2" data-testid={`user-skills-${user.id}`}>
                                {user.skills.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            {user.location && (
                              <p className="text-sm text-muted-foreground" data-testid={`user-location-${user.id}`}>
                                📍 {user.location}
                              </p>
                            )}
                            <p className="text-xs text-muted-foreground mt-2" data-testid={`user-date-${user.id}`}>
                              Registered: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleApproveUser(user.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              disabled={approveUserMutation.isPending}
                              data-testid={`approve-user-${user.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => handleRejectUser(user.id)}
                              size="sm"
                              variant="destructive"
                              disabled={rejectUserMutation.isPending}
                              data-testid={`reject-user-${user.id}`}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="space-y-4" data-testid="services-tab-content">
          <Card>
            <CardHeader>
              <CardTitle>Pending Service Listings</CardTitle>
              <CardDescription>
                Review and approve new freelancer service offerings
              </CardDescription>
            </CardHeader>
            <CardContent>
              {servicesLoading ? (
                <div data-testid="services-loading">Loading services...</div>
              ) : pendingServices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="no-pending-services">
                  No pending service listings
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingServices.map((service: PendingService) => (
                    <Card key={service.id} className="border" data-testid={`service-card-${service.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2" data-testid={`service-title-${service.id}`}>
                              {service.title}
                            </h3>
                            <p className="text-sm mb-3" data-testid={`service-description-${service.id}`}>
                              {service.description}
                            </p>
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                                <span className="font-medium" data-testid={`service-price-${service.id}`}>
                                  ${service.price}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                                <span className="text-sm" data-testid={`service-delivery-${service.id}`}>
                                  {service.deliveryTime} days delivery
                                </span>
                              </div>
                            </div>
                            {service.skills && service.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2" data-testid={`service-skills-${service.id}`}>
                                {service.skills.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground" data-testid={`service-date-${service.id}`}>
                              Submitted: {new Date(service.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleApproveService(service.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              disabled={approveServiceMutation.isPending}
                              data-testid={`approve-service-${service.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={rejectServiceMutation.isPending}
                                  data-testid={`reject-service-${service.id}`}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent data-testid={`reject-service-dialog-${service.id}`}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Service</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Please provide a reason for rejecting this service (optional).
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Textarea
                                  placeholder="Reason for rejection..."
                                  value={rejectReason}
                                  onChange={(e) => setRejectReason(e.target.value)}
                                  data-testid={`reject-reason-${service.id}`}
                                />
                                <AlertDialogFooter>
                                  <AlertDialogCancel data-testid={`cancel-reject-${service.id}`}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRejectService(service.id)}
                                    data-testid={`confirm-reject-${service.id}`}
                                  >
                                    Reject Service
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="jobs" className="space-y-4" data-testid="jobs-tab-content">
          <Card>
            <CardHeader>
              <CardTitle>Pending Job Postings</CardTitle>
              <CardDescription>
                Review and approve new job postings from clients
              </CardDescription>
            </CardHeader>
            <CardContent>
              {jobsLoading ? (
                <div data-testid="jobs-loading">Loading jobs...</div>
              ) : pendingJobs.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="no-pending-jobs">
                  No pending job postings
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingJobs.map((job: PendingJob) => (
                    <Card key={job.id} className="border" data-testid={`job-card-${job.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2" data-testid={`job-title-${job.id}`}>
                              {job.title}
                            </h3>
                            <p className="text-sm mb-3" data-testid={`job-description-${job.id}`}>
                              {job.description}
                            </p>
                            <div className="flex items-center space-x-4 mb-2">
                              <div className="flex items-center">
                                <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                                <span className="font-medium" data-testid={`job-budget-${job.id}`}>
                                  ${job.budget}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                                <span className="text-sm" data-testid={`job-duration-${job.id}`}>
                                  {job.duration}
                                </span>
                              </div>
                              <div className="flex items-center">
                                <Badge variant="outline" className="text-xs">
                                  {job.experienceLevel}
                                </Badge>
                              </div>
                            </div>
                            {job.skills && job.skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2" data-testid={`job-skills-${job.id}`}>
                                {job.skills.map((skill, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground" data-testid={`job-date-${job.id}`}>
                              Submitted: {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleApproveJob(job.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              disabled={approveJobMutation.isPending}
                              data-testid={`approve-job-${job.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hire-requests" className="space-y-4" data-testid="hire-requests-tab-content">
          <Card>
            <CardHeader>
              <CardTitle>Pending Hire Talent Requests</CardTitle>
              <CardDescription>
                Review and approve direct hire requests between clients and freelancers
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hireRequestsLoading ? (
                <div data-testid="hire-requests-loading">Loading hire requests...</div>
              ) : pendingHireRequests.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground" data-testid="no-pending-hire-requests">
                  No pending hire requests
                </div>
              ) : (
                <div className="space-y-4">
                  {pendingHireRequests.map((request: PendingHireRequest) => (
                    <Card key={request.id} className="border" data-testid={`hire-request-card-${request.id}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="font-semibold mb-2" data-testid={`hire-request-title-${request.id}`}>
                              {request.projectTitle}
                            </h3>
                            <p className="text-sm mb-3" data-testid={`hire-request-description-${request.id}`}>
                              {request.projectDescription}
                            </p>
                            <div className="flex items-center space-x-4 mb-2">
                              {request.budget && (
                                <div className="flex items-center">
                                  <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                                  <span className="font-medium" data-testid={`hire-request-budget-${request.id}`}>
                                    ${request.budget}
                                  </span>
                                </div>
                              )}
                              {request.deadline && (
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 text-blue-600 mr-1" />
                                  <span className="text-sm" data-testid={`hire-request-deadline-${request.id}`}>
                                    Due: {new Date(request.deadline).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                            </div>
                            {request.clientMessage && (
                              <div className="bg-muted p-3 rounded-md mb-2">
                                <p className="text-sm font-medium mb-1">Client Message:</p>
                                <p className="text-sm" data-testid={`hire-request-message-${request.id}`}>
                                  {request.clientMessage}
                                </p>
                              </div>
                            )}
                            <p className="text-xs text-muted-foreground" data-testid={`hire-request-date-${request.id}`}>
                              Submitted: {new Date(request.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <Button
                              onClick={() => handleApproveHireRequest(request.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              disabled={approveHireRequestMutation.isPending}
                              data-testid={`approve-hire-request-${request.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  disabled={rejectHireRequestMutation.isPending}
                                  data-testid={`reject-hire-request-${request.id}`}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent data-testid={`reject-hire-request-dialog-${request.id}`}>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Reject Hire Request</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Please provide a response to the client explaining why this request was rejected (optional).
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <Textarea
                                  placeholder="Response to client..."
                                  value={adminResponse}
                                  onChange={(e) => setAdminResponse(e.target.value)}
                                  data-testid={`admin-response-${request.id}`}
                                />
                                <AlertDialogFooter>
                                  <AlertDialogCancel data-testid={`cancel-reject-hire-${request.id}`}>
                                    Cancel
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleRejectHireRequest(request.id)}
                                    data-testid={`confirm-reject-hire-${request.id}`}
                                  >
                                    Reject Request
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}