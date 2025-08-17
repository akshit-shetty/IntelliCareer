import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Search, 
  BookOpen, 
  Clock, 
  Star, 
  ExternalLink, 
  Play,
  CheckCircle,
  TrendingUp
} from "lucide-react";

export default function Courses() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterBy, setFilterBy] = useState("all");

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

  const { data: recommendedCourses = [], isLoading: coursesLoading } = useQuery({
    queryKey: ["/api/courses/recommended"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const { data: userCourses = [], isLoading: userCoursesLoading } = useQuery({
    queryKey: ["/api/user-courses"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  const enrollMutation = useMutation({
    mutationFn: async (courseId: string) => {
      await apiRequest('POST', `/api/courses/${courseId}/enroll`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-courses"] });
      toast({
        title: "Success",
        description: "Successfully enrolled in course",
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
        description: "Failed to enroll in course",
        variant: "destructive",
      });
    },
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ courseId, progress }: { courseId: string; progress: number }) => {
      await apiRequest('PATCH', `/api/courses/${courseId}/progress`, { progress });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/user-courses"] });
      toast({
        title: "Progress Updated",
        description: "Your course progress has been saved",
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
        description: "Failed to update progress",
        variant: "destructive",
      });
    },
  });

  const handleEnroll = (courseId: string) => {
    enrollMutation.mutate(courseId);
  };

  const handleProgressUpdate = (courseId: string, progress: number) => {
    updateProgressMutation.mutate({ courseId, progress });
  };

  const getEnrolledCourseIds = () => {
    return new Set(userCourses.map((uc: any) => uc.courseId));
  };

  const getDifficultyColor = (level?: string) => {
    switch (level?.toLowerCase()) {
      case 'beginner': return 'bg-secondary text-white';
      case 'intermediate': return 'bg-primary text-white';
      case 'advanced': return 'bg-destructive text-white';
      default: return 'bg-slate-500 text-white';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-secondary';
      case 'in_progress': return 'text-primary';
      case 'enrolled': return 'text-accent';
      default: return 'text-slate-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Play;
      case 'enrolled': return BookOpen;
      default: return BookOpen;
    }
  };

  const filteredCourses = recommendedCourses.filter((course: any) => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.provider?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterBy === "beginner") return matchesSearch && course.difficultyLevel === "beginner";
    if (filterBy === "intermediate") return matchesSearch && course.difficultyLevel === "intermediate";
    if (filterBy === "advanced") return matchesSearch && course.difficultyLevel === "advanced";
    return matchesSearch;
  });

  const enrolledCourseIds = getEnrolledCourseIds();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading...</p>
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
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-slate-900" data-testid="text-page-title">
                  Learning Courses
                </h1>
                <p className="text-slate-600 mt-2">
                  Enhance your skills with personalized course recommendations
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-primary border-primary">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  {userCourses.length} enrolled
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="recommended" className="space-y-6">
            <TabsList>
              <TabsTrigger value="recommended" data-testid="tab-recommended">Recommended</TabsTrigger>
              <TabsTrigger value="my-courses" data-testid="tab-my-courses">My Courses</TabsTrigger>
            </TabsList>

            <TabsContent value="recommended" className="space-y-6">
              {/* Search and Filters */}
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <Input
                          placeholder="Search courses..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10"
                          data-testid="input-search-courses"
                        />
                      </div>
                    </div>
                    <Select value={filterBy} onValueChange={setFilterBy}>
                      <SelectTrigger className="w-40" data-testid="select-difficulty">
                        <SelectValue placeholder="Difficulty" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Levels</SelectItem>
                        <SelectItem value="beginner">Beginner</SelectItem>
                        <SelectItem value="intermediate">Intermediate</SelectItem>
                        <SelectItem value="advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Recommended Courses Grid */}
              {coursesLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-slate-200 rounded mb-4"></div>
                        <div className="h-4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-4 bg-slate-200 rounded mb-4 w-3/4"></div>
                        <div className="h-20 bg-slate-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : filteredCourses.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No courses found</h3>
                    <p className="text-slate-600">
                      {searchTerm || filterBy !== "all" 
                        ? "Try adjusting your search or filter criteria"
                        : "Complete your skill assessment to get personalized course recommendations"
                      }
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredCourses.map((course: any) => (
                    <Card key={course.id} className="hover:shadow-lg transition-shadow" data-testid={`card-course-${course.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-lg font-semibold text-slate-900 mb-2 line-clamp-2">
                              {course.title}
                            </h3>
                            <p className="text-sm text-slate-600 mb-2">{course.provider}</p>
                            <div className="flex items-center gap-2 mb-3">
                              <Badge className={getDifficultyColor(course.difficultyLevel)}>
                                {course.difficultyLevel || 'All Levels'}
                              </Badge>
                              {course.duration && (
                                <div className="flex items-center text-xs text-slate-500">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {course.duration}
                                </div>
                              )}
                            </div>
                          </div>
                          {course.rating && (
                            <div className="flex items-center text-sm text-slate-600">
                              <Star className="h-4 w-4 text-yellow-400 mr-1 fill-current" />
                              {course.rating}
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-slate-600 mb-4 line-clamp-3">
                          {course.description}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="text-sm">
                            {course.cost === "Free" || course.cost === "0" ? (
                              <span className="text-secondary font-medium">Free</span>
                            ) : (
                              <span className="text-slate-600">{course.cost || 'Contact for pricing'}</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {course.url && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(course.url, '_blank')}
                                data-testid={`button-view-course-${course.title.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                            )}
                            {enrolledCourseIds.has(course.id) ? (
                              <Badge variant="outline" className="text-primary border-primary">
                                Enrolled
                              </Badge>
                            ) : (
                              <Button
                                size="sm"
                                onClick={() => handleEnroll(course.id)}
                                disabled={enrollMutation.isPending}
                                data-testid={`button-enroll-${course.title.toLowerCase().replace(/\s+/g, '-')}`}
                              >
                                {enrollMutation.isPending ? 'Enrolling...' : 'Enroll'}
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="my-courses" className="space-y-6">
              {userCoursesLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="animate-pulse">
                      <CardContent className="p-6">
                        <div className="h-6 bg-slate-200 rounded mb-4"></div>
                        <div className="h-4 bg-slate-200 rounded mb-2"></div>
                        <div className="h-2 bg-slate-200 rounded"></div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : userCourses.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <BookOpen className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                    <h3 className="text-lg font-semibold text-slate-900 mb-2">No enrolled courses</h3>
                    <p className="text-slate-600 mb-4">
                      Start learning by enrolling in recommended courses
                    </p>
                    <Button onClick={() => window.location.hash = "#recommended"} data-testid="button-browse-courses">
                      Browse Courses
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {userCourses.map((userCourse: any) => {
                    const StatusIcon = getStatusIcon(userCourse.status);
                    return (
                      <Card key={userCourse.id} className="hover:shadow-md transition-shadow" data-testid={`card-enrolled-${userCourse.course.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <StatusIcon className={`h-5 w-5 ${getStatusColor(userCourse.status)}`} />
                                <h3 className="text-lg font-semibold text-slate-900">
                                  {userCourse.course.title}
                                </h3>
                              </div>
                              <p className="text-sm text-slate-600 mb-2">{userCourse.course.provider}</p>
                              <Badge className={getDifficultyColor(userCourse.course.difficultyLevel)}>
                                {userCourse.course.difficultyLevel || 'All Levels'}
                              </Badge>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-primary">
                                {userCourse.progress || 0}%
                              </div>
                              <div className="text-xs text-slate-500 capitalize">
                                {userCourse.status.replace('_', ' ')}
                              </div>
                            </div>
                          </div>

                          <div className="mb-4">
                            <Progress value={userCourse.progress || 0} className="h-2" />
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="text-sm text-slate-600">
                              {userCourse.status === 'completed' 
                                ? `Completed on ${new Date(userCourse.completedAt).toLocaleDateString()}`
                                : `Started on ${new Date(userCourse.startedAt).toLocaleDateString()}`
                              }
                            </div>
                            <div className="flex gap-2">
                              {userCourse.course.url && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => window.open(userCourse.course.url, '_blank')}
                                  data-testid={`button-continue-${userCourse.course.title.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  <ExternalLink className="h-4 w-4 mr-2" />
                                  Continue
                                </Button>
                              )}
                              {userCourse.status !== 'completed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => {
                                    const newProgress = Math.min((userCourse.progress || 0) + 10, 100);
                                    handleProgressUpdate(userCourse.courseId, newProgress);
                                  }}
                                  disabled={updateProgressMutation.isPending}
                                  data-testid={`button-update-progress-${userCourse.course.title.toLowerCase().replace(/\s+/g, '-')}`}
                                >
                                  +10% Progress
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
