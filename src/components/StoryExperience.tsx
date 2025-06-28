import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { UserProfile } from '@/pages/Index';
import { storyBank } from '@/data/storyBank';
import { getSubtopicName } from '@/data/subtopics';
import QuestionPrompt from '@/components/QuestionPrompt';
import ChatInterface from '@/components/ChatInterface';
import LogoutButton from '@/components/LogoutButton';
import { ArrowUp, Loader2, Sparkles, MessageCircle, BookOpen, Brain, History, Lightbulb, Globe } from 'lucide-react';
import { getStory, updateProgress } from '@/lib/api';
import { generateStory, enhanceStory } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import { cleanMarkdown } from '@/lib/utils';
import VoiceStorytelling from './VoiceStorytelling';
import MathFormulaDisplay from './MathFormulaDisplay';

interface StoryExperienceProps {
  profile: UserProfile;
  onLessonComplete: () => void;
  onBack: () => void;
  onLogout?: () => void;
}

interface StorySegment {
  subject: string;
  title: string;
  content: string;
  concept: string;
  questions: {
    multipleChoice: {
      question: string;
      options: string[];
      correct: number;
    };
    openEnded: {
      question: string;
      sampleAnswer: string;
    };
  };
  feedback: {
    correct: string;
    encouragement: string;
  };
}

const StoryExperience: React.FC<StoryExperienceProps> = ({ profile, onLessonComplete, onBack, onLogout }) => {
  const [currentSegment, setCurrentSegment] = useState(0);
  const [showQuestions, setShowQuestions] = useState(false);
  const [completedQuestions, setCompletedQuestions] = useState<Set<number>>(new Set());
  const [storyData, setStoryData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const { toast } = useToast();

  // Get cultural expressions and language hooks
  const getCulturalExpressions = (culture: string) => {
    const expressions: Record<string, { greeting: string; excitement: string; wisdom: string; encouragement: string }> = {
      tamil: {
        greeting: "வணக்கம்! (Vanakkam!)",
        excitement: "அருமை! (Arumai!)",
        wisdom: "ஞானம் (Gnanam)",
        encouragement: "நன்றாக செய்கிறாய்! (Nandraga seykiray!)"
      },
      hindi: {
        greeting: "नमस्ते! (Namaste!)",
        excitement: "बहुत बढ़िया! (Bahut badhiya!)",
        wisdom: "ज्ञान (Gyan)",
        encouragement: "बहुत अच्छा! (Bahut accha!)"
      },
      bengali: {
        greeting: "নমস্কার! (Nomoskar!)",
        excitement: "খুব ভালো! (Khub bhalo!)",
        wisdom: "জ্ঞান (Gyan)",
        encouragement: "অসাধারণ! (Osadharon!)"
      },
      telugu: {
        greeting: "నమస్కారం! (Namaskaram!)",
        excitement: "చాలా బాగుంది! (Chala bagundi!)",
        wisdom: "జ్ఞానం (Gnanam)",
        encouragement: "చాలా మంచిది! (Chala manchidi!)"
      },
      marathi: {
        greeting: "नमस्कार! (Namaskar!)",
        excitement: "खूप छान! (Khoop chaan!)",
        wisdom: "ज्ञान (Gyan)",
        encouragement: "अतिशय चांगले! (Atishay changle!)"
      },
      kannada: {
        greeting: "ನಮಸ್ಕಾರ! (Namaskara!)",
        excitement: "ಚೆನ್ನಾಗಿದೆ! (Chennagide!)",
        wisdom: "ಜ್ಞಾನ (Gnyana)",
        encouragement: "ಅತ್ಯುತ್ತಮ! (Atyuttama!)"
      },
      gujarati: {
        greeting: "નમસ્તે! (Namaste!)",
        excitement: "ખૂબ સરસ! (Khoob saras!)",
        wisdom: "જ્ઞાન (Gyan)",
        encouragement: "બહુ સરસ! (Bahu saras!)"
      },
      punjabi: {
        greeting: "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! (Sat Sri Akal!)",
        excitement: "ਬਹੁਤ ਵਧੀਆ! (Bahut vadhia!)",
        wisdom: "ਗਿਆਨ (Gyan)",
        encouragement: "ਬਹੁਤ ਚੰਗਾ! (Bahut changa!)"
      },
      malayalam: {
        greeting: "നമസ്കാരം! (Namaskaram!)",
        excitement: "വളരെ നല്ലത്! (Valare nallath!)",
        wisdom: "ജ്ഞാനം (Gnanam)",
        encouragement: "അതിശയം! (Athishayam!)"
      },
      odia: {
        greeting: "ନମସ୍କାର! (Namaskar!)",
        excitement: "ବହୁତ ଭଲ! (Bahut bhala!)",
        wisdom: "ଜ୍ଞାନ (Gyan)",
        encouragement: "ଅତି ଭଲ! (Ati bhala!)"
      }
    };
    
    return expressions[culture] || {
      greeting: "Hello!",
      excitement: "Amazing!",
      wisdom: "Wisdom",
      encouragement: "Great job!"
    };
  };

  useEffect(() => {
    const loadStory = async () => {
      setIsLoading(true);
      try {
        // Get the first subject and its first subtopic for AI generation
        const firstSubject = profile.subjects[0] || 'math';
        
        // Prioritize custom topics over predefined subtopics
        const customTopics = profile.customTopics[firstSubject] || [];
        const predefinedSubtopics = profile.subtopics[firstSubject] || [];
        
        let firstSubtopic = 'cultural_learning';
        
        if (customTopics.length > 0) {
          // Use the first custom topic
          firstSubtopic = customTopics[0];
        } else if (predefinedSubtopics.length > 0) {
          // Use the first predefined subtopic
          firstSubtopic = predefinedSubtopics[0];
        }
        
        // Generate comprehensive learning segments for the subtopic
        const learningSegments = await generateComprehensiveLearningSegments(
          profile.culture,
          firstSubject,
          firstSubtopic
        );

        // Create story data structure with multiple segments
        setStoryData({
          title: `${profile.culture.charAt(0).toUpperCase() + profile.culture.slice(1)} Cultural Learning Journey`,
          description: `Master ${firstSubtopic} through ${profile.culture} cultural wisdom`,
          culturalQuote: {
            text: `Learning ${firstSubtopic} through ${profile.culture} traditions`,
            attribution: `${profile.culture.charAt(0).toUpperCase() + profile.culture.slice(1)} Wisdom`
          },
          segments: learningSegments
        });

      } catch (error) {
        console.error('Error generating learning segments:', error);
        
        // Fallback to local story bank if AI fails
    const story = storyBank[profile.culture as keyof typeof storyBank];
    if (story) {
      const filteredSegments = story.segments.filter((segment: StorySegment) => 
        profile.subjects.includes(segment.subject)
      );
          if (filteredSegments.length > 0) {
      setStoryData({
        ...story,
        segments: filteredSegments
      });
          } else {
            // Create comprehensive fallback segments
            const firstSubject = profile.subjects[0] || 'math';
            
            // Prioritize custom topics over predefined subtopics
            const customTopics = profile.customTopics[firstSubject] || [];
            const predefinedSubtopics = profile.subtopics[firstSubject] || [];
            
            let firstSubtopic = 'cultural_learning';
            
            if (customTopics.length > 0) {
              firstSubtopic = customTopics[0];
            } else if (predefinedSubtopics.length > 0) {
              firstSubtopic = predefinedSubtopics[0];
            }
            
            const fallbackSegments = createComprehensiveFallbackSegments(
              profile.culture,
              firstSubject,
              firstSubtopic
            );
            setStoryData({
              title: `${profile.culture.charAt(0).toUpperCase() + profile.culture.slice(1)} Cultural Learning Journey`,
              description: `Master ${firstSubtopic} through ${profile.culture} cultural wisdom`,
              culturalQuote: {
                text: `Learning ${firstSubtopic} through ${profile.culture} traditions`,
                attribution: `${profile.culture.charAt(0).toUpperCase() + profile.culture.slice(1)} Wisdom`
              },
              segments: fallbackSegments
            });
          }
        } else {
          // Final fallback for unsupported cultures
          const firstSubject = profile.subjects[0] || 'math';
          
          // Prioritize custom topics over predefined subtopics
          const customTopics = profile.customTopics[firstSubject] || [];
          const predefinedSubtopics = profile.subtopics[firstSubject] || [];
          
          let firstSubtopic = 'cultural_learning';
          
          if (customTopics.length > 0) {
            firstSubtopic = customTopics[0];
          } else if (predefinedSubtopics.length > 0) {
            firstSubtopic = predefinedSubtopics[0];
          }
          
          const fallbackSegments = createComprehensiveFallbackSegments(
            profile.culture,
            firstSubject,
            firstSubtopic
          );
          setStoryData({
            title: `${profile.culture.charAt(0).toUpperCase() + profile.culture.slice(1)} Cultural Learning Journey`,
            description: `Master ${firstSubtopic} through ${profile.culture} cultural wisdom`,
            culturalQuote: {
              text: `Learning ${firstSubtopic} through ${profile.culture} traditions`,
              attribution: `${profile.culture.charAt(0).toUpperCase() + profile.culture.slice(1)} Wisdom`
            },
            segments: fallbackSegments
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadStory();
  }, [profile]);

  // Generate comprehensive learning segments for a subtopic
  const generateComprehensiveLearningSegments = async (
    culture: string,
    subject: string,
    subtopic: string
  ): Promise<StorySegment[]> => {
    const segments = [];
    // Use the topic name directly for custom topics, or get the formatted name for predefined topics
    const topicName = subtopic.includes('_') ? getSubtopicName(subtopic) : subtopic;
    const expressions = getCulturalExpressions(culture);

    // Segment 1: Introduction and Cultural Context
    const introStory = await generateStory({
      culture,
      subject,
      topic: `${subtopic}_introduction`
    });

    // Convert AI questions to expected format
    const introQuestions = introStory.questions || [];
    const introMcq = introQuestions[0];

    segments.push({
      subject,
      title: `Introduction to ${topicName}`,
      content: introStory.story,
      concept: `Understanding ${topicName} in ${culture} context`,
      questions: {
        multipleChoice: introMcq ? {
          question: cleanMarkdown(introMcq.text).replace(/advanced_poetry_introduction|_/g, topicName),
          options: introMcq.options.map(option => cleanMarkdown(option).replace(/advanced_poetry_introduction|_/g, topicName)),
          correct: introMcq.correctAnswer === 'A' ? 0 : 
                   introMcq.correctAnswer === 'B' ? 1 : 
                   introMcq.correctAnswer === 'C' ? 2 : 3
        } : {
          question: `What is the main concept of ${topicName}?`,
          options: ['A cultural tradition', 'A scientific principle', 'A historical event', 'A literary form'],
          correct: 1
        },
        openEnded: {
          question: `How does ${topicName} connect to ${culture} cultural practices?`,
          sampleAnswer: `${topicName} connects to ${culture} culture through traditional practices and daily life applications.`
        }
      },
      feedback: {
        correct: `Excellent! You understand that ${topicName} is both a scientific concept and a cultural practice.`,
        encouragement: `Great start! Keep exploring how ${topicName} appears in different aspects of ${culture} culture.`
      }
    });

    // Segment 2: Practical Applications
    segments.push({
      subject,
      title: `Practical Applications of ${topicName}`,
      content: `${expressions.excitement} 🌈 Did you know that ${topicName} is everywhere in ${culture} daily life? It's like a superpower that our ancestors used every day!

Think about it: when your grandma cooks that yummy ${culture} dish, she's using ${topicName}! When artists create beautiful patterns in traditional ${culture} art, they're using ${topicName}! Even when farmers plant crops in the perfect way, they're using ${topicName} secrets!

Our ${culture} ancestors were like superheroes who knew how to use ${topicName} to make life better and more beautiful. They didn't have fancy gadgets, but they had ${expressions.wisdom}! 🧠✨`,
      concept: `Real-world uses of ${topicName} in ${culture} traditions`,
      questions: {
        multipleChoice: {
          question: `Which of these is a practical application of ${topicName} in ${culture} culture?`,
          options: ['Traditional cooking', 'Festival celebrations', 'Art and crafts', 'All of the above'],
          correct: 3
        },
        openEnded: {
          question: `Can you think of another way ${topicName} might be used in ${culture} daily life?`,
          sampleAnswer: `${topicName} could be used in traditional medicine or agricultural practices.`
        }
      },
      feedback: {
        correct: `${expressions.encouragement} You've identified how ${topicName} is practically applied in ${culture} culture.`,
        encouragement: `Wonderful thinking! ${topicName} has many practical applications in traditional practices.`
      }
    });

    // Segment 3: Scientific Principles
    segments.push({
      subject,
      title: `Scientific Principles of ${topicName}`,
      content: `${expressions.excitement} 🔬 Now let's discover the science behind ${topicName}! It's like uncovering the secret recipe that makes everything work!

${subject === 'math' ? `In mathematics, ${topicName} follows special rules and formulas. For example, if we're learning about areas, we use: Area = Length × Width. If it's circles, we use: Area = π × radius². These formulas are like magic spells that help us solve problems!` : `The science behind ${topicName} is fascinating! Our ${culture} ancestors were like detectives who figured out how things work by observing nature carefully. They didn't have fancy laboratories, but they had curiosity and ${expressions.wisdom}!`}

Think of it like this: every time you see ${topicName} in action, you're watching science and culture work together like best friends! 🤝✨`,
      concept: `The science behind ${topicName} and its cultural significance`,
      questions: {
        multipleChoice: {
          question: `What scientific principle explains how ${topicName} works?`,
          options: ['Cultural tradition', 'Natural laws', 'Historical events', 'Literary devices'],
          correct: 1
        },
        openEnded: {
          question: `How do scientific principles of ${topicName} enhance our understanding of ${culture} traditions?`,
          sampleAnswer: `Understanding the science behind ${topicName} helps us appreciate the wisdom of ${culture} ancestors.`
        }
      },
      feedback: {
        correct: `${expressions.encouragement} You understand the scientific foundation of ${topicName}.`,
        encouragement: `Great insight! Science and culture work together to create meaningful traditions.`
      }
    });

    // Segment 4: Historical Significance
    const historicalStory = await generateStory({
      culture,
      subject,
      topic: `${subtopic}_historical_significance`
    });

    // Convert AI questions to expected format
    const historicalQuestions = historicalStory.questions || [];
    const historicalMcq = historicalQuestions[0];

    segments.push({
      subject,
      title: `Historical Significance of ${topicName}`,
      content: `${expressions.excitement} 🕰️ Let's travel back in time to see how ${topicName} shaped ${culture} history! It's like opening a magical history book!

Long, long ago, wise ${culture} scholars and craftspeople discovered ${topicName} secrets. They were like the first inventors and teachers! They used ${topicName} to build amazing temples, create beautiful art, and solve everyday problems.

These clever people passed their knowledge down through generations, like a precious family treasure. Today, we still use their discoveries! It's like having a conversation with our great-great-grandparents through the language of ${topicName}! 👴👵💫`,
      concept: `How ${topicName} shaped ${culture} history and traditions`,
      questions: {
        multipleChoice: historicalMcq ? {
          question: historicalMcq.text,
          options: historicalMcq.options,
          correct: historicalMcq.correctAnswer === 'A' ? 0 : 
                   historicalMcq.correctAnswer === 'B' ? 1 : 
                   historicalMcq.correctAnswer === 'C' ? 2 : 3
        } : {
          question: `How has ${topicName} influenced ${culture} cultural development?`,
          options: ['Through traditional practices', 'In historical events', 'In cultural celebrations', 'All of the above'],
          correct: 3
        },
        openEnded: {
          question: `What can we learn about ${culture} history through the study of ${topicName}?`,
          sampleAnswer: `We can learn about how ${culture} ancestors understood and applied ${topicName} principles.`
        }
      },
      feedback: {
        correct: `${expressions.encouragement} You understand the historical importance of ${topicName} in ${culture} culture.`,
        encouragement: `Excellent! History shows us how ${topicName} has been valued across generations.`
      }
    });

    // Segment 5: Modern Relevance
    segments.push({
      subject,
      title: `Modern Relevance of ${topicName}`,
      content: `${expressions.excitement} 🚀 Now let's see how ${topicName} is still super important today! It's like discovering that your favorite toy is actually a powerful tool!

Even in our modern world with computers and smartphones, ${topicName} is still everywhere! Scientists use ${topicName} principles to create new medicines, engineers use them to build amazing buildings, and artists use them to create digital masterpieces.

The best part? You can use ${topicName} too! Whether you're playing video games, cooking with your family, or creating art, you're using the same principles that ${culture} ancestors discovered. You're carrying on their legacy! 🌟✨`,
      concept: `How ${topicName} remains relevant in modern times`,
      questions: {
        multipleChoice: {
          question: `How is ${topicName} relevant in today's modern world?`,
          options: ['Only in traditional practices', 'In modern technology and science', 'Only in historical contexts', 'It\'s no longer relevant'],
          correct: 1
        },
        openEnded: {
          question: `How can you apply ${topicName} knowledge in your daily life?`,
          sampleAnswer: `I can use ${topicName} principles in my hobbies, school projects, and daily activities.`
        }
      },
      feedback: {
        correct: `${expressions.encouragement} You understand that ${topicName} is still valuable today.`,
        encouragement: `Wonderful! You're connecting ancient wisdom with modern applications.`
      }
    });

    return segments;
  };

  // Create comprehensive fallback segments when AI fails
  const createComprehensiveFallbackSegments = (
    culture: string,
    subject: string,
    subtopic: string
  ): StorySegment[] => {
    const topicName = getSubtopicName(subtopic);
    const segments = [];
    const expressions = getCulturalExpressions(culture);

    // Segment 1: Introduction
    segments.push({
      subject,
      title: `Introduction to ${topicName}`,
      content: `${expressions.greeting} Young explorer! 🌟 Welcome to the amazing world of ${topicName}! In ${culture} culture, ${topicName} is like a magical key that helps us understand the world around us. 

Imagine you're on a treasure hunt! Our ${culture} ancestors discovered ${topicName} secrets and used them in their daily adventures - from cooking delicious food to creating beautiful art and celebrating festivals. They were like the first scientists and artists! 

Today, we're going to discover how ${topicName} works and why it's so special in ${culture} traditions. Get ready for an exciting journey! 🚀`,
      concept: `Understanding ${topicName} in ${culture} context`,
      questions: {
        multipleChoice: {
          question: `What is ${topicName} in the context of ${culture} culture?`,
          options: ['A cultural tradition', 'A scientific principle', 'A historical event', 'A literary form'],
          correct: 1
        },
        openEnded: {
          question: `How does ${topicName} connect to ${culture} cultural practices?`,
          sampleAnswer: `${topicName} connects to ${culture} culture through traditional practices and daily life applications.`
        }
      },
      feedback: {
        correct: `${expressions.encouragement} You understand that ${topicName} is both a scientific concept and a cultural practice.`,
        encouragement: `Great start! Keep exploring how ${topicName} appears in different aspects of ${culture} culture.`
      }
    });

    // Segment 2: Practical Applications
    segments.push({
      subject,
      title: `Practical Applications of ${topicName}`,
      content: `${expressions.excitement} 🌈 Did you know that ${topicName} is everywhere in ${culture} daily life? It's like a superpower that our ancestors used every day!

Think about it: when your grandma cooks that yummy ${culture} dish, she's using ${topicName}! When artists create beautiful patterns in traditional ${culture} art, they're using ${topicName}! Even when farmers plant crops in the perfect way, they're using ${topicName} secrets!

Our ${culture} ancestors were like superheroes who knew how to use ${topicName} to make life better and more beautiful. They didn't have fancy gadgets, but they had ${expressions.wisdom}! 🧠✨`,
      concept: `Real-world uses of ${topicName} in ${culture} traditions`,
      questions: {
        multipleChoice: {
          question: `Which of these is a practical application of ${topicName} in ${culture} culture?`,
          options: ['Traditional cooking', 'Festival celebrations', 'Art and crafts', 'All of the above'],
          correct: 3
        },
        openEnded: {
          question: `Can you think of another way ${topicName} might be used in ${culture} daily life?`,
          sampleAnswer: `${topicName} could be used in traditional medicine or agricultural practices.`
        }
      },
      feedback: {
        correct: `${expressions.encouragement} You've identified how ${topicName} is practically applied in ${culture} culture.`,
        encouragement: `Wonderful thinking! ${topicName} has many practical applications in traditional practices.`
      }
    });

    // Segment 3: Scientific Principles
    segments.push({
      subject,
      title: `Scientific Principles of ${topicName}`,
      content: `${expressions.excitement} 🔬 Now let's discover the science behind ${topicName}! It's like uncovering the secret recipe that makes everything work!

${subject === 'math' ? `In mathematics, ${topicName} follows special rules and formulas. For example, if we're learning about areas, we use: Area = Length × Width. If it's circles, we use: Area = π × radius². These formulas are like magic spells that help us solve problems!` : `The science behind ${topicName} is fascinating! Our ${culture} ancestors were like detectives who figured out how things work by observing nature carefully. They didn't have fancy laboratories, but they had curiosity and ${expressions.wisdom}!`}

Think of it like this: every time you see ${topicName} in action, you're watching science and culture work together like best friends! 🤝✨`,
      concept: `The science behind ${topicName} and its cultural significance`,
      questions: {
        multipleChoice: {
          question: `What scientific principle explains how ${topicName} works?`,
          options: ['Cultural tradition', 'Natural laws', 'Historical events', 'Literary devices'],
          correct: 1
        },
        openEnded: {
          question: `How do scientific principles of ${topicName} enhance our understanding of ${culture} traditions?`,
          sampleAnswer: `Understanding the science behind ${topicName} helps us appreciate the wisdom of ${culture} ancestors.`
        }
      },
      feedback: {
        correct: `${expressions.encouragement} You understand the scientific foundation of ${topicName}.`,
        encouragement: `Great insight! Science and culture work together to create meaningful traditions.`
      }
    });

    // Segment 4: Historical Significance
    segments.push({
      subject,
      title: `Historical Significance of ${topicName}`,
      content: `${expressions.excitement} 🕰️ Let's travel back in time to see how ${topicName} shaped ${culture} history! It's like opening a magical history book!

Long, long ago, wise ${culture} scholars and craftspeople discovered ${topicName} secrets. They were like the first inventors and teachers! They used ${topicName} to build amazing temples, create beautiful art, and solve everyday problems.

These clever people passed their knowledge down through generations, like a precious family treasure. Today, we still use their discoveries! It's like having a conversation with our great-great-grandparents through the language of ${topicName}! 👴👵💫`,
      concept: `How ${topicName} shaped ${culture} history and traditions`,
      questions: {
        multipleChoice: {
          question: `How has ${topicName} influenced ${culture} cultural development?`,
          options: ['Through traditional practices', 'In historical events', 'In cultural celebrations', 'All of the above'],
          correct: 3
        },
        openEnded: {
          question: `What can we learn about ${culture} history through the study of ${topicName}?`,
          sampleAnswer: `We can learn about how ${culture} ancestors understood and applied ${topicName} principles.`
        }
      },
      feedback: {
        correct: `${expressions.encouragement} You understand the historical importance of ${topicName} in ${culture} culture.`,
        encouragement: `Excellent! History shows us how ${topicName} has been valued across generations.`
      }
    });

    // Segment 5: Modern Relevance
    segments.push({
      subject,
      title: `Modern Relevance of ${topicName}`,
      content: `${expressions.excitement} 🚀 Now let's see how ${topicName} is still super important today! It's like discovering that your favorite toy is actually a powerful tool!

Even in our modern world with computers and smartphones, ${topicName} is still everywhere! Scientists use ${topicName} principles to create new medicines, engineers use them to build amazing buildings, and artists use them to create digital masterpieces.

The best part? You can use ${topicName} too! Whether you're playing video games, cooking with your family, or creating art, you're using the same principles that ${culture} ancestors discovered. You're carrying on their legacy! 🌟✨`,
      concept: `How ${topicName} remains relevant in modern times`,
      questions: {
        multipleChoice: {
          question: `How is ${topicName} relevant in today's modern world?`,
          options: ['Only in traditional practices', 'In modern technology and science', 'Only in historical contexts', 'It\'s no longer relevant'],
          correct: 1
        },
        openEnded: {
          question: `How can you apply ${topicName} knowledge in your daily life?`,
          sampleAnswer: `I can use ${topicName} principles in my hobbies, school projects, and daily activities.`
        }
      },
      feedback: {
        correct: `${expressions.encouragement} You understand that ${topicName} is still valuable today.`,
        encouragement: `Wonderful! You're connecting ancient wisdom with modern applications.`
      }
    });

    return segments;
  };

  const handleGenerateAIStory = async () => {
    setIsGeneratingAI(true);
    try {
      const currentStorySegment = storyData.segments[currentSegment];
      const aiStory = await generateStory({
        culture: profile.culture,
        subject: currentStorySegment.subject,
        topic: currentStorySegment.title.toLowerCase().replace(/\s+/g, '_')
      });

      const enhancedStory = await enhanceStory(
        aiStory.story,
        profile.culture,
        currentStorySegment.subject,
        currentStorySegment.title.toLowerCase().replace(/\s+/g, '_')
      );

      // Update the current segment with AI-generated content
      const updatedSegments = [...storyData.segments];
      
      // Convert AI questions to the expected format
      const aiQuestions = aiStory.questions || [];
      const mcqQuestion = aiQuestions[0]; // Use the first MCQ question
      
      // Get proper topic name for questions
      const topicName = getSubtopicName(currentStorySegment.title.toLowerCase().replace(/\s+/g, '_'));
      
      updatedSegments[currentSegment] = {
        ...currentStorySegment,
        content: enhancedStory,
        questions: {
          multipleChoice: mcqQuestion ? {
            question: cleanMarkdown(mcqQuestion.text).replace(/advanced_poetry_introduction|_/g, topicName),
            options: mcqQuestion.options.map(option => cleanMarkdown(option).replace(/advanced_poetry_introduction|_/g, topicName)),
            correct: mcqQuestion.correctAnswer === 'A' ? 0 : 
                     mcqQuestion.correctAnswer === 'B' ? 1 : 
                     mcqQuestion.correctAnswer === 'C' ? 2 : 3
          } : {
            question: `What is the main concept of ${topicName} in ${profile.culture} culture?`,
            options: [
              `Traditional ${topicName} practices`,
              `Modern ${topicName} applications`, 
              `Cultural significance of ${topicName}`,
              `All of the above`
            ],
            correct: 3
          },
          openEnded: {
            question: `How does ${topicName} connect to ${profile.culture} cultural practices?`,
            sampleAnswer: `${topicName} connects to ${profile.culture} culture through traditional practices and daily life applications.`
          }
        }
      };

      setStoryData({
        ...storyData,
        segments: updatedSegments
      });

      toast({
        title: "AI Story Generated! ✨",
        description: "Your personalized cultural story has been enhanced with AI.",
      });
    } catch (error) {
      console.error('Error generating AI story:', error);
      toast({
        title: "Story Enhancement",
        description: "Using the original cultural story for your learning experience.",
      });
    } finally {
      setIsGeneratingAI(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-orange-500" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Loading your cultural story...</h2>
            <p className="text-gray-600">Preparing a personalized learning experience</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!storyData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Story Not Found</h2>
            <p className="text-gray-600">We couldn't find a story for your selected culture and subjects.</p>
            <Button onClick={onBack} className="mt-4">
              Back to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentStorySegment = storyData.segments[currentSegment];
  const totalSegments = storyData.segments.length;
  const progress = ((currentSegment + 1) / totalSegments) * 100;

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

  const colors = getCulturalColors(profile.culture);

  const handleQuestionComplete = async () => {
    const newCompleted = new Set(completedQuestions);
    newCompleted.add(currentSegment);
    setCompletedQuestions(newCompleted);
    setShowQuestions(false);

    // Update progress in Supabase
    try {
      await updateProgress({
        user_id: profile.name, // Using name as user_id for simplicity
        subject: currentStorySegment.subject,
        topic: currentStorySegment.title.toLowerCase().replace(/\s+/g, '_'),
        lessons_completed: newCompleted.size
      });
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const handleNextSegment = () => {
    if (currentSegment < totalSegments - 1) {
      setCurrentSegment(currentSegment + 1);
      setShowQuestions(false);
    } else {
      onLessonComplete();
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-red-50 to-yellow-50">
      {/* Header */}
      <div className={`bg-gradient-to-r ${colors.primary} text-white p-6`}>
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button onClick={onBack} variant="ghost" className="text-white hover:bg-white/20">
              ← Back to Home
            </Button>
            <div className="flex items-center gap-3">
            <Badge variant="secondary" className="bg-white/20 text-white">
              {profile.culture.charAt(0).toUpperCase() + profile.culture.slice(1)} Culture
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
          
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/20 rounded-full">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Learning Adventure: {storyData.title} 🌟
              </h1>
              <p className="text-lg opacity-90">{storyData.description}</p>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Your Progress
              </span>
              <span className="font-semibold">
                {currentSegment + 1} of {totalSegments} segments • {Math.round(progress)}% Complete! 🎉
              </span>
            </div>
            <Progress value={progress} className="h-3 bg-white/20" />
            
            <div className="flex items-center gap-6 text-sm opacity-90">
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4" />
                <span>Learning</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="w-4 h-4" />
                <span>{profile.culture} Culture</span>
              </div>
              <div className="flex items-center gap-1">
                <History className="w-4 h-4" />
                <span>{currentStorySegment.subject}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        {/* Story Segment */}
        <Card className="mb-8 border-2 border-orange-200 shadow-lg">
          <CardHeader className={`${colors.secondary} border-b-2 border-orange-200`}>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className={`text-2xl ${colors.accent} mb-2`}>
                  {currentStorySegment.title}
                </CardTitle>
                <Badge variant="outline" className="text-sm">
                  {currentStorySegment.subject.charAt(0).toUpperCase() + currentStorySegment.subject.slice(1)}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Learning Concept</p>
                <p className="font-semibold text-gray-800">{currentStorySegment.concept}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            {/* Voice Storytelling Component */}
            <VoiceStorytelling 
              text={cleanMarkdown(currentStorySegment.content)}
              title={currentStorySegment.title}
              culture={profile.culture}
            />
            
            {/* Math Formula Display for Math Topics */}
            {currentStorySegment.subject === 'math' && (
              <MathFormulaDisplay
                topic={currentStorySegment.title}
                formulas={[
                  'Area = Length × Width',
                  'Perimeter = 2 × (Length + Width)',
                  'Volume = Length × Width × Height',
                  'π (pi) ≈ 3.14159'
                ]}
                examples={[
                  'If a rectangle is 5 units long and 3 units wide, its area is 5 × 3 = 15 square units',
                  'The perimeter of a 4×6 rectangle is 2 × (4 + 6) = 20 units',
                  'A box that is 2×3×4 units has volume 2 × 3 × 4 = 24 cubic units'
                ]}
              />
            )}
            
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed text-lg whitespace-pre-wrap">
                {cleanMarkdown(currentStorySegment.content)}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
          {!showQuestions && !completedQuestions.has(currentSegment) && (
            <>
            <Button
              onClick={() => setShowQuestions(true)}
              size="lg"
                className={`bg-gradient-to-r ${colors.primary} hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-transform`}
              >
                🧠 Test Your Knowledge!
              </Button>
              
              <Button
                onClick={handleGenerateAIStory}
                disabled={isGeneratingAI}
                size="lg"
                variant="outline"
                className="border-2 border-purple-400 text-purple-600 hover:bg-purple-50 px-8 py-4 text-lg font-semibold rounded-xl transform hover:scale-105 transition-transform"
              >
                {isGeneratingAI ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Creating Magic... ✨
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5 mr-2" />
                    Make It More Fun! ✨
                  </>
                )}
            </Button>
            </>
          )}
          
          {completedQuestions.has(currentSegment) && (
            <Button
              onClick={handleNextSegment}
              size="lg"
              className={`bg-gradient-to-r ${colors.primary} hover:opacity-90 text-white px-8 py-4 text-lg font-semibold rounded-xl shadow-lg transform hover:scale-105 transition-transform`}
            >
              {currentSegment < totalSegments - 1 ? 'Continue Adventure →' : '🎉 Complete Your Journey!'}
            </Button>
          )}
        </div>

        {/* Chat Interface Toggle */}
        <div className="flex justify-center mb-6">
          <Button
            onClick={() => setShowChat(!showChat)}
            variant="outline"
            size="lg"
            className="border-2 border-blue-400 text-blue-600 hover:bg-blue-50 px-6 py-3 text-base font-semibold rounded-xl transform hover:scale-105 transition-transform"
          >
            {showChat ? (
              <>
                <BookOpen className="w-5 h-5 mr-2" />
                Hide Learning Helper
              </>
            ) : (
              <>
                <MessageCircle className="w-5 h-5 mr-2" />
                Ask Your Questions! 🤖
              </>
            )}
          </Button>
        </div>

        {/* Chat Interface */}
        {showChat && (
          <div className="mb-8">
            <ChatInterface
              culture={profile.culture}
              subject={currentStorySegment.subject}
              topic={currentStorySegment.title.toLowerCase().replace(/\s+/g, '_')}
              currentStoryContent={currentStorySegment.content}
            />
          </div>
        )}

        {/* Question Prompt */}
        {showQuestions && (
          <QuestionPrompt
            segment={currentStorySegment}
            culture={profile.culture}
            onComplete={handleQuestionComplete}
          />
        )}

        {/* Cultural Quote */}
        <Card className={`${colors.secondary} border-2 border-orange-200`}>
          <CardContent className="p-6 text-center">
            <blockquote className={`text-lg font-medium ${colors.accent} mb-2`}>
              "{storyData.culturalQuote.text}"
            </blockquote>
            <p className="text-gray-600">— {storyData.culturalQuote.attribution}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoryExperience;
