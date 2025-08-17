import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { insertUserProfileSchema } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  User, 
  Mail, 
  Calendar,
  GraduationCap,
  Briefcase,
  Target,
  BookmarkIcon,
  Award,
  Clock
} from "lucide-react";

export default function Profile() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();
  const queryClient = useQueryClient();

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
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
  }, [isAuthenticated, isLoading, toast]);

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["/api/profile"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const { data: assessment } = useQuery({
    queryKey: ["/api/assessments"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const { data: bookmarkedCareers = [] } = useQuery({
    queryKey: ["/api/career-recommendations"],
    enabled: !!isAuthenticated,
    retry: false,
    select: (data: any[]) => data.filter(rec => rec.isBookmarked),
  });

  const { data: userCourses = [] } = useQuery({
    queryKey: ["/api/user-courses"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const form = useForm({
    resolver: zodResolver(insertUserProfileSchema.omit({ userId: true })),
    defaultValues: {
      age: profile?.age || "",
      experienceLevel: profile?.experienceLevel || "",
      educationLevel: profile?.educationLevel || "",
      currentField: profile?.currentField || "",
      careerGoals: profile?.careerGoals || "",
    },
  });

  useEffect(() => {
    if (profile) {
      form.reset({
        age: profile.age || "",
        experienceLevel: profile.experienceLevel || "",
        educationLevel: profile.educationLevel || "",
        currentField: profile.currentField || "",
        careerGoals: profile.careerGoals || "",
      });
    }
  }, [profile, form]);

  const updateProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/profile', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
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
        description: "Failed to update profile",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: any) => {
    updateProfileMutation.mutate(data);
  };

  const userInitials = user?.firstName && user?.lastName 
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || 'U';

  const completedCourses = userCourses.filter((uc: any) => uc.status === 'completed').length;
  const activeCourses = userCourses.filter((uc: any) => uc.status === 'in_progress' || uc.status === 'enrolled').length;

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center space-x-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user?.profileImageUrl} alt={user?.firstName || user?.email} />
                <AvatarFallback className="text-2xl">{userInitials}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold text-slate-900" data-testid="text-user-name">
                  {user?.firstName && user?.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user?.email
                  }
                </h1>
                <div className="flex items-center text-slate-600 mt-2">
                  <Mail className="h-4 w-4 mr-2" />
                  <span data-testid="text-user-email">{user?.email}</span>
                </div>
                <div className="flex items-center text-slate-600 mt-1">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Profile Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" data-testid="form-profile">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="age"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Age Range</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-age">
                                    <SelectValue placeholder="Select age range" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="18-24">18-24</SelectItem>
                                  <SelectItem value="25-34">25-34</SelectItem>
                                  <SelectItem value="35-44">35-44</SelectItem>
                                  <SelectItem value="45-54">45-54</SelectItem>
                                  <SelectItem value="55+">55+</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="experienceLevel"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Experience Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger data-testid="select-experience">
                                    <SelectValue placeholder="Select experience" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Student/Entry Level">Student/Entry Level</SelectItem>
                                  <SelectItem value="1-3 years">1-3 years</SelectItem>
                                  <SelectItem value="4-7 years">4-7 years</SelectItem>
                                  <SelectItem value="8-15 years">8-15 years</SelectItem>
                                  <SelectItem value="15+ years">15+ years</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="educationLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Education Level</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger data-testid="select-education">
                                  <SelectValue placeholder="Select education level" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="High School">High School</SelectItem>
                                <SelectItem value="Associate Degree">Associate Degree</SelectItem>
                                <SelectItem value="Bachelor's Degree">Bachelor's Degree</SelectItem>
                                <SelectItem value="Master's Degree">Master's Degree</SelectItem>
                                <SelectItem value="PhD/Doctorate">PhD/Doctorate</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentField"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Field/Industry</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="e.g., Technology, Healthcare, Finance" 
                                {...field}
                                data-testid="input-current-field"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="careerGoals"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Career Goals</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Describe your career aspirations and goals..."
                                className="min-h-[100px]"
                                {...field}
                                data-testid="textarea-career-goals"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <Button 
                        type="submit" 
                        disabled={updateProfileMutation.isPending}
                        data-testid="button-save-profile"
                      >
                        {updateProfileMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              {/* Assessment Results */}
              {assessment && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Award className="h-5 w-5 mr-2" />
                      Assessment Results
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Personality Traits</h4>
                        <p className="text-sm text-slate-600 mb-3">Based on your psychometric assessment</p>
                        <div className="grid grid-cols-2 gap-3">
                          {assessment.personalityTraits && Object.entries(assessment.personalityTraits).map(([trait, score]: [string, any]) => (
                            <div key={trait} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                              <span className="text-sm capitalize">{trait.replace(/([A-Z])/g, ' $1')}</span>
                              <Badge variant="outline">{score}/5</Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      {assessment.interestAreas && (
                        <div>
                          <h4 className="font-medium text-slate-900 mb-2">Interest Areas</h4>
                          <div className="flex flex-wrap gap-2">
                            {Object.entries(assessment.interestAreas).map(([area, score]: [string, any]) => (
                              <Badge key={area} variant="outline" className="text-xs">
                                {area}: {score}/5
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                    <Separator className="my-4" />
                    <div className="text-sm text-slate-600">
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2" />
                        Completed on {new Date(assessment.completedAt).toLocaleDateString()}
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-3"
                        onClick={() => window.location.href = '/onboarding'}
                        data-testid="button-retake-assessment"
                      >
                        Retake Assessment
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Statistics */}
              <Card>
                <CardHeader>
                  <CardTitle>My Statistics</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between" data-testid="stat-bookmarked-careers">
                    <div className="flex items-center">
                      <BookmarkIcon className="h-4 w-4 text-primary mr-2" />
                      <span className="text-sm">Bookmarked Careers</span>
                    </div>
                    <Badge variant="outline">{bookmarkedCareers.length}</Badge>
                  </div>
                  <div className="flex items-center justify-between" data-testid="stat-active-courses">
                    <div className="flex items-center">
                      <GraduationCap className="h-4 w-4 text-secondary mr-2" />
                      <span className="text-sm">Active Courses</span>
                    </div>
                    <Badge variant="outline">{activeCourses}</Badge>
                  </div>
                  <div className="flex items-center justify-between" data-testid="stat-completed-courses">
                    <div className="flex items-center">
                      <Award className="h-4 w-4 text-accent mr-2" />
                      <span className="text-sm">Completed Courses</span>
                    </div>
                    <Badge variant="outline">{completedCourses}</Badge>
                  </div>
                </CardContent>
              </Card>

              {/* Bookmarked Careers */}
              {bookmarkedCareers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <BookmarkIcon className="h-5 w-5 mr-2" />
                      Bookmarked Careers
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {bookmarkedCareers.slice(0, 3).map((career: any) => (
                        <div key={career.id} className="p-3 bg-slate-50 rounded-lg" data-testid={`bookmarked-career-${career.careerPath.title.toLowerCase().replace(/\s+/g, '-')}`}>
                          <h4 className="font-medium text-slate-900">{career.careerPath.title}</h4>
                          <p className="text-sm text-slate-600">{career.matchScore}% match</p>
                        </div>
                      ))}
                      {bookmarkedCareers.length > 3 && (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="w-full"
                          onClick={() => window.location.href = '/career-paths'}
                          data-testid="button-view-all-bookmarks"
                        >
                          View All ({bookmarkedCareers.length})
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/career-paths'}
                    data-testid="button-explore-careers"
                  >
                    <Briefcase className="h-4 w-4 mr-2" />
                    Explore Career Paths
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/courses'}
                    data-testid="button-find-courses"
                  >
                    <GraduationCap className="h-4 w-4 mr-2" />
                    Find Learning Courses
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => window.location.href = '/onboarding'}
                    data-testid="button-update-skills"
                  >
                    <Target className="h-4 w-4 mr-2" />
                    Update Skills & Goals
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
