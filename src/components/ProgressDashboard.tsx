import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserProfile, UserProgress } from '@/pages/Index';
import { Award, BookText, Users, Globe, Loader2, RefreshCw } from 'lucide-react';
import { getUserProgress } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import LogoutButton from '@/components/LogoutButton';

interface ProgressDashboardProps {
  profile: UserProfile;
  progress: UserProgress;
  onBack: () => void;
  onLogout?: () => void;
  onStartLearning?: () => void;
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ profile, progress, onBack, onLogout, onStartLearning }) => {
  const [supabaseProgress, setSupabaseProgress] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Safety check for undefined progress
  if (!progress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading Progress...</h2>
            <p className="text-gray-600">Please wait while we load your learning progress.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Safety check for undefined profile
  if (!profile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Profile Not Found</h2>
            <p className="text-gray-600">Please set up your profile first.</p>
            <Button onClick={onBack} className="mt-4">
              Back to Setup
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  useEffect(() => {
    loadSupabaseProgress();
  }, [profile]);

  const loadSupabaseProgress = async () => {
    setIsLoading(true);
    try {
      const progressData = await getUserProgress(profile.name);
      setSupabaseProgress(progressData);
      
      if (progressData.length > 0) {
        toast({
          title: "Progress Loaded! 📊",
          description: "Your learning data has been synchronized from the cloud.",
        });
      }
    } catch (error) {
      console.error('Error loading progress:', error);
      toast({
        title: "Using Local Data",
        description: "Progress data loaded from local storage.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Safety checks for arrays and properties
  const achievements = progress.achievements || [];
  const subjects = profile.subjects || [];
  const currentStreak = progress.currentStreak || 0;
  const totalLessons = progress.totalLessons || 0;
  const completedLessons = progress.completedLessons || 0;

  const progressPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;
  
  // Calculate total lessons from Supabase data
  const totalSupabaseLessons = supabaseProgress.reduce((total, item) => total + (item.lessons_completed || 0), 0);
  const effectiveCompletedLessons = Math.max(completedLessons, totalSupabaseLessons || 0);

  const getCulturalColors = (culture: string) => {
    const colorMap: Record<string, { primary: string; secondary: string; accent: string }> = {
      tamil: { primary: 'from-red-500 to-orange-600', secondary: 'bg-red-50', accent: 'text-red-800' },
      hindi: { primary: 'from-orange-500 to-amber-600', secondary: 'bg-orange-50', accent: 'text-orange-800' },
      bengali: { primary: 'from-red-600 to-pink-600', secondary: 'bg-red-50', accent: 'text-red-800' },
      telugu: { primary: 'from-yellow-500 to-orange-600', secondary: 'bg-yellow-50', accent: 'text-yellow-800' },
      marathi: { primary: 'from-orange-600 to-red-600', secondary: 'bg-orange-50', accent: 'text-orange-800' },
      kannada: { primary: 'from-yellow-600 to-red-600', secondary: 'bg-yellow-50', accent: 'text-yellow-800' },
      gujarati: { primary: 'from-blue-500 to-green-600', secondary: 'bg-blue-50', accent: 'text-blue-800' },
      punjabi: { primary: 'from-orange-500 to-red-600', secondary: 'bg-orange-50', accent: 'text-orange-800' }
    };
    return colorMap[culture] || colorMap.hindi;
  };

  const colors = getCulturalColors(profile.culture || 'hindi');

  const recommendations = [
    {
      title: "Classical Literature",
      description: "Explore ancient texts and literary traditions",
      icon: "📚",
      url: "https://www.murtylibrary.com/?utm_source=chatgpt.com"
    },
    {
      title: "Tamil Heritage Stories",
      description: "Discover rich Tamil cultural narratives",
      icon: "🏛️",
      url: "https://www.amarchitrakatha.com/history_details/the-story-of-tamil-nadu/?utm_source=chatgpt.com"
    },
    {
      title: "Mathematical Concepts in Indian Art",
      description: "Learn about mathematical patterns in traditional art",
      icon: "🎨",
      url: "https://thinkingwithchildren.com/2019/07/15/mathematical-art-kolam/?utm_source=chatgpt.com"
    },
    {
      title: "Science in Ancient India",
      description: "Explore scientific achievements of ancient India",
      icon: "🔬",
      url: "https://vajiramandravi.com/upsc-exam/science-and-technology-in-ancient-india/?utm_source=chatgpt.com"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
                ← Back to Home
              </Button>
              <Button 
                onClick={() => window.location.href = '/'} 
                variant="ghost" 
                className="text-white hover:bg-white/20"
              >
                🏠 Main Home
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {(profile.culture || 'indian').charAt(0).toUpperCase() + (profile.culture || 'indian').slice(1)} Culture
              </Badge>
              {onLogout && (
                <LogoutButton 
                  onLogout={onLogout}
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/20 border-white/30"
                  showIcon={false}
                />
              )}
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Your Learning Journey, {profile.name || 'Student'}! 🎉
          </h1>
          <p className="text-lg opacity-90 mb-4">
            Track your progress through {profile.culture || 'indian'} cultural stories
          </p>
          <div className="flex gap-3">
            <Button 
              onClick={onStartLearning || (() => window.location.href = '/')} 
              className="bg-white text-orange-600 hover:bg-orange-50 font-semibold"
            >
              🚀 Start Learning
            </Button>
            <Button 
              variant="outline" 
              className="border-white text-white hover:bg-white/20"
            >
              📊 View Progress
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Profile Summary */}
        <Card className="mb-8 border-2 border-orange-200 shadow-lg">
          <CardHeader className={`${colors.secondary} border-b-2 border-orange-200`}>
            <CardTitle className={`text-2xl ${colors.accent}`}>Your Learning Profile</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center">
                  <Globe className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Culture</h3>
                <p className="text-sm text-gray-600">{(profile.culture || 'indian').charAt(0).toUpperCase() + (profile.culture || 'indian').slice(1)}</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Subjects</h3>
                <p className="text-sm text-gray-600">{subjects.length} selected</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
                  <Award className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-semibold text-gray-800">Level</h3>
                <p className="text-sm text-gray-600">{(profile.level || 'beginner').charAt(0).toUpperCase() + (profile.level || 'beginner').slice(1)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Progress Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-green-200 bg-green-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-green-800">Lessons Completed</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                {effectiveCompletedLessons}
              </div>
              <p className="text-green-700">out of {totalLessons}</p>
              <Progress value={progressPercentage} className="mt-4 h-3" />
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-orange-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-orange-800">Current Streak</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">
                {currentStreak}
              </div>
              <p className="text-orange-700">days learning</p>
              <div className="mt-4 text-2xl">
                {currentStreak >= 7 ? '🔥' : currentStreak >= 3 ? '⭐' : '🌱'}
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-purple-50">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-purple-800">Achievements</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {achievements.length}
              </div>
              <p className="text-purple-700">badges earned</p>
              <div className="mt-4 text-2xl">🏆</div>
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        {achievements.length > 0 && (
          <Card className="mb-8 border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center gap-2">
                <Award className="w-6 h-6" />
                Your Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {achievements.map((achievement, index) => (
                  <Badge key={index} variant="outline" className="text-yellow-800 border-yellow-400 bg-yellow-100 px-3 py-1">
                    🏆 {achievement}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recommended Resources */}
        <Card className="border-2 border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="text-blue-800 flex items-center gap-2">
              <BookText className="w-6 h-6" />
              Recommended Resources
            </CardTitle>
            <p className="text-blue-600">Continue learning with these curated resources</p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((resource, index) => (
                <div key={index} className="p-4 border-2 border-blue-200 rounded-lg bg-white hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">{resource.icon}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 mb-1">{resource.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{resource.description}</p>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-blue-600 border-blue-300 hover:bg-blue-50"
                        onClick={() => window.open(resource.url, '_blank')}
                      >
                        Explore →
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Section */}
      <div className="bg-gradient-to-r from-orange-100 to-red-100 border-t-2 border-orange-200">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button 
              onClick={onStartLearning || (() => window.location.href = '/')} 
              size="lg"
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-3 font-semibold"
            >
              🚀 Start Learning Journey
            </Button>
            <Button 
              onClick={onBack} 
              variant="outline" 
              size="lg"
              className="border-orange-300 text-orange-600 hover:bg-orange-50 px-8 py-3 font-semibold"
            >
              ← Back to Setup
            </Button>
            {onLogout && (
              <LogoutButton 
                onLogout={onLogout}
                variant="outline"
                size="lg"
                className="border-red-300 text-red-600 hover:bg-red-50 px-8 py-3 font-semibold"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressDashboard;
