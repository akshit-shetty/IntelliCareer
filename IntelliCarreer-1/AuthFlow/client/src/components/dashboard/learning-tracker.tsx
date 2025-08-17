import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { GraduationCap, BookOpen } from "lucide-react";

export default function LearningTracker() {
  const { data: userCourses = [], isLoading } = useQuery({
    queryKey: ["/api/user-courses"],
    retry: false,
  });

  const activeCourses = userCourses.filter((uc: any) => 
    uc.status === 'enrolled' || uc.status === 'in_progress'
  );

  const totalProgress = activeCourses.length > 0 
    ? Math.round(activeCourses.reduce((sum: number, course: any) => sum + (course.progress || 0), 0) / activeCourses.length)
    : 0;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-secondary';
      case 'in_progress': return 'bg-primary';
      case 'enrolled': return 'bg-accent';
      default: return 'bg-slate-400';
    }
  };

  const getProgressText = (progress: number, status: string) => {
    if (status === 'completed') return 'Completed';
    if (progress === 0) return 'Not started';
    return `${progress}%`;
  };

  if (isLoading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Learning Tracker</CardTitle>
          <GraduationCap className="h-5 w-5 text-accent animate-spin" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center animate-pulse">
              <div className="h-8 w-8 bg-slate-200 rounded mx-auto mb-2"></div>
              <div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">Learning Tracker</CardTitle>
        <GraduationCap className="h-5 w-5 text-accent" />
      </CardHeader>
      <CardContent className="space-y-4">
        {activeCourses.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No active courses</p>
            <p className="text-sm mt-2">Start learning to track your progress</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="mt-4"
              onClick={() => window.location.href = '/courses'}
              data-testid="button-browse-courses"
            >
              Browse Courses
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center" data-testid="stats-active-courses">
              <div className="text-3xl font-bold text-primary">{activeCourses.length}</div>
              <div className="text-sm text-slate-600">
                {activeCourses.length === 1 ? 'Course' : 'Courses'} in Progress
              </div>
            </div>
            
            <div className="space-y-3">
              {activeCourses.slice(0, 3).map((userCourse: any) => (
                <div 
                  key={userCourse.id} 
                  className="flex items-center justify-between"
                  data-testid={`course-${userCourse.course.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center flex-1">
                    <div className={`w-2 h-2 ${getStatusColor(userCourse.status)} rounded-full mr-2`}></div>
                    <span className="text-sm text-slate-700 truncate">{userCourse.course.title}</span>
                  </div>
                  <span className="text-xs text-slate-500 ml-2 flex-shrink-0">
                    {getProgressText(userCourse.progress || 0, userCourse.status)}
                  </span>
                </div>
              ))}
            </div>
            
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-600">Overall Progress</span>
                <span className="text-slate-900 font-medium" data-testid="text-overall-progress">
                  {totalProgress}%
                </span>
              </div>
              <Progress value={totalProgress} className="h-2 progress-gradient" />
            </div>
            
            {activeCourses.length > 3 && (
              <Button 
                variant="ghost" 
                className="w-full mt-4 text-accent hover:text-accent text-sm"
                onClick={() => window.location.href = '/courses'}
                data-testid="button-view-all-courses"
              >
                View All Courses →
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
