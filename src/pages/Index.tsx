import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserProfile } from './Index';
import ProfileSetup from '@/components/ProfileSetup';
import ProgressDashboard from '@/components/ProgressDashboard';
import StoryExperience from '@/components/StoryExperience';
import LogoutButton from '@/components/LogoutButton';
import { BookOpen, Sparkles, Users, Trophy, LogOut, BookText, Globe, Rocket, Zap, Target, Star, Award } from 'lucide-react';
import { getUserProgress } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import ThemeToggle from '@/components/ThemeToggle';

export interface UserProfile {
  name: string;
  culture: string;
  subjects: string[];
  subtopics: Record<string, string[]>;
  customTopics: Record<string, string[]>;
  level: string;
}

export interface UserProgress {
  completedLessons: number;
  totalLessons: number;
  currentStreak: number;
  achievements: string[];
}

const Index: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'setup' | 'dashboard' | 'story'>('home');
  const [selectedStory, setSelectedStory] = useState<{ subject: string; topic: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Dynamic language titles
  const languageTitles = [
    { text: 'कहानी गुरु', lang: 'Hindi' },
    { text: 'கதை குரு', lang: 'Tamil' },
    { text: 'কাহিনী গুরু', lang: 'Bengali' },
    { text: 'కథ గురు', lang: 'Telugu' },
    { text: 'कहाणी गुरू', lang: 'Marathi' },
    { text: 'ಕಥೆ ಗುರು', lang: 'Kannada' },
    { text: 'વાર્તા ગુરુ', lang: 'Gujarati' },
    { text: 'ਕਹਾਣੀ ਗੁਰੂ', lang: 'Punjabi' }
  ];

  // Dynamic cultural quotes with movie dialogues
  const culturalQuotes = [
    {
      text: "विद्या ददाति विनयम्",
      translation: "Knowledge bestows humility",
      attribution: "Sanskrit Proverb",
      language: "Sanskrit"
    },
    {
      text: "कल हो ना हो... पर उससे पहले सीख लो!",
      translation: "Tomorrow may or may not come... but learn before that!",
      attribution: "Inspired by 'Kal Ho Naa Ho'",
      language: "Hindi"
    },
    {
      text: "தமிழ் கற்றுக்கொள், உன்னை நீ கண்டுபிடி",
      translation: "Learn Tamil, discover yourself",
      attribution: "Tamil Cultural Saying",
      language: "Tamil"
    },
    {
      text: "জ্ঞানই শক্তি, শিক্ষাই মুক্তি",
      translation: "Knowledge is power, education is liberation",
      attribution: "Bengali Proverb",
      language: "Bengali"
    },
    {
      text: "डर के आगे जीत है... knowledge के आगे success है!",
      translation: "Victory lies beyond fear... success lies beyond knowledge!",
      attribution: "Inspired by 'Dangal'",
      language: "Hindi"
    },
    {
      text: "విద్య వినయం, వినయం వేదనం",
      translation: "Education brings humility, humility brings wisdom",
      attribution: "Telugu Saying",
      language: "Telugu"
    },
    {
      text: "शिक्षा सबसे बड़ा धन है",
      translation: "Education is the greatest wealth",
      attribution: "Marathi Proverb",
      language: "Marathi"
    },
    {
      text: "All the best... लेकिन पहले पढ़ाई complete करो!",
      translation: "All the best... but first complete your studies!",
      attribution: "Inspired by '3 Idiots'",
      language: "Hindi"
    },
    {
      text: "ಶಿಕ್ಷಣ ಅತ್ಯುತ್ತಮ ಆಭರಣ",
      translation: "Education is the finest ornament",
      attribution: "Kannada Proverb",
      language: "Kannada"
    },
    {
      text: "વિદ્યા વિના માણસ પશુ સમાન",
      translation: "Without education, a person is like an animal",
      attribution: "Gujarati Saying",
      language: "Gujarati"
    },
    {
      text: "ਪੜ੍ਹੋ ਤੇ ਅੱਗੇ ਵਧੋ",
      translation: "Study and move forward",
      attribution: "Punjabi Proverb",
      language: "Punjabi"
    },
    {
      text: "Zindagi mein teen cheez important hai... marks, marks, aur marks!",
      translation: "Three things are important in life... marks, marks, and marks!",
      attribution: "Inspired by '3 Idiots' (with a twist)",
      language: "Hindi"
    }
  ];

  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTitleIndex((prev) => (prev + 1) % languageTitles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuoteIndex((prev) => (prev + 1) % culturalQuotes.length);
    }, 5000);
    return () => clearInterval(quoteInterval);
  }, []);

  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      try {
        const parsedProfile = JSON.parse(savedProfile);
        setProfile(parsedProfile);
        setCurrentView('dashboard');
        loadProgress(parsedProfile.name);
      } catch (error) {
        console.error('Error parsing saved profile:', error);
        localStorage.removeItem('userProfile');
        setCurrentView('home');
      }
    } else {
      setCurrentView('home');
    }
  }, []);

  const loadProgress = async (userId: string) => {
    setIsLoading(true);
    try {
      const userProgress = await getUserProgress(userId);
      setProgress(userProgress);
    } catch (error) {
      console.error('Error loading progress:', error);
      toast({
        title: "Progress Loading",
        description: "Using local progress data.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileComplete = (userProfile: UserProfile) => {
    setProfile(userProfile);
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    setCurrentView('dashboard');
    loadProgress(userProfile.name);
    
    toast({
      title: "Profile Created! ✨",
      description: "Welcome to your cultural learning journey!",
    });
  };

  const handleStoryStart = (subject: string, topic: string) => {
    setSelectedStory({ subject, topic });
    setCurrentView('story');
  };

  const handleLessonComplete = () => {
    setCurrentView('dashboard');
    if (profile) {
      loadProgress(profile.name);
    }
    
    toast({
      title: "Lesson Completed! 🎉",
      description: "Great job! Your progress has been saved.",
    });
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedStory(null);
  };

  const handleLogout = () => {
    setProfile(null);
    setProgress([]);
    setCurrentView('home');
    setSelectedStory(null);
    
    toast({
      title: "Session Reset! 🔄",
      description: "You've been logged out. Welcome back!",
    });
  };

  console.log('Current view:', currentView, 'Profile:', profile);

  if (currentView === 'setup') {
    console.log('Rendering ProfileSetup component');
    return <ProfileSetup onComplete={handleProfileComplete} onBack={() => setCurrentView('home')} />;
  }

  if (currentView === 'story' && profile) {
    console.log('Rendering StoryExperience component');
    return (
      <StoryExperience 
        profile={profile} 
        onLessonComplete={handleLessonComplete}
        onBack={() => setCurrentView('dashboard')}
        onLogout={handleLogout}
      />
    );
  }

  if (currentView === 'dashboard' && profile) {
    console.log('Rendering ProgressDashboard component');
    // Create default progress if none exists
    const defaultProgress: UserProgress = {
      completedLessons: 0,
      totalLessons: 12,
      currentStreak: 0,
      achievements: []
    };
    
    const currentProgress = progress[0] || defaultProgress;
    
    return (
      <ProgressDashboard 
        profile={profile} 
        progress={currentProgress}
        onBack={() => setCurrentView('setup')}
        onLogout={handleLogout}
        onStartLearning={() => setCurrentView('story')}
      />
    );
  }

  console.log('Rendering home page');

  const currentQuote = culturalQuotes[currentQuoteIndex];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-orange-200 dark:bg-orange-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-200 dark:bg-red-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-yellow-200 dark:bg-yellow-800 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Header with Theme Toggle and Logout */}
      <div className="relative z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-orange-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                Cultural AI Tutor
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <ThemeToggle />
              {profile && (
                <LogoutButton 
                  onLogout={handleLogout}
                  variant="outline"
                  size="sm"
                  className="border-orange-300 text-orange-600 hover:bg-orange-50"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 relative z-10">
        {/* Enhanced Welcome Section */}
        {profile && (
          <Card 
            className="mb-8 border-4 border-gradient-to-r from-orange-400 to-red-400 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-gray-800 dark:to-gray-700 cursor-pointer hover:shadow-2xl transition-all duration-500 hover:border-orange-400 hover:scale-105 transform animate-fade-in group"
            onClick={() => setCurrentView('story')}
          >
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h2 className="text-3xl font-black text-orange-800 dark:text-orange-300 mb-3 flex items-center gap-3">
                    <Rocket className="w-8 h-8 text-red-500 animate-bounce" />
                    Welcome back, {profile.name}! 🙏
                    <Zap className="w-8 h-8 text-yellow-500 animate-pulse" />
                  </h2>
                  <p className="text-xl text-orange-600 dark:text-orange-400 font-semibold mb-3">
                    🚀 Continue your epic journey through {profile.culture} culture! 🎯
                  </p>
                  <div className="bg-gradient-to-r from-green-400/20 to-blue-400/20 rounded-lg p-4 border-2 border-green-300 dark:border-green-600">
                    <p className="text-lg text-green-700 dark:text-green-300 font-bold animate-pulse flex items-center gap-2">
                      <Target className="w-5 h-5" />
                      Click here to UNLEASH your potential! ⚡
                    </p>
                  </div>
                </div>
                <div className="flex flex-col gap-3">
                  <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200 text-lg px-4 py-2 font-bold">
                    🏛️ {profile.culture}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Supercharged Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-4 border-orange-200 dark:border-orange-700 hover:border-orange-400 hover:scale-110 transform bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-800 dark:to-gray-700 group animate-fade-in">
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                <BookText className="w-10 h-10 text-white animate-pulse" />
              </div>
              <CardTitle className="text-orange-800 dark:text-orange-300 text-xl font-black">📚 Cultural Stories</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                🔥 Learn through EPIC stories from your cultural heritage! 🎭
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-4 border-blue-200 dark:border-blue-700 hover:border-blue-400 hover:scale-110 transform bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-700 group animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-400 to-indigo-500 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                <Users className="w-10 h-10 text-white animate-pulse" />
              </div>
              <CardTitle className="text-blue-800 dark:text-blue-300 text-xl font-black">🧠 Multi-Subject Mastery</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                ⚡ Math, Science, History, Literature - ALL IN ONE! 🚀
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-4 border-green-200 dark:border-green-700 hover:border-green-400 hover:scale-110 transform bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-700 group animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                <Globe className="w-10 h-10 text-white animate-pulse" />
              </div>
              <CardTitle className="text-green-800 dark:text-green-300 text-xl font-black">🌍 All Indian Languages</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                🎯 Tamil, Hindi, Bengali, and MANY MORE! 🗣️
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-2xl transition-all duration-500 cursor-pointer border-4 border-purple-200 dark:border-purple-700 hover:border-purple-400 hover:scale-110 transform bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-800 dark:to-gray-700 group animate-fade-in" style={{ animationDelay: '0.3s' }}>
            <CardHeader className="text-center pb-4">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center transition-transform group-hover:rotate-12 group-hover:scale-110 shadow-lg">
                <Award className="w-10 h-10 text-white animate-pulse" />
              </div>
              <CardTitle className="text-purple-800 dark:text-purple-300 text-xl font-black">🏆 Progress Tracking</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
                📈 Track your journey and CELEBRATE achievements! 🎉
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Electrifying Action Buttons */}
        <div className="text-center space-y-6">
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            {!profile ? (
              <Button 
                onClick={() => {
                  console.log('Starting journey - setting view to setup');
                  setCurrentView('setup');
                }}
                size="lg"
                className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-black rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-orange-500/50 animate-pulse border-4 border-yellow-300"
              >
                🚀 START YOUR EPIC JOURNEY! ✨
              </Button>
            ) : (
              <>
                <Button 
                  onClick={() => setCurrentView('story')}
                  size="lg"
                  className="bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white px-12 py-6 text-xl font-black rounded-2xl shadow-2xl transform transition-all duration-300 hover:scale-110 hover:shadow-orange-500/50 border-4 border-yellow-300 animate-pulse"
                >
                  ⚡ CONTINUE DOMINATING! 📚
                </Button>
                <Button 
                  onClick={() => setCurrentView('dashboard')}
                  size="lg"
                  variant="outline"
                  className="border-4 border-orange-400 text-orange-600 dark:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-900/20 px-12 py-6 text-xl font-black rounded-2xl transform transition-all duration-300 hover:scale-110 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm"
                >
                  📊 VIEW YOUR PROGRESS! 🏆
                </Button>
              </>
            )}
          </div>
          
          {profile && (
            <Button 
              onClick={() => setCurrentView('setup')}
              variant="ghost"
              className="text-orange-600 dark:text-orange-400 hover:text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 text-lg font-bold"
            >
              ⚙️ Update Profile Settings
            </Button>
          )}
        </div>

        {/* Enhanced Cultural Quotes Section */}
        <div className="mt-20 text-center">
          <Card className="bg-gradient-to-r from-amber-50 via-orange-50 to-yellow-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 border-4 border-amber-300 dark:border-amber-600 transition-all duration-1000 shadow-2xl hover:shadow-amber-500/30 transform hover:scale-105">
            <CardContent className="p-12">
              <div className="transition-all duration-1000 ease-in-out">
                <div className="flex justify-center mb-6">
                  <Star className="w-12 h-12 text-amber-500 animate-spin" style={{ animationDuration: '4s' }} />
                </div>
                <blockquote className="text-2xl md:text-4xl font-black text-amber-800 dark:text-amber-300 mb-6 leading-tight">
                  "{currentQuote.text}"
                </blockquote>
                <p className="text-amber-700 dark:text-amber-400 text-xl md:text-2xl mb-4 font-bold">
                  {currentQuote.translation}
                </p>
                <p className="text-amber-600 dark:text-amber-500 text-lg font-semibold">
                  — {currentQuote.attribution}
                </p>
                <Badge variant="outline" className="mt-4 text-amber-700 dark:text-amber-300 border-amber-400 dark:border-amber-500 text-lg px-6 py-2 font-bold">
                  🏛️ {currentQuote.language}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
