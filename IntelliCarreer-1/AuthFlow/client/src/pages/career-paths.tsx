import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import CareerCard from "@/components/career/career-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, BookmarkIcon, Star } from "lucide-react";

export default function CareerPaths() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("match");
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

  const { data: recommendations = [], isLoading: recommendationsLoading } = useQuery({
    queryKey: ["/api/career-recommendations"],
    enabled: !!isAuthenticated,
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

  // Filter and sort recommendations
  const filteredRecommendations = recommendations
    .filter((rec: any) => {
      const matchesSearch = rec.careerPath.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rec.careerPath.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      if (filterBy === "bookmarked") return matchesSearch && rec.isBookmarked;
      if (filterBy === "high-match") return matchesSearch && parseFloat(rec.matchScore) >= 80;
      return matchesSearch;
    })
    .sort((a: any, b: any) => {
      switch (sortBy) {
        case "match":
          return parseFloat(b.matchScore) - parseFloat(a.matchScore);
        case "salary":
          const aSalary = (a.careerPath.salaryMin + a.careerPath.salaryMax) / 2 || 0;
          const bSalary = (b.careerPath.salaryMin + b.careerPath.salaryMax) / 2 || 0;
          return bSalary - aSalary;
        case "title":
          return a.careerPath.title.localeCompare(b.careerPath.title);
        default:
          return 0;
      }
    });

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
                  Career Paths
                </h1>
                <p className="text-slate-600 mt-2">
                  Discover career opportunities tailored to your profile
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-primary border-primary">
                  <Star className="h-3 w-3 mr-1" />
                  {recommendations.length} recommendations
                </Badge>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                    <Input
                      placeholder="Search career paths..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                      data-testid="input-search-careers"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40" data-testid="select-sort-by">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="match">Match Score</SelectItem>
                      <SelectItem value="salary">Salary</SelectItem>
                      <SelectItem value="title">Title</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterBy} onValueChange={setFilterBy}>
                    <SelectTrigger className="w-40" data-testid="select-filter-by">
                      <SelectValue placeholder="Filter by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Careers</SelectItem>
                      <SelectItem value="bookmarked">Bookmarked</SelectItem>
                      <SelectItem value="high-match">High Match (80%+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Career Recommendations Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
          {recommendationsLoading ? (
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
          ) : filteredRecommendations.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Search className="h-12 w-12 mx-auto mb-4 text-slate-400" />
                <h3 className="text-lg font-semibold text-slate-900 mb-2">No career paths found</h3>
                <p className="text-slate-600">
                  {searchTerm || filterBy !== "all" 
                    ? "Try adjusting your search or filter criteria"
                    : "Complete your assessment to get personalized career recommendations"
                  }
                </p>
                {!searchTerm && filterBy === "all" && (
                  <Button 
                    className="mt-4"
                    onClick={() => window.location.href = '/onboarding'}
                    data-testid="button-take-assessment"
                  >
                    Take Assessment
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredRecommendations.map((recommendation: any) => (
                <CareerCard
                  key={recommendation.id}
                  recommendation={recommendation}
                  onBookmark={handleBookmark}
                  isBookmarking={bookmarkMutation.isPending}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
