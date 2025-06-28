import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Circle, Loader2, Sparkles, XCircle, Send, MessageSquare, Target, Lightbulb } from 'lucide-react';
import { submitAnswer } from '@/lib/api';
import { generateFeedback } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import { cleanMarkdown } from '@/lib/utils';

interface QuestionPromptProps {
  segment: {
    subject: string;
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
  };
  culture: string;
  onComplete: () => void;
}

const QuestionPrompt: React.FC<QuestionPromptProps> = ({ segment, culture, onComplete }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [openEndedAnswer, setOpenEndedAnswer] = useState('');
  const [showFeedback, setShowFeedback] = useState(false);
  const [mcAnswered, setMcAnswered] = useState(false);
  const [openEndedAnswered, setOpenEndedAnswered] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string>('');
  const [isGeneratingFeedback, setIsGeneratingFeedback] = useState(false);
  const { toast } = useToast();

  const handleMultipleChoiceSubmit = async () => {
    if (selectedOption !== null) {
      setMcAnswered(true);
      setShowFeedback(true);
      
      // Generate AI feedback
      setIsGeneratingFeedback(true);
      try {
        const isCorrect = selectedOption === segment.questions.multipleChoice.correct;
        const answer = segment.questions.multipleChoice.options[selectedOption];
        
        // Get AI feedback
        const feedback = await generateFeedback(
          culture,
          segment.subject,
          'algebra', // Using a default topic
          answer,
          isCorrect
        );
        
        setAiFeedback(feedback);
        
        // Also submit to Supabase
        await submitAnswer(
          culture,
          segment.subject,
          'algebra',
          answer,
          {
            type: 'mcq',
            question: segment.questions.multipleChoice.question,
            options: segment.questions.multipleChoice.options,
            correct: segment.questions.multipleChoice.correct
          }
        );
        
        toast({
          title: "AI Feedback Generated! ✨",
          description: "Your answer has been analyzed with cultural context.",
        });
      } catch (error) {
        console.error('Error generating AI feedback:', error);
        setAiFeedback(selectedOption === segment.questions.multipleChoice.correct 
          ? segment.feedback.correct 
          : segment.feedback.encouragement
        );
      } finally {
        setIsGeneratingFeedback(false);
      }
    }
  };

  const handleOpenEndedSubmit = async () => {
    if (openEndedAnswer.trim()) {
      setOpenEndedAnswered(true);
      setShowFeedback(true);
      
      // Generate AI feedback for open-ended question
      setIsGeneratingFeedback(true);
      try {
        const feedback = await generateFeedback(
          culture,
          segment.subject,
          'reflection',
          openEndedAnswer,
          true // Open-ended questions always get encouragement
        );
        
        setAiFeedback(feedback);
        
        // Submit to Supabase
        await submitAnswer(
          culture,
          segment.subject,
          'reflection',
          openEndedAnswer,
          {
            type: 'open',
            question: segment.questions.openEnded.question
          }
        );
        
        toast({
          title: "Reflection Analyzed! 💭",
          description: "Your thoughts have been processed with cultural wisdom.",
        });
      } catch (error) {
        console.error('Error generating AI feedback:', error);
        setAiFeedback(segment.feedback.encouragement);
      } finally {
        setIsGeneratingFeedback(false);
      }
    }
  };

  const handleComplete = () => {
    onComplete();
  };

  const getSubjectColors = (subject: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      math: { bg: 'bg-blue-50', text: 'text-blue-800', border: 'border-blue-200' },
      science: { bg: 'bg-green-50', text: 'text-green-800', border: 'border-green-200' },
      history: { bg: 'bg-purple-50', text: 'text-purple-800', border: 'border-purple-200' },
      literature: { bg: 'bg-pink-50', text: 'text-pink-800', border: 'border-pink-200' }
    };
    return colorMap[subject] || colorMap.math;
  };

  const subjectColors = getSubjectColors(segment.subject);
  const isCorrect = selectedOption === segment.questions.multipleChoice.correct;
  const canProceed = mcAnswered && openEndedAnswered;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!openEndedAnswer.trim()) return;

    setIsGeneratingFeedback(true);
    try {
      const feedback = await generateFeedback(
        culture,
        segment.subject,
        'reflection',
        openEndedAnswer,
        true // Open-ended questions always get encouragement
      );

      setAiFeedback(feedback);
      setShowFeedback(true);
      
      // Update progress
      handleComplete();
    } catch (error) {
      console.error('Error getting feedback:', error);
      toast({
        title: "Oops! 😅",
        description: "Something went wrong. Let's try again!",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingFeedback(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Multiple Choice Question */}
      <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader className="border-b-2 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500 rounded-full">
              <Target className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-xl text-gray-800">
              Quick Quiz! 🧠
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-lg font-medium text-gray-800 mb-4">
              {segment.questions.multipleChoice.question}
            </p>
            
            <div className="grid gap-3">
              {segment.questions.multipleChoice.options.map((option, index) => (
                <Button
                  key={index}
                  variant={selectedOption === index ? "default" : "outline"}
                  className={`w-full justify-start p-4 text-left h-auto ${
                    selectedOption === index 
                      ? 'bg-blue-500 text-white border-blue-500' 
                      : 'hover:bg-blue-50 border-blue-200'
                  }`}
                  onClick={() => setSelectedOption(index)}
                >
                  <span className="font-semibold mr-3 text-lg">
                    {String.fromCharCode(65 + index)}.
                  </span>
                  {option}
                </Button>
              ))}
            </div>
            
            {mcAnswered && (
              <div className={`p-4 rounded-lg ${
                isCorrect 
                  ? 'bg-green-50 border-2 border-green-200' 
                  : 'bg-red-50 border-2 border-red-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  {isCorrect ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      <span className="font-semibold text-green-800">Great job! 🎉</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-600" />
                      <span className="font-semibold text-red-800">Almost there! 💪</span>
                    </>
                  )}
                </div>
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {isCorrect ? segment.feedback.correct : segment.feedback.encouragement}
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Open-Ended Question */}
      <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader className="border-b-2 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-500 rounded-full">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <CardTitle className="text-xl text-gray-800">
              Think About It! 💭
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <p className="text-lg font-medium text-gray-800 mb-4">
              {segment.questions.openEnded.question}
            </p>
            
            <div className="space-y-2">
              <Textarea
                value={openEndedAnswer}
                onChange={(e) => setOpenEndedAnswer(e.target.value)}
                placeholder="Share your thoughts here... ✨"
                className="min-h-[120px] resize-none border-2 border-purple-200 focus:border-purple-400"
                maxLength={300}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>Share your ideas!</span>
                <span>{openEndedAnswer.length}/300 characters</span>
              </div>
            </div>
            
            {!openEndedAnswered && (
              <Button
                onClick={handleSubmit}
                disabled={!openEndedAnswer.trim()}
                className="w-full bg-purple-500 hover:bg-purple-600 text-white py-3 text-lg font-semibold rounded-xl transform hover:scale-105 transition-transform"
              >
                {isGeneratingFeedback ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Getting Feedback...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Share My Answer! ✨
                  </>
                )}
              </Button>
            )}
            
            {showFeedback && aiFeedback && (
              <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="w-5 h-5 text-blue-600" />
                  <span className="font-semibold text-blue-800">Great thinking! 🌟</span>
                </div>
                <p className="text-blue-700">{aiFeedback}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Progress Indicator */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-green-100 text-green-800 rounded-full">
          <CheckCircle className="w-4 h-4" />
          <span className="font-medium">
            {mcAnswered && openEndedAnswered ? 'All questions completed! 🎉' : 'Keep going!'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default QuestionPrompt;
