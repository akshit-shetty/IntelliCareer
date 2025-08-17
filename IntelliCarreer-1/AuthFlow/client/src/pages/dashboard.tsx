import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/layout/navbar";
import CareerRecommendations from "@/components/dashboard/career-recommendations";
import SkillGapAnalysis from "@/components/dashboard/skill-gap-analysis";
import LearningTracker from "@/components/dashboard/learning-tracker";
import { ClipboardCheck, Search, Book, Sparkles } from "lucide-react";

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, isLoading, user } = useAuth();

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

  const { data: recommendations, isLoading: recommendationsLoading } = useQuery({
    queryKey: ["/api/career-recommendations"],
    enabled: !!isAuthenticated,
    retry: false,
  });

  // Check if user has completed onboarding
  useEffect(() => {
    if (!profileLoading && isAuthenticated && (!profile || !profile.completedOnboarding)) {
      setLocation('/onboarding');
    }
  }, [profile, profileLoading, isAuthenticated, setLocation]);

  if (isLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Navbar />
        <div className="flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-slate-600">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  const userName = user?.firstName || user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="pt-16">
        {/* Dashboard Header */}
        <div className="dashboard-header-gradient">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-3xl font-bold" data-testid="text-welcome-user">
                  Welcome back, {userName}!
                </h1>
                <p className="text-blue-100 mt-2">Ready to advance your career?</p>
              </div>
              <div className="text-right">
                <div className="text-sm text-blue-100">Career Journey</div>
                <div className="flex items-center text-2xl font-bold">
                  <Sparkles className="h-6 w-6 mr-2" />
                  <span data-testid="text-status">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <CareerRecommendations />
            <SkillGapAnalysis />
            <LearningTracker />
          </div>

          {/* Quick Actions */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Quick Actions</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center p-6 h-auto hover:border-primary hover:bg-blue-50"
                  onClick={() => setLocation('/onboarding')}
                  data-testid="button-retake-assessment"
                >
                  <div className="text-center">
                    <ClipboardCheck className="h-8 w-8 text-primary mx-auto mb-2" />
                    <span className="font-medium">Retake Assessment</span>
                    <p className="text-xs text-slate-500 mt-1">Update your career profile</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center p-6 h-auto hover:border-secondary hover:bg-emerald-50"
                  onClick={() => setLocation('/career-paths')}
                  data-testid="button-browse-careers"
                >
                  <div className="text-center">
                    <Search className="h-8 w-8 text-secondary mx-auto mb-2" />
                    <span className="font-medium">Browse Careers</span>
                    <p className="text-xs text-slate-500 mt-1">Explore career opportunities</p>
                  </div>
                </Button>
                
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center p-6 h-auto hover:border-accent hover:bg-emerald-50"
                  onClick={() => setLocation('/courses')}
                  data-testid="button-find-courses"
                >
                  <div className="text-center">
                    <Book className="h-8 w-8 text-accent mx-auto mb-2" />
                    <span className="font-medium">Find Courses</span>
                    <p className="text-xs text-slate-500 mt-1">Discover learning resources</p>
                  </div>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
