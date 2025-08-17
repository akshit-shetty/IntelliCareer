import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertUserProfileSchema, insertAssessmentSchema, insertUserSkillSchema } from "@shared/schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  ChevronLeft, 
  ChevronRight, 
  User, 
  Brain, 
  Target, 
  CheckCircle,
  Star
} from "lucide-react";
import { z } from "zod";

interface OnboardingFormProps {
  onComplete: () => void;
}

const TOTAL_STEPS = 4;

// Step schemas
const basicInfoSchema = insertUserProfileSchema.omit({ userId: true });
const skillsSchema = z.object({
  skills: z.array(z.object({
    skillId: z.string(),
    currentLevel: z.number().min(1).max(5),
    targetLevel: z.number().min(1).max(5).optional(),
    isLearning: z.boolean().default(false),
  })),
});

const assessmentSchema = z.object({
  personalityTraits: z.object({
    openness: z.number().min(1).max(5),
    conscientiousness: z.number().min(1).max(5),
    extraversion: z.number().min(1).max(5),
    agreeableness: z.number().min(1).max(5),
    neuroticism: z.number().min(1).max(5),
  }),
  interestAreas: z.object({
    realistic: z.number().min(1).max(5),
    investigative: z.number().min(1).max(5),
    artistic: z.number().min(1).max(5),
    social: z.number().min(1).max(5),
    enterprising: z.number().min(1).max(5),
    conventional: z.number().min(1).max(5),
  }),
});

export default function OnboardingForm({ onComplete }: OnboardingFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [profileData, setProfileData] = useState<any>(null);
  const [skillsData, setSkillsData] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: skills = [] } = useQuery({
    queryKey: ["/api/skills"],
    retry: false,
  });

  // Forms for each step
  const basicInfoForm = useForm({
    resolver: zodResolver(basicInfoSchema),
    defaultValues: {
      age: "",
      experienceLevel: "",
      educationLevel: "",
      currentField: "",
      careerGoals: "",
    },
  });

  const skillsForm = useForm({
    resolver: zodResolver(skillsSchema),
    defaultValues: {
      skills: [],
    },
  });

  const assessmentForm = useForm({
    resolver: zodResolver(assessmentSchema),
    defaultValues: {
      personalityTraits: {
        openness: 3,
        conscientiousness: 3,
        extraversion: 3,
        agreeableness: 3,
        neuroticism: 3,
      },
      interestAreas: {
        realistic: 3,
        investigative: 3,
        artistic: 3,
        social: 3,
        enterprising: 3,
        conventional: 3,
      },
    },
  });

  // Mutations
  const createProfileMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/profile', data);
      return response.json();
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
        description: "Failed to save profile",
        variant: "destructive",
      });
    },
  });

  const saveSkillsMutation = useMutation({
    mutationFn: async (skills: any[]) => {
      await Promise.all(
        skills.map(skill => 
          apiRequest('POST', '/api/user-skills', skill)
        )
      );
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
        description: "Failed to save skills",
        variant: "destructive",
      });
    },
  });

  const createAssessmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest('POST', '/api/assessments', data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/profile"] });
      queryClient.invalidateQueries({ queryKey: ["/api/career-recommendations"] });
      toast({
        title: "Success",
        description: "Onboarding completed successfully!",
      });
      onComplete();
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
        description: "Failed to save assessment",
        variant: "destructive",
      });
    },
  });

  const handleNext = async () => {
    if (currentStep === 1) {
      const isValid = await basicInfoForm.trigger();
      if (isValid) {
        const data = basicInfoForm.getValues();
        setProfileData(data);
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      const isValid = await skillsForm.trigger();
      if (isValid) {
        const data = skillsForm.getValues();
        setSkillsData(data);
        setCurrentStep(3);
      }
    } else if (currentStep === 3) {
      const isValid = await assessmentForm.trigger();
      if (isValid) {
        const data = assessmentForm.getValues();
        setAssessmentData(data);
        setCurrentStep(4);
      }
    } else if (currentStep === 4) {
      // Submit all data
      await handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      // Save profile
      const profileWithCompletion = { 
        ...profileData, 
        completedOnboarding: true 
      };
      await createProfileMutation.mutateAsync(profileWithCompletion);

      // Save skills
      if (skillsData.skills.length > 0) {
        await saveSkillsMutation.mutateAsync(skillsData.skills);
      }

      // Save assessment
      await createAssessmentMutation.mutateAsync(assessmentData);
    } catch (error) {
      console.error('Onboarding submission error:', error);
    }
  };

  const progress = (currentStep / TOTAL_STEPS) * 100;

  const isLoading = createProfileMutation.isPending || 
                   saveSkillsMutation.isPending || 
                   createAssessmentMutation.isPending;

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Welcome to IntelliCareer</h1>
          <p className="text-slate-600">Let's get to know you better to provide personalized career recommendations</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-600">Step {currentStep} of {TOTAL_STEPS}</span>
            <span className="text-sm text-slate-600">{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              {currentStep === 1 && <User className="h-8 w-8 text-primary" />}
              {currentStep === 2 && <Target className="h-8 w-8 text-secondary" />}
              {currentStep === 3 && <Brain className="h-8 w-8 text-accent" />}
              {currentStep === 4 && <CheckCircle className="h-8 w-8 text-primary" />}
            </div>
            <CardTitle>
              {currentStep === 1 && "Basic Information"}
              {currentStep === 2 && "Skills Assessment"}
              {currentStep === 3 && "Personality & Interests"}
              {currentStep === 4 && "Review & Complete"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <Form {...basicInfoForm}>
                <form className="space-y-6" data-testid="form-basic-info">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={basicInfoForm.control}
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
                      control={basicInfoForm.control}
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
                    control={basicInfoForm.control}
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
                    control={basicInfoForm.control}
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
                    control={basicInfoForm.control}
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
                </form>
              </Form>
            )}

            {/* Step 2: Skills Assessment */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-slate-600">
                    Select your skills and rate your current proficiency level
                  </p>
                </div>
                
                <Form {...skillsForm}>
                  <div className="space-y-4" data-testid="form-skills">
                    {skills.slice(0, 10).map((skill: any) => (
                      <div key={skill.id} className="p-4 border border-slate-200 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium text-slate-900">{skill.name}</h4>
                            <p className="text-sm text-slate-600">{skill.description}</p>
                            <Badge variant="outline" className="mt-1 text-xs">
                              {skill.category}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label className="text-sm">Current Level</Label>
                            <RadioGroup
                              defaultValue="3"
                              className="flex space-x-4 mt-2"
                              onValueChange={(value) => {
                                const currentSkills = skillsForm.getValues().skills;
                                const existingIndex = currentSkills.findIndex(s => s.skillId === skill.id);
                                const skillData = {
                                  skillId: skill.id,
                                  currentLevel: parseInt(value),
                                  targetLevel: 5,
                                  isLearning: true,
                                };
                                
                                if (existingIndex >= 0) {
                                  currentSkills[existingIndex] = { ...currentSkills[existingIndex], ...skillData };
                                } else {
                                  currentSkills.push(skillData);
                                }
                                
                                skillsForm.setValue('skills', currentSkills);
                              }}
                            >
                              {[1, 2, 3, 4, 5].map((level) => (
                                <div key={level} className="flex items-center space-x-1">
                                  <RadioGroupItem value={level.toString()} id={`${skill.id}-${level}`} />
                                  <Label htmlFor={`${skill.id}-${level}`} className="text-xs">
                                    {level}
                                  </Label>
                                </div>
                              ))}
                            </RadioGroup>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Form>
              </div>
            )}

            {/* Step 3: Personality & Interests Assessment */}
            {currentStep === 3 && (
              <Form {...assessmentForm}>
                <div className="space-y-8" data-testid="form-assessment">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Personality Traits</h3>
                    <p className="text-sm text-slate-600 mb-6">
                      Rate yourself on these personality dimensions (1 = Strongly Disagree, 5 = Strongly Agree)
                    </p>
                    
                    <div className="space-y-4">
                      {[
                        { name: 'openness', label: 'I am open to new experiences and ideas' },
                        { name: 'conscientiousness', label: 'I am organized and detail-oriented' },
                        { name: 'extraversion', label: 'I am outgoing and energetic around others' },
                        { name: 'agreeableness', label: 'I am cooperative and trusting' },
                        { name: 'neuroticism', label: 'I often feel anxious or stressed' },
                      ].map((trait) => (
                        <FormField
                          key={trait.name}
                          control={assessmentForm.control}
                          name={`personalityTraits.${trait.name}` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">{trait.label}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  defaultValue={field.value?.toString()}
                                  className="flex space-x-6"
                                >
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <div key={value} className="flex items-center space-x-2">
                                      <RadioGroupItem value={value.toString()} id={`${trait.name}-${value}`} />
                                      <Label htmlFor={`${trait.name}-${value}`} className="text-sm">
                                        {value}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold text-slate-900 mb-4">Interest Areas</h3>
                    <p className="text-sm text-slate-600 mb-6">
                      How interested are you in these areas? (1 = Not Interested, 5 = Very Interested)
                    </p>
                    
                    <div className="space-y-4">
                      {[
                        { name: 'realistic', label: 'Working with tools, machines, or hands-on activities' },
                        { name: 'investigative', label: 'Research, analysis, and problem-solving' },
                        { name: 'artistic', label: 'Creative expression and artistic pursuits' },
                        { name: 'social', label: 'Helping and working with people' },
                        { name: 'enterprising', label: 'Leadership, sales, and business activities' },
                        { name: 'conventional', label: 'Organizing data and following procedures' },
                      ].map((interest) => (
                        <FormField
                          key={interest.name}
                          control={assessmentForm.control}
                          name={`interestAreas.${interest.name}` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-sm">{interest.label}</FormLabel>
                              <FormControl>
                                <RadioGroup
                                  onValueChange={(value) => field.onChange(parseInt(value))}
                                  defaultValue={field.value?.toString()}
                                  className="flex space-x-6"
                                >
                                  {[1, 2, 3, 4, 5].map((value) => (
                                    <div key={value} className="flex items-center space-x-2">
                                      <RadioGroupItem value={value.toString()} id={`${interest.name}-${value}`} />
                                      <Label htmlFor={`${interest.name}-${value}`} className="text-sm">
                                        {value}
                                      </Label>
                                    </div>
                                  ))}
                                </RadioGroup>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </Form>
            )}

            {/* Step 4: Review & Complete */}
            {currentStep === 4 && (
              <div className="space-y-6" data-testid="step-review">
                <div className="text-center">
                  <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">Ready to Complete Your Profile</h3>
                  <p className="text-slate-600">
                    We'll now analyze your information and generate personalized career recommendations
                  </p>
                </div>

                <div className="bg-slate-50 rounded-lg p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Basic Information</span>
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Skills Assessment</span>
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-600">Personality & Interests</span>
                    <CheckCircle className="h-5 w-5 text-secondary" />
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-slate-600">
                    Click "Complete Setup" to finish your onboarding and start receiving career recommendations!
                  </p>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1 || isLoading}
                className={currentStep === 1 ? 'invisible' : ''}
                data-testid="button-previous"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <Button
                onClick={handleNext}
                disabled={isLoading}
                data-testid="button-next"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Setting up...
                  </>
                ) : currentStep === TOTAL_STEPS ? (
                  <>
                    <Star className="h-4 w-4 mr-2" />
                    Complete Setup
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
