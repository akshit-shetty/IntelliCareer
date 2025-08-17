import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  User, 
  Brain, 
  ChartBar, 
  TrendingUp,
  Route,
  GraduationCap,
  Search,
  Book,
  ClipboardCheck,
  Menu,
  X,
  Star,
  DollarSign,
  Bookmark
} from "lucide-react";

export default function Landing() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMobileMenuOpen(false);
  };

  const handleLogin = () => {
    window.location.href = '/api/login';
  };

  const handleSignup = () => {
    window.location.href = '/api/login';
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-primary">IntelliCareer</h1>
              </div>
              <div className="hidden md:block ml-10">
                <div className="flex items-baseline space-x-4">
                  <button 
                    onClick={() => scrollToSection('home')}
                    className="text-slate-900 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                    data-testid="nav-home"
                  >
                    Home
                  </button>
                  <button 
                    onClick={() => scrollToSection('features')}
                    className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                    data-testid="nav-features"
                  >
                    Features
                  </button>
                  <button 
                    onClick={() => scrollToSection('dashboard')}
                    className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                    data-testid="nav-dashboard"
                  >
                    Dashboard
                  </button>
                  <button 
                    onClick={() => scrollToSection('careers')}
                    className="text-slate-600 hover:text-primary px-3 py-2 rounded-md text-sm font-medium"
                    data-testid="nav-careers"
                  >
                    Career Paths
                  </button>
                </div>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="ml-4 flex items-center md:ml-6 space-x-3">
                <Button 
                  variant="ghost" 
                  onClick={handleLogin}
                  data-testid="button-login"
                >
                  Login
                </Button>
                <Button 
                  onClick={handleSignup}
                  data-testid="button-get-started"
                >
                  Get Started
                </Button>
              </div>
            </div>
            <div className="md:hidden">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                data-testid="button-mobile-menu"
              >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </Button>
            </div>
          </div>
        </div>
        
        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-slate-900 block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('features')}
                className="text-slate-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('dashboard')}
                className="text-slate-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Dashboard
              </button>
              <button 
                onClick={() => scrollToSection('careers')}
                className="text-slate-600 hover:text-primary block px-3 py-2 rounded-md text-base font-medium w-full text-left"
              >
                Career Paths
              </button>
              <div className="border-t border-slate-200 pt-3 mt-3">
                <Button 
                  variant="ghost" 
                  onClick={handleLogin}
                  className="w-full justify-start"
                >
                  Login
                </Button>
                <Button 
                  onClick={handleSignup}
                  className="w-full mt-2"
                >
                  Get Started
                </Button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section id="home" className="hero-gradient pt-16 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8 items-center">
            <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
              <h1 className="text-4xl font-bold text-slate-900 sm:text-5xl lg:text-6xl">
                Your Personalized{' '}
                <span className="text-primary">AI Career</span>{' '}
                <span className="text-secondary">Guide</span>
              </h1>
              <p className="mt-6 text-xl text-slate-600 max-w-3xl">
                Discover your strengths. Find your path. Build your future with personalized career recommendations powered by AI.
              </p>
              <div className="mt-8 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex">
                  <Button 
                    size="lg"
                    onClick={handleSignup}
                    className="w-full sm:w-auto"
                    data-testid="button-hero-get-started"
                  >
                    Get Started Free
                  </Button>
                  <Button 
                    size="lg"
                    variant="outline"
                    onClick={handleLogin}
                    className="w-full sm:w-auto"
                    data-testid="button-hero-login"
                  >
                    Login
                  </Button>
                </div>
              </div>
            </div>
            <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
              <div className="relative mx-auto w-full rounded-lg shadow-2xl lg:max-w-md">
                <img 
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
                  alt="Career dashboard interface preview" 
                  className="w-full rounded-lg shadow-xl"
                  data-testid="img-hero-preview"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">
              Why Choose IntelliCareer?
            </h2>
            <p className="mt-4 max-w-2xl text-xl text-slate-600 lg:mx-auto">
              Our AI-powered platform provides comprehensive career guidance tailored to your unique profile and goals.
            </p>
          </div>

          <div className="mt-16">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              <div className="text-center" data-testid="feature-personalized">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-primary text-white">
                    <User size={24} />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">Personalized Recommendations</h3>
                <p className="mt-2 text-base text-slate-600">
                  AI-driven career suggestions based on your skills, interests, and market trends.
                </p>
              </div>

              <div className="text-center" data-testid="feature-insights">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-secondary text-white">
                    <Brain size={24} />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">Psychometric Insights</h3>
                <p className="mt-2 text-base text-slate-600">
                  Understand your personality traits and how they align with different career paths.
                </p>
              </div>

              <div className="text-center" data-testid="feature-analysis">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-accent text-white">
                    <ChartBar size={24} />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">Skill Gap Analysis</h3>
                <p className="mt-2 text-base text-slate-600">
                  Identify exactly what skills you need to reach your career goals.
                </p>
              </div>

              <div className="text-center" data-testid="feature-market-driven">
                <div className="flex justify-center">
                  <div className="flex items-center justify-center h-16 w-16 rounded-md bg-primary text-white">
                    <TrendingUp size={24} />
                  </div>
                </div>
                <h3 className="mt-6 text-lg font-semibold text-slate-900">Market-Driven Suggestions</h3>
                <p className="mt-2 text-base text-slate-600">
                  Stay ahead with recommendations based on current job market demands.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section id="dashboard" className="py-16 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Your Career Command Center</h2>
            <p className="mt-4 text-xl text-slate-600">Track your progress, explore opportunities, and build your future</p>
          </div>

          <Card className="overflow-hidden">
            {/* Dashboard Header */}
            <div className="dashboard-header-gradient p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold" data-testid="text-welcome-user">Welcome back, Sarah!</h3>
                  <p className="text-blue-100 mt-1">Ready to advance your career?</p>
                </div>
                <div className="text-right">
                  <div className="text-sm text-blue-100">Career Match Score</div>
                  <div className="text-3xl font-bold" data-testid="text-match-score">87%</div>
                </div>
              </div>
            </div>

            {/* Dashboard Content */}
            <CardContent className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Career Recommendations Card */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg">Career Recommendations</CardTitle>
                    <Route className="h-5 w-5 text-primary" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg" data-testid="card-career-data-scientist">
                      <div>
                        <div className="font-medium text-slate-900">Data Scientist</div>
                        <div className="text-sm text-slate-600">92% match</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-900">$95k-120k</div>
                        <div className="text-xs text-secondary">High demand</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg" data-testid="card-career-ai-engineer">
                      <div>
                        <div className="font-medium text-slate-900">AI Engineer</div>
                        <div className="text-sm text-slate-600">89% match</div>
                      </div>
                      <div class="text-right">
                        <div className="text-sm font-medium text-slate-900">$110k-140k</div>
                        <div className="text-xs text-secondary">Very high demand</div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg" data-testid="card-career-product-manager">
                      <div>
                        <div className="font-medium text-slate-900">Product Manager</div>
                        <div className="text-sm text-slate-600">85% match</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-slate-900">$100k-130k</div>
                        <div className="text-xs text-accent">Growing demand</div>
                      </div>
                    </div>
                    <Button variant="ghost" className="w-full mt-4 text-primary hover:text-blue-700 text-sm" data-testid="button-view-recommendations">
                      View All Recommendations →
                    </Button>
                  </CardContent>
                </Card>

                {/* Skill Gap Analysis Card */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg">Skill Gap Analysis</CardTitle>
                    <ChartBar className="h-5 w-5 text-secondary" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div data-testid="skill-python">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Python</span>
                        <span className="text-slate-900 font-medium">75%</span>
                      </div>
                      <Progress value={75} className="h-2" />
                    </div>
                    <div data-testid="skill-ml">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Machine Learning</span>
                        <span className="text-slate-900 font-medium">45%</span>
                      </div>
                      <Progress value={45} className="h-2" />
                    </div>
                    <div data-testid="skill-data-analysis">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-slate-600">Data Analysis</span>
                        <span className="text-slate-900 font-medium">85%</span>
                      </div>
                      <Progress value={85} className="h-2" />
                    </div>
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm text-slate-700">
                        <strong>Priority:</strong> Focus on improving Machine Learning skills to reach your Data Scientist goal.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Learning Tracker Card */}
                <Card className="hover:shadow-md transition-shadow">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-lg">Learning Tracker</CardTitle>
                    <GraduationCap className="h-5 w-5 text-accent" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="text-center" data-testid="stats-courses-progress">
                      <div className="text-3xl font-bold text-primary">3</div>
                      <div className="text-sm text-slate-600">Courses in Progress</div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between" data-testid="course-python-data-science">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-secondary rounded-full mr-2"></div>
                          <span className="text-sm text-slate-700">Python for Data Science</span>
                        </div>
                        <span className="text-xs text-slate-500">Week 3/8</span>
                      </div>
                      <div className="flex items-center justify-between" data-testid="course-ml-fundamentals">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-primary rounded-full mr-2"></div>
                          <span className="text-sm text-slate-700">ML Fundamentals</span>
                        </div>
                        <span className="text-xs text-slate-500">Week 1/6</span>
                      </div>
                      <div className="flex items-center justify-between" data-testid="course-statistics">
                        <div className="flex items-center">
                          <div className="w-2 h-2 bg-accent rounded-full mr-2"></div>
                          <span className="text-sm text-slate-700">Statistics Review</span>
                        </div>
                        <span className="text-xs text-slate-500">Week 2/4</span>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-slate-600">Weekly Goal</span>
                        <span className="text-slate-900 font-medium" data-testid="text-weekly-goal">4/5 hours</span>
                      </div>
                      <Progress value={80} className="h-2 progress-gradient" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center p-4 hover:border-primary hover:bg-blue-50"
                  data-testid="button-retake-assessment"
                >
                  <ClipboardCheck className="h-5 w-5 text-primary mr-2" />
                  <span>Retake Assessment</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center p-4 hover:border-secondary hover:bg-emerald-50"
                  data-testid="button-browse-jobs"
                >
                  <Search className="h-5 w-5 text-secondary mr-2" />
                  <span>Browse Jobs</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center justify-center p-4 hover:border-accent hover:bg-emerald-50"
                  data-testid="button-find-courses"
                >
                  <Book className="h-5 w-5 text-accent mr-2" />
                  <span>Find Courses</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Career Recommendations Section */}
      <section id="careers" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 sm:text-4xl">Explore Career Paths</h2>
            <p className="mt-4 text-xl text-slate-600">Discover opportunities tailored to your profile</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Data Scientist Career Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-career-data-scientist-detailed">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">Data Scientist</CardTitle>
                    <div className="flex items-center text-sm text-slate-600 mb-2">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>$95,000 - $120,000</span>
                    </div>
                    <div className="flex items-center text-sm text-secondary mb-3">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>High Demand</span>
                    </div>
                  </div>
                  <Badge className="bg-primary text-white">92% Match</Badge>
                </div>
                
                <CardDescription className="mb-4 line-clamp-3">
                  Analyze complex data sets to derive actionable insights for business decisions. Requires strong statistical knowledge and programming skills.
                </CardDescription>

                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-2">Required Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Python</Badge>
                    <Badge variant="outline" className="text-xs">Statistics</Badge>
                    <Badge variant="outline" className="text-xs">SQL</Badge>
                    <Badge variant="outline" className="text-xs">Machine Learning</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="ghost" className="text-primary hover:text-blue-700 text-sm p-0" data-testid="button-view-details-ds">
                    View Details →
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500" data-testid="button-bookmark-ds">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* AI Engineer Career Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-career-ai-engineer-detailed">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">AI Engineer</CardTitle>
                    <div className="flex items-center text-sm text-slate-600 mb-2">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>$110,000 - $140,000</span>
                    </div>
                    <div className="flex items-center text-sm text-secondary mb-3">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>Very High Demand</span>
                    </div>
                  </div>
                  <Badge className="bg-secondary text-white">89% Match</Badge>
                </div>
                
                <CardDescription className="mb-4 line-clamp-3">
                  Design and implement artificial intelligence systems and algorithms. Work on cutting-edge AI applications and model optimization.
                </CardDescription>

                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-2">Required Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">TensorFlow</Badge>
                    <Badge variant="outline" className="text-xs">PyTorch</Badge>
                    <Badge variant="outline" className="text-xs">Deep Learning</Badge>
                    <Badge variant="outline" className="text-xs">Python</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="ghost" className="text-primary hover:text-blue-700 text-sm p-0" data-testid="button-view-details-ai">
                    View Details →
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500" data-testid="button-bookmark-ai">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Product Manager Career Card */}
            <Card className="hover:shadow-lg transition-shadow cursor-pointer" data-testid="card-career-pm-detailed">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">Product Manager</CardTitle>
                    <div className="flex items-center text-sm text-slate-600 mb-2">
                      <DollarSign className="h-4 w-4 mr-1" />
                      <span>$100,000 - $130,000</span>
                    </div>
                    <div className="flex items-center text-sm text-accent mb-3">
                      <TrendingUp className="h-4 w-4 mr-1" />
                      <span>Growing Demand</span>
                    </div>
                  </div>
                  <Badge className="bg-accent text-white">85% Match</Badge>
                </div>
                
                <CardDescription className="mb-4 line-clamp-3">
                  Lead product development from conception to launch. Collaborate with cross-functional teams and drive product strategy decisions.
                </CardDescription>

                <div className="mb-4">
                  <div className="text-sm font-medium text-slate-700 mb-2">Required Skills:</div>
                  <div className="flex flex-wrap gap-1">
                    <Badge variant="outline" className="text-xs">Strategy</Badge>
                    <Badge variant="outline" className="text-xs">Analytics</Badge>
                    <Badge variant="outline" className="text-xs">Leadership</Badge>
                    <Badge variant="outline" className="text-xs">Agile</Badge>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <Button variant="ghost" className="text-primary hover:text-blue-700 text-sm p-0" data-testid="button-view-details-pm">
                    View Details →
                  </Button>
                  <Button variant="ghost" size="sm" className="text-slate-400 hover:text-red-500" data-testid="button-bookmark-pm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <h3 className="text-2xl font-bold text-white mb-4">IntelliCareer</h3>
              <p className="text-slate-300 mb-4 max-w-md">
                Empowering professionals to discover their ideal career paths through AI-driven insights and personalized recommendations.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Platform</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white" data-testid="footer-career-assessment">Career Assessment</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white" data-testid="footer-skill-analysis">Skill Analysis</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white" data-testid="footer-course-recommendations">Course Recommendations</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white" data-testid="footer-progress-tracking">Progress Tracking</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-white mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-slate-300 hover:text-white" data-testid="footer-help-center">Help Center</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white" data-testid="footer-privacy-policy">Privacy Policy</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white" data-testid="footer-terms">Terms of Service</a></li>
                <li><a href="#" className="text-slate-300 hover:text-white" data-testid="footer-contact">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-700 mt-8 pt-8 text-center">
            <p className="text-slate-400">&copy; 2024 IntelliCareer. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
