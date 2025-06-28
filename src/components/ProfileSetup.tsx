import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { UserProfile } from '@/pages/Index';
import { ArrowLeft, User, Globe, BookOpen, GraduationCap, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { createUser } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { getSubtopics, getSubtopicName } from '@/data/subtopics';

interface ProfileSetupProps {
  onComplete: (profile: UserProfile) => void;
  onBack: () => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ onComplete, onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    culture: '',
    subjects: [] as string[],
    subtopics: {} as Record<string, string[]>,
    customTopics: {} as Record<string, string[]>,
    level: ''
  });
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(new Set());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const cultures = [
    'tamil', 'hindi', 'bengali', 'telugu', 'marathi', 
    'kannada', 'gujarati', 'punjabi', 'malayalam', 'odia'
  ];

  const subjects = ['math', 'science', 'history', 'literature'];
  const levels = ['elementary', 'middle school', 'high school'];

  const handleSubjectToggle = (subject: string) => {
    setFormData(prev => {
      const newSubjects = prev.subjects.includes(subject) 
        ? prev.subjects.filter(s => s !== subject)
        : [...prev.subjects, subject];
      
      // Remove subtopics for deselected subjects
      const newSubtopics = { ...prev.subtopics };
      if (!newSubjects.includes(subject)) {
        delete newSubtopics[subject];
      }
      
      return {
        ...prev,
        subjects: newSubjects,
        subtopics: newSubtopics
      };
    });
  };

  const handleSubtopicToggle = (subject: string, subtopic: string) => {
    setFormData(prev => ({
      ...prev,
      subtopics: {
        ...prev.subtopics,
        [subject]: prev.subtopics[subject]?.includes(subtopic)
          ? prev.subtopics[subject].filter(s => s !== subtopic)
          : [...(prev.subtopics[subject] || []), subtopic]
      }
    }));
  };

  const handleCustomTopicAdd = (subject: string, topic: string) => {
    if (topic.trim()) {
      setFormData(prev => ({
        ...prev,
        customTopics: {
          ...prev.customTopics,
          [subject]: [...(prev.customTopics[subject] || []), topic.trim()]
        }
      }));
    }
  };

  const handleCustomTopicRemove = (subject: string, topic: string) => {
    setFormData(prev => ({
      ...prev,
      customTopics: {
        ...prev.customTopics,
        [subject]: prev.customTopics[subject]?.filter(t => t !== topic) || []
      }
    }));
  };

  const toggleSubjectExpansion = (subject: string) => {
    setExpandedSubjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(subject)) {
        newSet.delete(subject);
      } else {
        newSet.add(subject);
      }
      return newSet;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.culture && formData.subjects.length > 0 && formData.level) {
      
      setIsSubmitting(true);
      
      try {
        // Create user in Supabase
        const userData = {
          name: formData.name,
          culture: formData.culture,
          subjects: formData.subjects,
          subtopics: formData.subtopics,
          customTopics: formData.customTopics,
          level: formData.level
        };

        const createdUser = await createUser(userData);
        
        if (createdUser) {
          // Convert to UserProfile format for the app
          const profile: UserProfile = {
            name: createdUser.name,
            culture: createdUser.culture,
            subjects: createdUser.subjects,
            subtopics: createdUser.subtopics || {},
            level: createdUser.level
          };

          toast({
            title: "Profile Created Successfully! 🎉",
            description: `Welcome to your ${profile.culture} cultural learning journey!`,
          });

          onComplete(profile);
        } else {
          // Fallback to local storage if Supabase fails
          const profile: UserProfile = {
            name: formData.name,
            culture: formData.culture,
            subjects: formData.subjects,
            subtopics: formData.subtopics,
            customTopics: formData.customTopics,
            level: formData.level
          };

          toast({
            title: "Profile Created! 🎉",
            description: "Using local storage for data persistence.",
          });

          onComplete(profile);
        }
      } catch (error) {
        console.error('Error creating profile:', error);
        toast({
          title: "Profile Created! 🎉",
          description: "Using local storage for data persistence.",
        });

        // Fallback to local storage
        const profile: UserProfile = {
          name: formData.name,
          culture: formData.culture,
          subjects: formData.subjects,
          subtopics: formData.subtopics,
          customTopics: formData.customTopics,
          level: formData.level
        };

        onComplete(profile);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

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

  const colors = getCulturalColors(formData.culture);

  const isFormValid = formData.name && formData.culture && formData.subjects.length > 0 && formData.level;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.primary} text-white p-6`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button 
              onClick={onBack} 
              variant="ghost" 
              className="text-white hover:bg-white/20 flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Button>
            <Badge variant="secondary" className="bg-white/20 text-white">
              Profile Setup
            </Badge>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Create Your Learning Profile 🎯
          </h1>
          <p className="text-lg opacity-90">
            Tell us about yourself to get personalized cultural stories
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Card className="max-w-4xl mx-auto border-2 border-orange-200 shadow-lg">
          <CardHeader className={`${colors.secondary} border-b-2 border-orange-200`}>
            <CardTitle className={`text-2xl ${colors.accent} flex items-center gap-2`}>
              <User className="w-6 h-6" />
              Let's Get Started!
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Name Input */}
              <div className="space-y-3">
                <Label htmlFor="name" className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <User className="w-5 h-5" />
                  What's your name?
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="text-lg p-4 border-2 border-gray-200 focus:border-orange-400 rounded-xl"
                />
              </div>

              {/* Culture Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  Which Indian culture would you like to explore?
                </Label>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                  {cultures.map((culture) => (
                    <Button
                      key={culture}
                      type="button"
                      variant={formData.culture === culture ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, culture }))}
                      className={`p-4 text-center rounded-xl transition-all ${
                        formData.culture === culture 
                          ? `bg-gradient-to-r ${colors.primary} text-white` 
                          : 'border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {culture.charAt(0).toUpperCase() + culture.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Level Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  What's your learning level?
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {levels.map((level) => (
                    <Button
                      key={level}
                      type="button"
                      variant={formData.level === level ? "default" : "outline"}
                      onClick={() => setFormData(prev => ({ ...prev, level }))}
                      className={`p-4 text-center rounded-xl transition-all ${
                        formData.level === level 
                          ? `bg-gradient-to-r ${colors.primary} text-white` 
                          : 'border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                      }`}
                    >
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Subject and Subtopic Selection */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  What subjects and topics interest you?
                </Label>
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject} className="border-2 border-gray-200 rounded-xl p-4">
                      <Button
                        type="button"
                        variant={formData.subjects.includes(subject) ? "default" : "outline"}
                        onClick={() => handleSubjectToggle(subject)}
                        className={`w-full justify-between p-4 text-left rounded-xl transition-all ${
                          formData.subjects.includes(subject) 
                            ? `bg-gradient-to-r ${colors.primary} text-white` 
                            : 'border-2 border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                        }`}
                      >
                        <span className="text-lg font-semibold">
                          {subject.charAt(0).toUpperCase() + subject.slice(1)}
                        </span>
                        {formData.subjects.includes(subject) && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="bg-white/20 text-white">
                              {formData.subtopics[subject]?.length || 0} topics
                            </Badge>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSubjectExpansion(subject);
                              }}
                              className="text-white hover:bg-white/20"
                            >
                              {expandedSubjects.has(subject) ? (
                                <ChevronUp className="w-4 h-4" />
                              ) : (
                                <ChevronDown className="w-4 h-4" />
                              )}
                            </Button>
                          </div>
                        )}
                      </Button>
                      
                      {formData.subjects.includes(subject) && expandedSubjects.has(subject) && formData.level && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <Label className="text-md font-semibold text-gray-700 mb-3 block">
                            Select specific topics in {subject.charAt(0).toUpperCase() + subject.slice(1)}:
                          </Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                            {getSubtopics(subject, formData.level).map((subtopic) => (
                              <Button
                                key={subtopic}
                                type="button"
                                variant={formData.subtopics[subject]?.includes(subtopic) ? "default" : "outline"}
                                onClick={() => handleSubtopicToggle(subject, subtopic)}
                                size="sm"
                                className={`text-sm p-2 h-auto ${
                                  formData.subtopics[subject]?.includes(subtopic)
                                    ? `bg-gradient-to-r ${colors.primary} text-white`
                                    : 'border border-gray-300 hover:border-orange-300 hover:bg-orange-50'
                                }`}
                              >
                                {getSubtopicName(subtopic)}
                              </Button>
                            ))}
                          </div>
                          {formData.subtopics[subject]?.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-3">
                              {formData.subtopics[subject].map((subtopic) => (
                                <Badge key={subtopic} variant="secondary" className="bg-green-100 text-green-800">
                                  ✓ {getSubtopicName(subtopic)}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Topics Section */}
              <div className="space-y-4">
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Add Custom Topics (Optional)
                </Label>
                <p className="text-gray-600 text-sm">
                  Type your own topics that you'd like to learn about in each subject
                </p>
                <div className="space-y-4">
                  {subjects.map((subject) => (
                    <div key={subject} className="border-2 border-gray-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <Label className="text-md font-semibold text-gray-700">
                          {subject.charAt(0).toUpperCase() + subject.slice(1)} Custom Topics
                        </Label>
                        <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                          {formData.customTopics[subject]?.length || 0} custom
                        </Badge>
                      </div>
                      
                      {/* Custom Topic Input */}
                      <div className="flex gap-2 mb-3">
                        <Input
                          type="text"
                          placeholder={`Enter a custom ${subject} topic...`}
                          className="flex-1"
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              const input = e.target as HTMLInputElement;
                              handleCustomTopicAdd(subject, input.value);
                              input.value = '';
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={(e) => {
                            const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                            handleCustomTopicAdd(subject, input.value);
                            input.value = '';
                          }}
                          className="px-4"
                        >
                          Add
                        </Button>
                      </div>
                      
                      {/* Display Custom Topics */}
                      {formData.customTopics[subject]?.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {formData.customTopics[subject].map((topic, index) => (
                            <Badge 
                              key={index} 
                              variant="secondary" 
                              className="bg-blue-100 text-blue-800 cursor-pointer hover:bg-blue-200"
                              onClick={() => handleCustomTopicRemove(subject, topic)}
                            >
                              ✕ {topic}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  size="lg"
                  className={`w-full text-lg font-semibold py-4 rounded-xl transition-all ${
                    isFormValid && !isSubmitting
                      ? `bg-gradient-to-r ${colors.primary} hover:opacity-90 text-white shadow-lg` 
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating Your Profile...
                    </>
                  ) : isFormValid ? (
                    'Start My Cultural Learning Journey! 🚀'
                  ) : (
                    'Please complete all fields'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileSetup;
