import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Route, DollarSign, TrendingUp, Bookmark } from "lucide-react";

export default function CareerRecommendations() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recommendations = [], isLoading } = useQuery({
    queryKey: ["/api/career-recommendations"],
    retry: false,
  });

  const bookmarkMutation = useMutation({
    mutationFn: async (careerPathId: string) => {
      await apiRequest('POST', `/api/career-recommendations/${careerPathId}/bookmark`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/career-recommendations"] });
      toast({
        title: "Success",
        description: "Bookmark updated successfully",
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
        description: "Failed to update bookmark",
        variant: "destructive",
      });
    },
  });

  const handleBookmark = (careerPathId: string) => {
    bookmarkMutation.mutate(careerPathId);
  };

  const formatSalary = (min?: number, max?: number) => {
    if (!min || !max) return 'Salary varies';
    return `$${(min / 1000).toFixed(0)}k-${(max / 1000).toFixed(0)}k`;
  };

  const getDemandColor = (demandLevel?: string) => {
    switch (demandLevel?.toLowerCase()) {
      case 'high': return 'text-secondary';
      case 'very high': return 'text-primary';
      case 'growing': return 'text-accent';
      default: return 'text-slate-500';
    }
  };

  if (isLoading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Career Recommendations</CardTitle>
          <Route className="h-5 w-5 text-primary animate-spin" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-3 bg-slate-50 rounded-lg animate-pulse">
                <div className="h-4 bg-slate-200 rounded mb-2"></div>
                <div className="h-3 bg-slate-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Career Recommendations</CardTitle>
        <Route className="h-5 w-5 text-primary" />
      </CardHeader>
      <CardContent className="space-y-3">
        {recommendations.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Route className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No recommendations yet</p>
            <p className="text-sm mt-2">Complete your assessment to get personalized career suggestions</p>
          </div>
        ) : (
          <>
            {recommendations.slice(0, 3).map((recommendation: any) => (
              <div 
                key={recommendation.id} 
                className="flex items-center justify-between p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                data-testid={`card-career-${recommendation.careerPath.title.toLowerCase().replace(/\s+/g, '-')}`}
              >
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium text-slate-900">{recommendation.careerPath.title}</div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className={`p-0 h-auto ${recommendation.isBookmarked ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
                      onClick={() => handleBookmark(recommendation.careerPathId)}
                      disabled={bookmarkMutation.isPending}
                      data-testid={`button-bookmark-${recommendation.careerPath.title.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Bookmark className={`h-4 w-4 ${recommendation.isBookmarked ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  <div className="text-sm text-slate-600 mb-1">
                    {recommendation.matchScore}% match
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center text-slate-600">
                      <DollarSign className="h-3 w-3 mr-1" />
                      <span>{formatSalary(recommendation.careerPath.salaryMin, recommendation.careerPath.salaryMax)}</span>
                    </div>
                    <div className={`flex items-center ${getDemandColor(recommendation.careerPath.demandLevel)}`}>
                      <TrendingUp className="h-3 w-3 mr-1" />
                      <span className="capitalize">{recommendation.careerPath.demandLevel || 'Standard'} demand</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            <Button 
              variant="ghost" 
              className="w-full mt-4 text-primary hover:text-blue-700 text-sm"
              onClick={() => window.location.href = '/career-paths'}
              data-testid="button-view-all-recommendations"
            >
              View All Recommendations →
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
