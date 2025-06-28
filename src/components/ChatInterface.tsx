import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send, Loader2, User, Bot, BookOpen, Lightbulb, HelpCircle, MessageCircle } from 'lucide-react';
import { generateFeedback, testAI, chatWithAI } from '@/lib/ai';
import { useToast } from '@/hooks/use-toast';
import { cleanMarkdown } from '@/lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  culture: string;
  subject: string;
  topic: string;
  currentStoryContent: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({
  culture,
  subject,
  topic,
  currentStoryContent
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Suggested questions for students
  const suggestedQuestions = [
    "Can you explain this concept in simpler terms?",
    "How does this relate to my daily life?",
    "What are some real-world examples?",
    "Can you give me more details about this?",
    "How can I remember this better?",
    "What's the connection to my culture?"
  ];

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      console.log('Sending question to AI:', inputValue);
      
      // Generate AI response
      const aiResponse = await chatWithAI(
        culture,
        subject,
        topic,
        inputValue
      );

      console.log('AI Response received:', aiResponse);

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      toast({
        title: "Response Generated! ✨",
        description: "Your question has been answered with cultural context.",
      });

    } catch (error) {
      console.error('Error generating response:', error);
      
      // Better fallback response
      const fallbackMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `I understand your question about ${topic} in ${culture} culture. Let me help you understand this better. 

Based on what we've learned, ${topic} connects to ${culture} traditions in many ways. For example, in our traditional ${culture} cooking, we use scientific principles every day. When we make traditional dishes, we're witnessing chemistry and physics in action!

Our ancestors were brilliant scientists and mathematicians who understood these concepts through generations of observation. They applied this knowledge in farming, cooking, art, and daily life.

Could you tell me more specifically what you'd like to know about ${topic}? I'd love to help you explore this topic further and show you how it connects to your ${culture} heritage!`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, fallbackMessage]);

      toast({
        title: "Response Generated",
        description: "Here's a helpful explanation for your question.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputValue(question);
  };

  const handleTestAI = async () => {
    setIsTesting(true);
    try {
      const result = await testAI();
      if (result.working) {
        toast({
          title: `AI Connection Successful! ✅`,
          description: `${result.model} is working properly and ready to help you.`,
        });
      } else {
        toast({
          title: "AI Connection Failed! ❌",
          description: result.error || "The AI is not responding. Using fallback responses.",
        });
      }
    } catch (error) {
      console.error('AI test error:', error);
      toast({
        title: "AI Test Error! ⚠️",
        description: "There was an error testing the AI connection.",
      });
    } finally {
      setIsTesting(false);
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Card className="w-full max-w-4xl mx-auto border-2 border-orange-200 shadow-lg">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-orange-200">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-orange-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Ask Your Cultural Learning Assistant
              </h3>
              <p className="text-sm text-gray-600">
                Get help with {topic} in {culture} culture
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleTestAI}
              disabled={isTesting}
              className="text-xs"
            >
              {isTesting ? (
                <>
                  <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                  Testing Gemini...
                </>
              ) : (
                <>
                  <HelpCircle className="h-3 w-3 mr-1" />
                  Test Gemini AI
                </>
              )}
            </Button>
            <Badge variant="secondary" className="bg-orange-100 text-orange-800">
              AI Assistant
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold">Ask Gemini AI</h3>
          </div>
          <Badge variant="secondary" className="text-xs">
            Powered by Google Gemini 2.0 Flash
          </Badge>
        </div>

        {/* Chat Messages */}
        <ScrollArea 
          ref={scrollAreaRef}
          className="h-96 mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
        >
          {messages.length === 0 ? (
            <div className="text-center py-8">
              <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Welcome to Your Learning Assistant! 🤖
              </h4>
              <p className="text-gray-600 mb-4">
                Ask me anything about {topic} in {culture} culture. I'm here to help you understand better!
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {suggestedQuestions.map((question, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSuggestedQuestion(question)}
                    className="text-left justify-start h-auto p-3 text-sm"
                  >
                    <Lightbulb className="w-4 h-4 mr-2 text-orange-500" />
                    {question}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.type === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  {message.type === 'assistant' && (
                    <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <Bot className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-orange-500 text-white'
                        : 'bg-white border border-gray-200 text-gray-800'
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{cleanMarkdown(message.content)}</p>
                    <p className={`text-xs mt-2 ${
                      message.type === 'user' ? 'text-orange-100' : 'text-gray-500'
                    }`}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                  {message.type === 'user' && (
                    <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}
              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-white border border-gray-200 text-gray-800 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                      <span className="text-sm">Thinking...</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask me anything about this topic..."
            className="flex-1"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputValue.trim() || isLoading}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        {/* Quick Actions */}
        <div className="mt-4 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Quick questions:</p>
          <div className="flex flex-wrap gap-2">
            {suggestedQuestions.slice(0, 3).map((question, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => handleSuggestedQuestion(question)}
                className="text-xs"
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatInterface; 