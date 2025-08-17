import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  Bookmark, 
  ExternalLink,
  Eye,
  Info
} from "lucide-react";

interface CareerCardProps {
  recommendation: {
    id: string;
    matchScore: string;
    isBookmarked: boolean;
    careerPathId: string;
    reasons?: string[];
    careerPath: {
      id: string;
      title: string;
      description?: string;
      salaryMin?: number;
      salaryMax?: number;
      demandLevel?: string;
      requiredSkills?: string[];
    };
  };
  onBookmark: (careerPathId: string) => void;
  isBookmarking: boolean;
}

export default function CareerCard({ recommendation, onBookmark, isBookmarking }: CareerCardProps) {
  const { careerPath, matchScore, isBookmarked, careerPathId, reasons } = recommendation;

  const formatSalary = (min?: number, max?: number) => {
    if (!min || !max) return 'Salary varies';
    return `$${(min / 1000).toFixed(0)}k-${(max / 1000).toFixed(0)}k`;
  };

  const getDemandColor = (demandLevel?: string) => {
    switch (demandLevel?.toLowerCase()) {
      case 'very high':
      case 'high': 
        return 'bg-secondary text-white';
      case 'growing': 
        return 'bg-accent text-white';
      case 'medium':
      case 'moderate':
        return 'bg-primary text-white';
      default: 
        return 'bg-slate-500 text-white';
    }
  };

  const getMatchColor = (score: number) => {
    if (score >= 90) return 'bg-secondary text-white';
    if (score >= 80) return 'bg-primary text-white';
    if (score >= 70) return 'bg-accent text-white';
    return 'bg-slate-500 text-white';
  };

  const matchPercentage = parseFloat(matchScore);

  return (
    <Card className="hover:shadow-lg transition-all duration-200 cursor-pointer group" data-testid={`card-career-${careerPath.title.toLowerCase().replace(/\s+/g, '-')}`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-slate-900 mb-2 group-hover:text-primary transition-colors">
              {careerPath.title}
            </h3>
            <div className="flex items-center text-sm text-slate-600 mb-2">
              <DollarSign className="h-4 w-4 mr-1" />
              <span>{formatSalary(careerPath.salaryMin, careerPath.salaryMax)}</span>
            </div>
            <div className="flex items-center mb-3">
              <TrendingUp className="h-4 w-4 mr-1 text-slate-500" />
              <Badge className={getDemandColor(careerPath.demandLevel)}>
                {careerPath.demandLevel || 'Standard'} Demand
              </Badge>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge className={getMatchColor(matchPercentage)}>
              {matchScore}% Match
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              className={`p-1 h-auto ${isBookmarked ? 'text-primary' : 'text-slate-400 hover:text-primary'}`}
              onClick={(e) => {
                e.stopPropagation();
                onBookmark(careerPathId);
              }}
              disabled={isBookmarking}
              data-testid={`button-bookmark-${careerPath.title.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Bookmark className={`h-5 w-5 ${isBookmarked ? 'fill-current' : ''}`} />
            </Button>
          </div>
        </div>
        
        {careerPath.description && (
          <div className="mb-4">
            <p className="text-sm text-slate-600 line-clamp-3">
              {careerPath.description}
            </p>
          </div>
        )}

        {careerPath.requiredSkills && careerPath.requiredSkills.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium text-slate-700 mb-2">Required Skills:</div>
            <div className="flex flex-wrap gap-1">
              {careerPath.requiredSkills.slice(0, 4).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {careerPath.requiredSkills.length > 4 && (
                <Badge variant="outline" className="text-xs">
                  +{careerPath.requiredSkills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {reasons && reasons.length > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <Info className="h-4 w-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-medium text-blue-900 mb-1">Why Recommended?</h4>
                <ul className="text-xs text-blue-700 space-y-1">
                  {reasons.slice(0, 2).map((reason, index) => (
                    <li key={index}>• {reason}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <Button 
            variant="ghost" 
            className="text-primary hover:text-blue-700 text-sm p-0 h-auto"
            data-testid={`button-view-details-${careerPath.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <Eye className="h-4 w-4 mr-1" />
            View Details
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="hover:bg-primary hover:text-white transition-colors"
            data-testid={`button-explore-${careerPath.title.toLowerCase().replace(/\s+/g, '-')}`}
          >
            <ExternalLink className="h-4 w-4 mr-1" />
            Explore
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
