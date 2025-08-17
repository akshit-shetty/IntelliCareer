import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ChartBar } from "lucide-react";

export default function SkillGapAnalysis() {
  const { data: userSkills = [], isLoading } = useQuery({
    queryKey: ["/api/user-skills"],
    retry: false,
  });

  const { data: allSkills = [] } = useQuery({
    queryKey: ["/api/skills"],
    retry: false,
  });

  // Create a map for easy skill lookup
  const skillsMap = allSkills.reduce((acc: any, skill: any) => {
    acc[skill.id] = skill;
    return acc;
  }, {});

  const getProgressColor = (level: number) => {
    if (level >= 4) return "bg-secondary";
    if (level >= 3) return "bg-accent";
    return "bg-primary";
  };

  const getSkillsToImprove = () => {
    return userSkills
      .filter((skill: any) => skill.targetLevel && skill.currentLevel < skill.targetLevel)
      .sort((a: any, b: any) => (b.targetLevel - b.currentLevel) - (a.targetLevel - a.currentLevel))
      .slice(0, 3);
  };

  const topSkillsToImprove = getSkillsToImprove();

  if (isLoading) {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg">Skill Gap Analysis</CardTitle>
          <ChartBar className="h-5 w-5 text-secondary animate-spin" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 bg-slate-200 rounded mb-2 w-1/2"></div>
                <div className="h-2 bg-slate-200 rounded"></div>
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
        <CardTitle className="text-lg">Skill Gap Analysis</CardTitle>
        <ChartBar className="h-5 w-5 text-secondary" />
      </CardHeader>
      <CardContent className="space-y-4">
        {topSkillsToImprove.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <ChartBar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No skill gaps identified</p>
            <p className="text-sm mt-2">Set skill targets to see your progress</p>
          </div>
        ) : (
          <>
            {topSkillsToImprove.map((userSkill: any) => {
              const skill = skillsMap[userSkill.skillId];
              const progress = (userSkill.currentLevel / 5) * 100;
              const targetProgress = (userSkill.targetLevel / 5) * 100;
              
              return (
                <div key={userSkill.id} data-testid={`skill-${skill?.name?.toLowerCase().replace(/\s+/g, '-')}`}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-slate-600">{skill?.name || 'Unknown Skill'}</span>
                    <span className="text-slate-900 font-medium">
                      {userSkill.currentLevel}/5 → {userSkill.targetLevel}/5
                    </span>
                  </div>
                  <div className="relative">
                    <Progress value={progress} className="h-2" />
                    {/* Target level indicator */}
                    <div 
                      className="absolute top-0 w-0.5 h-2 bg-red-400"
                      style={{ left: `${targetProgress}%` }}
                      title={`Target: Level ${userSkill.targetLevel}`}
                    />
                  </div>
                </div>
              );
            })}
            
            {topSkillsToImprove.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-slate-700">
                  <strong>Priority:</strong> Focus on improving{' '}
                  <span className="font-medium">
                    {skillsMap[topSkillsToImprove[0].skillId]?.name}
                  </span>{' '}
                  to reach your career goals faster.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
