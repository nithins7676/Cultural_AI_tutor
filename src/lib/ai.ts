// Mock AI story generation utility
// In a real implementation, this would use Hugging Face's distilgpt2 model

import { getSubtopicName } from '@/data/subtopics';
import { config } from '@/config/env';

// Question interface for MCQ format
interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: string; // 'A', 'B', 'C', or 'D'
  explanation: string;
}

export interface AIStoryRequest {
  culture: string;
  subject: string;
  topic: string;
}

export interface AIStoryResponse {
  story: string;
  questions: Array<{
    type: 'mcq' | 'open';
    question: string;
    options?: string[];
    correct?: number;
  }>;
}

// Pre-defined story templates for different cultures and subjects
const storyTemplates = {
  tamil: {
    math: {
      algebra: "During the Pongal festival, Meera's family needed to calculate how much rice to cook. Her grandmother taught her that if they had 2x + 5 = 15 kilograms of rice, they needed to solve for x to know how much to use. Meera learned that algebra helps in daily life, especially during cultural celebrations.",
      geometry: "Meera's mother was drawing a beautiful kolam pattern. She explained that the square kolam had sides of 4 meters each. Meera calculated the area using the formula: Area = side². The kolam's mathematical precision made it even more beautiful."
    },
    science: {
      physics: "During Pongal cooking, Meera observed how the rice and milk mixture bubbled up when ready. Her mother explained the science of heat transfer and phase changes. The steam pressure made the mixture rise, demonstrating physics in traditional cooking.",
      biology: "Meera learned about the rice growth cycle during Pongal. From seed to harvest, the rice plant goes through different stages. This biological process connects to the agricultural traditions of Tamil culture."
    }
  },
  hindi: {
    math: {
      algebra: "During Diwali, Arjun's family was calculating how many diyas they needed. If they had 3x + 2 = 14 diyas, they needed to solve for x. Algebra helped them plan the perfect Diwali decoration.",
      geometry: "Arjun's mother created a rangoli with 8 petals around a circle. Each petal formed a 45-degree angle (360° ÷ 8). The mathematical symmetry made the rangoli beautiful and balanced."
    },
    science: {
      physics: "Arjun noticed that diya flames always point upward. His father explained convection - hot air rises, carrying the flame upward. This physics principle is visible in traditional Diwali celebrations.",
      chemistry: "The rangoli colors came from natural materials. Turmeric provided yellow, vermillion gave red. These chemical compounds have been used in Indian art for centuries."
    }
  },
  bengali: {
    math: {
      algebra: "During Durga Puja, Priya's family calculated pandal dimensions. If the width was 10 meters and they used the golden ratio (1.618), the height should be 16.18 meters for perfect proportions.",
      geometry: "The pandal followed geometric principles. The golden ratio created natural beauty, just like in ancient Bengali temple architecture."
    },
    science: {
      physics: "The clay idols were fired at specific temperatures. Heat caused chemical changes, making the clay hard and durable. This material science has been perfected over generations.",
      chemistry: "Natural pigments were used for idol colors. Each color came from different chemical compounds, showing how chemistry and art combine in Bengali traditions."
    }
  }
};

// Updated AI configuration for Google Gemini API
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';
const GEMINI_API_KEY = 'AIzaSyCa64t0G8j83WvR_e2qD9csLVMiRol_8nw';

// Fallback to environment variable if provided
const getGeminiApiKey = () => {
  return import.meta.env.VITE_GEMINI_API_KEY || GEMINI_API_KEY;
};

export const generateStory = async (params: {
  culture: string;
  subject: string;
  topic: string;
}): Promise<{ story: string; questions: any[] }> => {
  const topicName = getSubtopicName(params.topic);
  
  // Try AI generation first, but fall back to comprehensive local content
  try {
    console.log('Attempting AI story generation for:', params);
    
    // Enhanced prompt for more powerful AI
    const prompt = `You are a fun and engaging cultural storytelling tutor for children. Create a short, exciting educational story about ${topicName} from ${params.culture} cultural perspective. 

    Requirements:
    - Write the story in ENGLISH only
    - Make it FUN and ENGAGING for children (ages 8-15)
    - Keep it SHORT (2-3 paragraphs maximum)
    - Use simple, clear language that children can understand
    - Include cultural elements from ${params.culture} traditions
    - Focus on ${params.subject} concepts through ${params.culture} cultural lens
    - Make it interactive and exciting to read
    - Use vivid descriptions and child-friendly examples
    
    Cultural Language Hooks (use these expressions naturally in the story):
    ${params.culture === 'tamil' ? '- Use "வணக்கம்! (Vanakkam!)" for greetings' : ''}
    ${params.culture === 'tamil' ? '- Use "அருமை! (Arumai!)" for excitement' : ''}
    ${params.culture === 'tamil' ? '- Use "ஞானம் (Gnanam)" for wisdom' : ''}
    ${params.culture === 'tamil' ? '- Use "நன்றாக செய்கிறாய்! (Nandraga seykiray!)" for encouragement' : ''}
    ${params.culture === 'hindi' ? '- Use "नमस्ते! (Namaste!)" for greetings' : ''}
    ${params.culture === 'hindi' ? '- Use "बहुत बढ़िया! (Bahut badhiya!)" for excitement' : ''}
    ${params.culture === 'hindi' ? '- Use "ज्ञान (Gyan)" for wisdom' : ''}
    ${params.culture === 'hindi' ? '- Use "बहुत अच्छा! (Bahut accha!)" for encouragement' : ''}
    ${params.culture === 'bengali' ? '- Use "নমস্কার! (Nomoskar!)" for greetings' : ''}
    ${params.culture === 'bengali' ? '- Use "খুব ভালো! (Khub bhalo!)" for excitement' : ''}
    ${params.culture === 'bengali' ? '- Use "জ্ঞান (Gyan)" for wisdom' : ''}
    ${params.culture === 'bengali' ? '- Use "অসাধারণ! (Osadharon!)" for encouragement' : ''}
    ${params.culture === 'telugu' ? '- Use "నమస్కారం! (Namaskaram!)" for greetings' : ''}
    ${params.culture === 'telugu' ? '- Use "చాలా బాగుంది! (Chala bagundi!)" for excitement' : ''}
    ${params.culture === 'telugu' ? '- Use "జ్ఞానం (Gnanam)" for wisdom' : ''}
    ${params.culture === 'telugu' ? '- Use "చాలా మంచిది! (Chala manchidi!)" for encouragement' : ''}
    ${params.culture === 'marathi' ? '- Use "नमस्कार! (Namaskar!)" for greetings' : ''}
    ${params.culture === 'marathi' ? '- Use "खूप छान! (Khoop chaan!)" for excitement' : ''}
    ${params.culture === 'marathi' ? '- Use "ज्ञान (Gyan)" for wisdom' : ''}
    ${params.culture === 'marathi' ? '- Use "अतिशय चांगले! (Atishay changle!)" for encouragement' : ''}
    ${params.culture === 'kannada' ? '- Use "ನಮಸ್ಕಾರ! (Namaskara!)" for greetings' : ''}
    ${params.culture === 'kannada' ? '- Use "ಚೆನ್ನಾಗಿದೆ! (Chennagide!)" for excitement' : ''}
    ${params.culture === 'kannada' ? '- Use "ಜ್ಞಾನ (Gnyana)" for wisdom' : ''}
    ${params.culture === 'kannada' ? '- Use "ಅತ್ಯುತ್ತಮ! (Atyuttama!)" for encouragement' : ''}
    ${params.culture === 'gujarati' ? '- Use "નમસ્તે! (Namaste!)" for greetings' : ''}
    ${params.culture === 'gujarati' ? '- Use "ખૂબ સરસ! (Khoob saras!)" for excitement' : ''}
    ${params.culture === 'gujarati' ? '- Use "જ્ઞાન (Gyan)" for wisdom' : ''}
    ${params.culture === 'gujarati' ? '- Use "બહુ સરસ! (Bahu saras!)" for encouragement' : ''}
    ${params.culture === 'punjabi' ? '- Use "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! (Sat Sri Akal!)" for greetings' : ''}
    ${params.culture === 'punjabi' ? '- Use "ਬਹੁਤ ਵਧੀਆ! (Bahut vadhia!)" for excitement' : ''}
    ${params.culture === 'punjabi' ? '- Use "ਗਿਆਨ (Gyan)" for wisdom' : ''}
    ${params.culture === 'punjabi' ? '- Use "ਬਹੁਤ ਚੰਗਾ! (Bahut changa!)" for encouragement' : ''}
    ${params.culture === 'malayalam' ? '- Use "നമസ്കാരം! (Namaskaram!)" for greetings' : ''}
    ${params.culture === 'malayalam' ? '- Use "വളരെ നല്ലത്! (Valare nallath!)" for excitement' : ''}
    ${params.culture === 'malayalam' ? '- Use "ജ്ഞാനം (Gnanam)" for wisdom' : ''}
    ${params.culture === 'malayalam' ? '- Use "അതിശയം! (Athishayam!)" for encouragement' : ''}
    ${params.culture === 'odia' ? '- Use "ନମସ୍କାର! (Namaskar!)" for greetings' : ''}
    ${params.culture === 'odia' ? '- Use "ବହୁତ ଭଲ! (Bahut bhala!)" for excitement' : ''}
    ${params.culture === 'odia' ? '- Use "ଜ୍ଞାନ (Gyan)" for wisdom' : ''}
    ${params.culture === 'odia' ? '- Use "ଅତି ଭଲ! (Ati bhala!)" for encouragement' : ''}
    
    ${params.subject === 'math' ? `IMPORTANT: If this involves mathematical concepts, include the proper formulas in a clear, easy-to-understand format. For example: "The area of a circle = π × radius²"` : ''}
    
    After the story, create 3 simple multiple choice questions (MCQs) that test understanding. Format the questions like this:
    
    Questions:
    1. [Simple question text]
    A) [Option A]
    B) [Option B] 
    C) [Option C]
    D) [Option D]
    Correct Answer: [A/B/C/D]
    
    2. [Simple question text]
    A) [Option A]
    B) [Option B]
    C) [Option C]
    D) [Option D]
    Correct Answer: [A/B/C/D]
    
    3. [Simple question text]
    A) [Option A]
    B) [Option B]
    C) [Option C]
    D) [Option D]
    Correct Answer: [A/B/C/D]
    
    Make the questions simple and relevant to the story content. Write everything in English.`;

    const response = await fetch(`${GEMINI_API_URL}?key=${getGeminiApiKey()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 800,
          temperature: 0.8,
          topP: 0.9
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Gemini AI response data:', data);
      
      let responseText = '';
      
      // Handle Gemini API response format
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        responseText = data.candidates[0].content.parts[0].text;
      } else if (data.error) {
        console.error('Gemini API error:', data.error);
        throw new Error(`Gemini API error: ${data.error.message}`);
      }
      
      // Validate response quality
      if (responseText && responseText.trim().length > 100) {
        console.log('Generated Gemini AI story:', responseText);
        
        // Extract story and questions from response
        const story = responseText.split('Questions:')[0] || responseText;
        const questionsText = responseText.split('Questions:')[1] || '';
        
        // Generate questions if not found in response
        const questions = questionsText ? parseQuestions(questionsText) : generateDefaultQuestions(params.culture, params.subject, topicName);
        
        return { story, questions };
      }
    }
    
    console.log('Gemini AI model failed, using comprehensive fallback');
    
  } catch (e) {
    console.log('Gemini AI generation error, using comprehensive fallback:', e);
  }
  
  // Use comprehensive fallback story
  return createComprehensiveFallbackStory(params.culture, params.subject, params.topic);
};

// Enhanced function to parse questions from AI response
const parseQuestions = (questionsText: string): Question[] => {
  const questions: Question[] = [];
  
  try {
    // Split by question numbers
    const questionBlocks = questionsText.split(/\d+\./).filter(block => block.trim());
    
    questionBlocks.forEach((block, index) => {
      const lines = block.trim().split('\n').filter(line => line.trim());
      
      if (lines.length >= 5) { // At least question + 4 options
        const questionText = lines[0].trim();
        const options: string[] = [];
        let correctAnswer = '';
        
        // Parse options A, B, C, D
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (line.match(/^[A-D]\)/)) {
            const option = line.replace(/^[A-D]\)\s*/, '').trim();
            options.push(option);
          } else if (line.toLowerCase().includes('correct answer:')) {
            const match = line.match(/correct answer:\s*([A-D])/i);
            if (match) {
              correctAnswer = match[1].toUpperCase();
            }
          }
        }
        
        // Only add if we have a valid question with options
        if (questionText && options.length === 4 && correctAnswer) {
          questions.push({
            id: `q${index + 1}`,
            text: questionText,
            options: options,
            correctAnswer: correctAnswer,
            explanation: `This question tests your understanding of ${questionText.toLowerCase()}`
          });
        }
      }
    });
    
    console.log('Parsed questions:', questions);
    return questions;
    
  } catch (error) {
    console.error('Error parsing questions:', error);
    return generateDefaultQuestions('Indian', 'Science', 'General');
  }
};

// Generate default questions if AI fails
const generateDefaultQuestions = (culture: string, subject: string, topic: string): Question[] => {
  const baseQuestions = [
    {
      id: 'q1',
      text: `What is the main concept of ${topic} in ${culture} culture?`,
      options: [
        `Traditional ${topic} practices`,
        `Modern ${topic} applications`, 
        `Cultural significance of ${topic}`,
        `All of the above`
      ],
      correctAnswer: 'D',
      explanation: `This question tests your understanding of how ${topic} relates to ${culture} culture.`
    },
    {
      id: 'q2', 
      text: `How does ${topic} connect to ${subject} principles?`,
      options: [
        `Through scientific methods`,
        `Through cultural traditions`,
        `Through practical applications`,
        `Through historical context`
      ],
      correctAnswer: 'C',
      explanation: `This question explores the practical applications of ${topic} in ${subject}.`
    },
    {
      id: 'q3',
      text: `What makes ${topic} culturally significant in ${culture} traditions?`,
      options: [
        `Its historical importance`,
        `Its modern relevance`,
        `Its educational value`,
        `All of the above`
      ],
      correctAnswer: 'D',
      explanation: `This question examines the cultural significance of ${topic} in ${culture} context.`
    }
  ];
  
  return baseQuestions;
};

// Create comprehensive fallback story
const createComprehensiveFallbackStory = (culture: string, subject: string, topic: string): { story: string; questions: any[] } => {
  const topicName = getSubtopicName(topic);
  
  const fallbackStories = {
    math: {
      algebra_basics: `In ${culture} culture, algebra is more than just solving equations—it's a way of understanding patterns and relationships that our ancestors discovered through careful observation. When our ${culture} grandmothers create traditional patterns, they're using algebraic thinking to create beautiful designs. The mathematical precision in our cultural art forms shows how ${culture} people have always been brilliant mathematicians.`,
      geometry: `Geometry in ${culture} culture is everywhere you look! From the sacred geometry of our temples to the geometric patterns in our traditional art, ${culture} ancestors understood the mathematical principles that create beauty and harmony. Our traditional crafts use geometric precision to create objects of both function and beauty.`,
      fractions: `Fractions in ${culture} culture are about sharing and community. In our traditional celebrations, we often need to divide things equally among family members. Our ancestors used this understanding in cooking, farming, and even in temple rituals where offerings needed to be divided fairly.`
    },
    science: {
      energy_and_heat: `Energy and heat in ${culture} culture are fundamental to our daily lives and traditions. When we cook traditional ${culture} dishes, we're witnessing energy and heat in action! The fire from our traditional stoves transfers heat energy to the cooking pot, making the water molecules move faster and creating steam that cooks our food. This same principle our ancestors used to create the perfect ${culture} feast.`,
      plants_and_animals: `Plants and animals in ${culture} culture are deeply connected to our agricultural traditions and respect for nature. Our ancestors were master biologists who understood the life cycles of plants and animals through generations of careful observation. In ${culture} farming practices, we learn about how seeds grow into plants, how plants produce food, and how animals interact with their environment.`,
      matter_and_energy: `Matter and energy in ${culture} culture are seen in our daily rituals and celebrations. Think about how butter melts in the sun during our festivals, or how water turns to steam when we cook traditional dishes. These are all examples of matter changing states due to energy. Our ancestors understood these principles intuitively and used them in their daily lives.`
    },
    history: {
      ancient_civilizations: `Ancient ${culture} civilization was incredibly advanced, with sophisticated knowledge of mathematics, science, art, and philosophy. Our ancestors built magnificent temples, created beautiful art, and developed complex social systems. By studying ancient civilizations, we learn about how our cultural values, traditions, and knowledge systems developed over thousands of years.`,
      freedom_struggle: `The freedom struggle in ${culture} culture is a story of courage, sacrifice, and the fight to preserve our cultural identity. Our ancestors didn't just fight for political freedom—they fought for the right to speak our language, practice our traditions, and preserve our cultural heritage.`,
      cultural_heritage: `Our ${culture} cultural heritage is a treasure trove of wisdom, art, and traditions that have been passed down through generations. Every aspect of our heritage—from traditional crafts to classical literature, from festival celebrations to daily rituals—tells a story about who we are and where we come from.`
    },
    literature: {
      poetry_basics: `Poetry in ${culture} culture is more than just words—it's the heartbeat of our cultural expression. Our traditional poetry forms carry the wisdom, emotions, and stories of our ancestors. ${culture} poetry teaches us about rhythm, metaphor, and the power of language to convey deep meaning.`,
      folk_tales: `Folk tales in ${culture} culture are windows into our cultural soul, carrying the wisdom, values, and imagination of our ancestors. These stories aren't just entertainment—they're teaching tools that have educated generations about moral values, cultural practices, and life lessons.`,
      cultural_stories: `Cultural stories in ${culture} culture are the threads that weave together our community's identity, values, and experiences. These stories reflect our cultural practices, celebrate our traditions, and preserve the wisdom of our ancestors.`
    }
  };
  
  const subjectStories = fallbackStories[subject as keyof typeof fallbackStories];
  const topicStory = subjectStories?.[topic as keyof typeof subjectStories];
  
  const story = topicStory || `In ${culture} culture, ${topicName} is deeply connected to our traditions and daily life. Our ancestors understood these principles through generations of observation and practice, applying them in ways that preserved our cultural heritage while solving practical problems. This wisdom continues to inspire and guide us today.`;
  
  return {
    story,
    questions: generateDefaultQuestions(culture, subject, topicName)
  };
};

// Generate questions based on culture, subject, and topic
const generateQuestions = (culture: string, subject: string, topic: string) => {
  const questions = [];

  // Multiple choice question
  if (subject === 'math' && topic === 'algebra') {
    questions.push({
      type: 'mcq' as const,
      question: `Solve 2x + 5 = 15 in the context of ${culture} traditions.`,
      options: ['3', '5', '7', '10'],
      correct: 1
    });
  } else if (subject === 'math' && topic === 'geometry') {
    questions.push({
      type: 'mcq' as const,
      question: `If a square has sides of 4 meters, what is its area?`,
      options: ['12 m²', '16 m²', '20 m²', '24 m²'],
      correct: 1
    });
  } else if (subject === 'science' && topic === 'physics') {
    questions.push({
      type: 'mcq' as const,
      question: `What scientific principle explains why flames point upward?`,
      options: ['Gravity', 'Convection', 'Conduction', 'Radiation'],
      correct: 1
    });
  }

  // Open-ended question
  questions.push({
    type: 'open' as const,
    question: `How does ${topic} in ${subject} connect to ${culture} cultural traditions?`
  });

  return questions;
};

export const generateFeedback = async (
  culture: string,
  subject: string,
  topic: string,
  userQuestion: string,
  isCorrect: boolean
): Promise<string> => {
  const topicName = getSubtopicName(topic);
  
  // Enhanced prompt that actually uses the user's question
  const prompt = `You are a friendly and encouraging cultural education tutor for children (ages 8-15). A student just answered a question about ${topicName} from a ${culture} cultural perspective.

  Student's Answer: "${userQuestion}"
  Question Type: ${isCorrect ? 'Correct' : 'Incorrect'}
  Subject: ${subject}
  
  Guidelines for feedback:
  - Be EXCITING and ENCOURAGING! 🌟
  - Use emojis and fun, positive language
  - Keep it SHORT and EASY to understand (2-3 sentences max)
  - Always be supportive, even if the answer needs improvement
  - Connect feedback to ${culture} culture when possible
  - Make learning feel like an adventure!
  - Use simple, clear language that children can understand
  
  Cultural Language Hooks (use these expressions naturally in your response):
  ${culture === 'tamil' ? '- Use "வணக்கம்! (Vanakkam!)" for greetings' : ''}
  ${culture === 'tamil' ? '- Use "அருமை! (Arumai!)" for excitement' : ''}
  ${culture === 'tamil' ? '- Use "ஞானம் (Gnanam)" for wisdom' : ''}
  ${culture === 'tamil' ? '- Use "நன்றாக செய்கிறாய்! (Nandraga seykiray!)" for encouragement' : ''}
  ${culture === 'hindi' ? '- Use "नमस्ते! (Namaste!)" for greetings' : ''}
  ${culture === 'hindi' ? '- Use "बहुत बढ़िया! (Bahut badhiya!)" for excitement' : ''}
  ${culture === 'hindi' ? '- Use "ज्ञान (Gyan)" for wisdom' : ''}
  ${culture === 'hindi' ? '- Use "बहुत अच्छा! (Bahut accha!)" for encouragement' : ''}
  ${culture === 'bengali' ? '- Use "নমস্কার! (Nomoskar!)" for greetings' : ''}
  ${culture === 'bengali' ? '- Use "খুব ভালো! (Khub bhalo!)" for excitement' : ''}
  ${culture === 'bengali' ? '- Use "জ্ঞান (Gyan)" for wisdom' : ''}
  ${culture === 'bengali' ? '- Use "অসাধারণ! (Osadharon!)" for encouragement' : ''}
  ${culture === 'telugu' ? '- Use "నమస్కారం! (Namaskaram!)" for greetings' : ''}
  ${culture === 'telugu' ? '- Use "చాలా బాగుంది! (Chala bagundi!)" for excitement' : ''}
  ${culture === 'telugu' ? '- Use "జ్ఞానం (Gnanam)" for wisdom' : ''}
  ${culture === 'telugu' ? '- Use "చాలా మంచిది! (Chala manchidi!)" for encouragement' : ''}
  ${culture === 'marathi' ? '- Use "नमस्कार! (Namaskar!)" for greetings' : ''}
  ${culture === 'marathi' ? '- Use "खूप छान! (Khoop chaan!)" for excitement' : ''}
  ${culture === 'marathi' ? '- Use "ज्ञान (Gyan)" for wisdom' : ''}
  ${culture === 'marathi' ? '- Use "अतिशय चांगले! (Atishay changle!)" for encouragement' : ''}
  ${culture === 'kannada' ? '- Use "ನಮಸ್ಕಾರ! (Namaskara!)" for greetings' : ''}
  ${culture === 'kannada' ? '- Use "ಚೆನ್ನಾಗಿದೆ! (Chennagide!)" for excitement' : ''}
  ${culture === 'kannada' ? '- Use "ಜ್ಞಾನ (Gnyana)" for wisdom' : ''}
  ${culture === 'kannada' ? '- Use "ಅತ್ಯುತ್ತಮ! (Atyuttama!)" for encouragement' : ''}
  ${culture === 'gujarati' ? '- Use "નમસ્તે! (Namaste!)" for greetings' : ''}
  ${culture === 'gujarati' ? '- Use "ખૂબ સરસ! (Khoob saras!)" for excitement' : ''}
  ${culture === 'gujarati' ? '- Use "જ્ઞાન (Gyan)" for wisdom' : ''}
  ${culture === 'gujarati' ? '- Use "બહુ સરસ! (Bahu saras!)" for encouragement' : ''}
  ${culture === 'punjabi' ? '- Use "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! (Sat Sri Akal!)" for greetings' : ''}
  ${culture === 'punjabi' ? '- Use "ਬਹੁਤ ਵਧੀਆ! (Bahut vadhia!)" for excitement' : ''}
  ${culture === 'punjabi' ? '- Use "ਗਿਆਨ (Gyan)" for wisdom' : ''}
  ${culture === 'punjabi' ? '- Use "ਬਹੁਤ ਚੰਗਾ! (Bahut changa!)" for encouragement' : ''}
  ${culture === 'malayalam' ? '- Use "നമസ്കാരം! (Namaskaram!)" for greetings' : ''}
  ${culture === 'malayalam' ? '- Use "വളരെ നല്ലത്! (Valare nallath!)" for excitement' : ''}
  ${culture === 'malayalam' ? '- Use "ജ്ഞാനം (Gnanam)" for wisdom' : ''}
  ${culture === 'malayalam' ? '- Use "അതിശയം! (Athishayam!)" for encouragement' : ''}
  ${culture === 'odia' ? '- Use "ନମସ୍କାର! (Namaskar!)" for greetings' : ''}
  ${culture === 'odia' ? '- Use "ବହୁତ ଭଲ! (Bahut bhala!)" for excitement' : ''}
  ${culture === 'odia' ? '- Use "ଜ୍ଞାନ (Gyan)" for wisdom' : ''}
  ${culture === 'odia' ? '- Use "ଅତି ଭଲ! (Ati bhala!)" for encouragement' : ''}
  
  ${subject === 'math' ? `IMPORTANT: If this involves math, explain concepts simply and use clear formulas. For example: "Remember, area = length × width!"` : ''}
  
  Provide encouraging, educational feedback that helps the child understand better. Write in English only.`;

  try {
    console.log('Generating response for specific question:', { culture, subject, topic, userQuestion });
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${GEMINI_API_URL}?key=${getGeminiApiKey()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 600,
          temperature: 0.7,
          topP: 0.9
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('AI response error:', response.status, response.statusText);
      throw new Error(`Failed to generate response: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Gemini AI response data:', data);
    
    let responseText = '';
    
    // Handle Gemini API response format
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      responseText = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(`Gemini API error: ${data.error.message}`);
    }
    
    // Validate response quality
    if (!responseText || responseText.trim().length < 50) {
      throw new Error('Generated response is too short');
    }
    
    console.log('Generated Gemini response:', responseText);
    return responseText;
    
  } catch (e) {
    console.error('AI response generation failed:', e);
    
    // Create specific fallback response based on the user's question
    return createSpecificFallbackResponse(culture, subject, topic, userQuestion);
  }
};

// Mock AI story enhancement
export const enhanceStory = async (
  story: string,
  culture: string,
  subject: string,
  topic: string
): Promise<string> => {
  const topicName = getSubtopicName(topic);
  
  // Enhanced prompt for story enhancement
  const prompt = `You are an expert cultural educator enhancing a story about ${topicName} in ${culture} culture. 

Original story: "${story}"

Please enhance this story by:
1. Adding more cultural details and traditional practices from ${culture} culture
2. Including specific examples, festivals, or historical events
3. Making the language more engaging and educational for students
4. Adding cultural quotes or wisdom from ${culture} traditions
5. Connecting the concept more deeply to ${culture} daily life and values
6. Ensuring the content is comprehensive (400-500 words) and culturally rich

Make the story more vivid, educational, and culturally authentic while maintaining the original message.`;

  try {
    console.log('Enhancing story with powerful AI for:', { culture, subject, topic });
    
    const response = await fetch(HF_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_AI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        inputs: prompt,
        parameters: {
          max_length: 1000,
          temperature: 0.7,
          do_sample: true,
          top_p: 0.9
        }
      })
    });
    
    if (!response.ok) {
      console.error('Powerful AI enhancement error:', response.status, response.statusText);
      throw new Error(`Failed to enhance story: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Powerful AI enhancement data:', data);
    
    let responseText = '';
    
    // Handle different response formats
    if (Array.isArray(data)) {
      if (data[0]?.generated_text) {
        responseText = data[0].generated_text;
      } else if (data[0]?.text) {
        responseText = data[0].text;
      } else if (typeof data[0] === 'string') {
        responseText = data[0];
      }
    } else if (data.generated_text) {
      responseText = data.generated_text;
    } else if (data.text) {
      responseText = data.text;
    } else if (typeof data === 'string') {
      responseText = data;
    }
    
    // Validate response quality
    if (!responseText || responseText.trim().length < 200) {
      throw new Error('Enhanced story is too short');
    }
    
    console.log('Enhanced story:', responseText);
    return responseText;
    
  } catch (e) {
    console.error('Powerful AI story enhancement failed:', e);
    return story; // Return original story if enhancement fails
  }
};

// Create educational fallback response when AI fails
const createEducationalFallbackResponse = (
  culture: string,
  subject: string,
  topic: string,
  question: string
): string => {
  const topicName = getSubtopicName(topic);
  
  const educationalResponses = {
    math: {
      algebra_basics: `Great question! Let me explain ${topicName} in the context of ${culture} culture. In ${culture} traditions, algebra isn't just about solving equations—it's about understanding patterns and relationships in our daily lives. For example, when our ancestors planned harvest festivals, they used algebraic thinking to calculate how much food to prepare based on the number of guests. They would think: "If we have x families and each family needs y amount of rice, how much should we cook?" This is algebra in action! The beauty of ${topicName} in ${culture} culture is that it helps us solve real problems while preserving our traditions.`,
      geometry: `Excellent question about ${topicName}! In ${culture} culture, geometry is everywhere you look. Our traditional art forms, like kolam patterns and rangoli designs, are perfect examples of geometric principles. When our grandmothers create these beautiful patterns, they're using geometry to ensure perfect symmetry and balance. Think about it: circles, squares, triangles—all these shapes come together to create stunning cultural art. The mathematical precision in our traditional designs shows how ${culture} ancestors understood geometry long before it was formalized in textbooks.`,
      fractions: `Wonderful question! ${topicName} in ${culture} culture is all about sharing and community. In our traditional celebrations, we often need to divide things equally among family members. For example, when we make sweets for festivals, we need to share them fairly. If we have 8 sweets and 4 children, each child gets 2 sweets—that's fractions in action! Our ancestors used this understanding in cooking, farming, and even in temple rituals where offerings needed to be divided equally. ${topicName} helps us maintain fairness and harmony in our cultural practices.`
    },
    science: {
      energy_and_heat: `Fantastic question about ${topicName}! In ${culture} culture, energy and heat are fundamental to our daily lives and traditions. Let me explain this in a way that connects to your cultural heritage. When we cook traditional ${culture} dishes, we're actually witnessing energy and heat in action! The fire from our traditional stoves transfers heat energy to the cooking pot, making the water molecules move faster and creating steam that cooks our food. This same principle our ancestors used to create the perfect ${culture} feast. The science behind ${topicName} shows us how our traditional cooking methods are actually sophisticated applications of physics and chemistry. Our ancestors were brilliant scientists who understood these principles through careful observation and practice.`,
      plants_and_animals: `Excellent question! ${topicName} in ${culture} culture is deeply connected to our agricultural traditions and respect for nature. Our ancestors were master biologists who understood the life cycles of plants and animals through generations of careful observation. In ${culture} farming practices, we learn about how seeds grow into plants, how plants produce food, and how animals interact with their environment. This knowledge wasn't just for survival—it was about living in harmony with nature. Our traditional farming methods show sophisticated understanding of biology, from crop rotation to natural pest control. ${topicName} in ${culture} culture teaches us that science and spirituality can work together beautifully.`,
      matter_and_energy: `Great question about ${topicName}! In ${culture} culture, we see matter and energy transformations in our daily rituals and celebrations. Think about how butter melts in the sun during our festivals, or how water turns to steam when we cook traditional dishes. These are all examples of matter changing states due to energy. Our ancestors understood these principles intuitively and used them in their daily lives. The traditional cooking methods, the way we preserve food, and even our festival preparations all demonstrate sophisticated understanding of ${topicName}. This knowledge has been passed down through generations, showing how science and culture are beautifully intertwined in ${culture} traditions.`
    },
    history: {
      ancient_civilizations: `Excellent question about ${topicName}! In ${culture} culture, understanding ancient civilizations helps us connect with our roots and appreciate the wisdom of our ancestors. The ancient ${culture} civilization was incredibly advanced, with sophisticated knowledge of mathematics, science, art, and philosophy. Our ancestors built magnificent temples, created beautiful art, and developed complex social systems. By studying ${topicName}, we learn about how our cultural values, traditions, and knowledge systems developed over thousands of years. This history isn't just about the past—it's about understanding who we are today and how our cultural heritage shapes our identity. The wisdom of ancient ${culture} civilization continues to inspire and guide us in modern times.`,
      freedom_struggle: `Important question about ${topicName}! The freedom struggle in ${culture} culture is a story of courage, sacrifice, and the fight to preserve our cultural identity. Our ancestors didn't just fight for political freedom—they fought for the right to speak our language, practice our traditions, and preserve our cultural heritage. The freedom movement in ${culture} regions was unique because it combined political resistance with cultural preservation. Leaders from our community worked tirelessly to ensure that our traditions, literature, and cultural practices would survive and thrive. This history teaches us about the importance of standing up for our cultural rights and the value of preserving our heritage for future generations.`,
      cultural_heritage: `Wonderful question about ${topicName}! In ${culture} culture, our cultural heritage is a treasure trove of wisdom, art, and traditions that have been passed down through generations. Every aspect of our heritage—from traditional crafts to classical literature, from festival celebrations to daily rituals—tells a story about who we are and where we come from. Our cultural heritage isn't just about preserving the past—it's about understanding our identity and values. By studying ${topicName}, we learn about the creativity, wisdom, and resilience of our ancestors. This knowledge helps us appreciate our cultural richness and inspires us to carry forward these traditions with pride and understanding.`
    },
    literature: {
      poetry_basics: `Beautiful question about ${topicName}! In ${culture} culture, poetry is more than just words—it's the heartbeat of our cultural expression. Our traditional poetry forms, like the classical verses and folk songs, carry the wisdom, emotions, and stories of our ancestors. ${topicName} in ${culture} literature teaches us about rhythm, metaphor, and the power of language to convey deep meaning. Our poets have used poetry to preserve cultural values, share historical events, and express the beauty of our traditions. Learning ${topicName} helps us understand how our ancestors used language to create beauty, preserve wisdom, and connect with each other across generations. Poetry in ${culture} culture shows us that literature is a bridge between the past and present, connecting us to our cultural roots.`,
      folk_tales: `Excellent question about ${topicName}! In ${culture} culture, folk tales are windows into our cultural soul, carrying the wisdom, values, and imagination of our ancestors. These stories aren't just entertainment—they're teaching tools that have educated generations about moral values, cultural practices, and life lessons. ${topicName} in ${culture} literature shows us how storytelling can preserve cultural knowledge and pass down wisdom from one generation to the next. Our folk tales often feature characters who embody ${culture} values, face challenges that reflect our cultural experiences, and find solutions that demonstrate traditional wisdom. By studying ${topicName}, we learn about the creativity and wisdom of our ancestors, and how they used stories to teach, inspire, and preserve our cultural heritage.`,
      cultural_stories: `Great question about ${topicName}! In ${culture} culture, cultural stories are the threads that weave together our community's identity, values, and experiences. These stories reflect our cultural practices, celebrate our traditions, and preserve the wisdom of our ancestors. ${topicName} in ${culture} literature shows us how storytelling can capture the essence of our cultural heritage and make it accessible to future generations. Our cultural stories often feature themes that are central to ${culture} identity—family bonds, community harmony, respect for nature, and the importance of tradition. By studying ${topicName}, we learn about how our ancestors used narrative to preserve cultural knowledge, teach important lessons, and create a sense of belonging and identity within our community.`
    }
  };
  
  const subjectResponses = educationalResponses[subject as keyof typeof educationalResponses];
  const topicResponse = subjectResponses?.[topic as keyof typeof subjectResponses];
  
  if (topicResponse) {
    return topicResponse;
  }
  
  // Generic educational response
  return `Great question about ${topicName}! Let me help you understand this concept in the context of ${culture} culture. ${topicName} is more than just a subject—it's a way of understanding the world that our ${culture} ancestors mastered through generations of observation and practice. In our cultural traditions, we can see ${topicName} principles applied in many ways: from traditional cooking methods that use scientific principles, to artistic practices that demonstrate mathematical concepts, to cultural celebrations that reflect historical understanding. The beauty of learning ${topicName} through ${culture} culture is that it connects abstract concepts to real, meaningful experiences in our daily lives and traditions. This approach helps us not only understand the subject better but also appreciate the wisdom of our ancestors who discovered and applied these principles long before they were formalized in textbooks. Keep asking questions—that's how we learn and grow!`;
};

// Create specific fallback response based on user's question
const createSpecificFallbackResponse = (
  culture: string,
  subject: string,
  topic: string,
  userQuestion: string
): string => {
  const topicName = getSubtopicName(topic);
  const question = userQuestion.toLowerCase();
  
  // Different responses based on the type of question
  if (question.includes('connection') || question.includes('relate') || question.includes('culture')) {
    return `Great question about the connection to ${culture} culture! ${topicName} is deeply woven into our ${culture} traditions and daily life. 

For example, in ${culture} culture, we can see ${topicName} principles in our traditional cooking methods, where understanding heat and energy helps us create perfect ${culture} dishes. Our ancestors used these concepts in farming, where they observed weather patterns and plant growth cycles.

In our festivals and celebrations, ${topicName} comes alive - think about how we use fire in our traditional ceremonies, or how we measure ingredients for traditional recipes. These aren't just cultural practices, they're practical applications of ${topicName} that our ancestors mastered through generations of observation.

The beauty of learning ${topicName} through ${culture} culture is that it connects abstract concepts to real, meaningful experiences in our daily lives and traditions. This approach helps us not only understand the subject better but also appreciate the wisdom of our ancestors who discovered and applied these principles long before they were formalized in textbooks.

Keep asking questions—that's how we learn and grow!`;
  }
  
  if (question.includes('what can you do') || question.includes('help') || question.includes('assist')) {
    return `I'm your ${culture} cultural learning assistant, and I can help you with many things related to ${topicName}! 

I can explain complex concepts in simple terms using examples from ${culture} culture and traditions. I can show you how ${topicName} connects to our daily lives, festivals, and traditional practices. I can provide real-world examples that make learning more meaningful and relevant to your ${culture} heritage.

I can also help you understand how our ancestors used these principles in their daily lives, from traditional crafts to agricultural practices. I can share cultural wisdom and traditional knowledge that has been passed down through generations.

Most importantly, I can make learning ${topicName} fun and engaging by connecting it to your cultural identity and heritage. Whether you're struggling with a concept or just want to learn more about how it relates to ${culture} culture, I'm here to help!

What specific aspect of ${topicName} would you like to explore today?`;
  }
  
  if (question.includes('explain') || question.includes('simpler') || question.includes('understand')) {
    return `Let me explain ${topicName} in simpler terms using ${culture} culture as our guide!

Think of ${topicName} like learning a traditional ${culture} recipe. Just like how we need to understand the ingredients, measurements, and cooking process to make a perfect dish, ${topicName} helps us understand the basic building blocks and processes in ${subject}.

In ${culture} culture, we see this everywhere. For example, when our grandmothers teach us to cook, they're actually teaching us about measurements, heat, and chemical reactions - all fundamental concepts in ${topicName}. When we observe the changing seasons and how they affect our crops, we're learning about natural cycles and patterns.

The key is to start with what you already know from your ${culture} traditions and build from there. What specific part of ${topicName} would you like me to explain further?`;
  }
  
  if (question.includes('example') || question.includes('real world') || question.includes('daily life')) {
    return `Here are some amazing real-world examples of ${topicName} in ${culture} culture!

In our traditional ${culture} cooking, we see ${topicName} in action every day. When we make traditional dishes, we're using heat energy to transform ingredients - that's chemistry and physics in action! Our ancestors understood these principles intuitively and used them to create delicious, nutritious meals.

In ${culture} agriculture, farmers use their understanding of ${topicName} to predict weather patterns, choose the best times for planting, and care for their crops. This traditional knowledge has been passed down through generations and is still used today.

In our festivals and celebrations, we see ${topicName} in the way we use fire, light, and sound. The traditional lamps we light, the musical instruments we play, and the decorations we create all demonstrate these principles.

Even in our traditional crafts and art forms, ${topicName} plays a role. The geometric patterns in our traditional designs, the way we mix colors for traditional paintings, and the techniques we use in traditional weaving all involve these concepts.

These examples show how ${topicName} isn't just textbook knowledge - it's living, breathing wisdom that's part of our ${culture} heritage!`;
  }
  
  // Default response for other questions
  return `That's a great question about ${topicName} in ${culture} culture! Let me help you understand this better.

${topicName} is more than just a subject—it's a way of understanding the world that our ${culture} ancestors mastered through generations of observation and practice. In our cultural traditions, we can see ${topicName} principles applied in many ways: from traditional cooking methods that use scientific principles, to artistic practices that demonstrate mathematical concepts, to cultural celebrations that reflect historical understanding.

The beauty of learning ${topicName} through ${culture} culture is that it connects abstract concepts to real, meaningful experiences in our daily lives and traditions. This approach helps us not only understand the subject better but also appreciate the wisdom of our ancestors who discovered and applied these principles long before they were formalized in textbooks.

Could you tell me more specifically what you'd like to know about ${topicName}? I'd love to help you explore this topic further!`;
};

// Test function to check if AI API is working
export const testAI = async (): Promise<{ working: boolean; model: string; error?: string }> => {
  try {
    console.log('Testing Gemini AI API...');
    
    const response = await fetch(`${GEMINI_API_URL}?key=${getGeminiApiKey()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: 'Hello, this is a test message. Please respond with a short greeting in English.'
          }]
        }],
        generationConfig: {
          maxOutputTokens: 50,
          temperature: 0.7
        }
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      console.log('Gemini API test successful:', data);
      
      if (data.candidates && data.candidates[0] && data.candidates[0].content) {
        return { working: true, model: 'Google Gemini 2.0 Flash' };
      } else {
        return { working: false, model: 'Gemini 2.0 Flash', error: 'Invalid response format' };
      }
    } else {
      const errorData = await response.json();
      console.error('Gemini API test failed:', response.status, errorData);
      return { 
        working: false, 
        model: 'Gemini 2.0 Flash', 
        error: `API Error: ${response.status} - ${errorData.error?.message || 'Unknown error'}` 
      };
    }
    
  } catch (error) {
    console.error('Gemini API test error:', error);
    return { 
      working: false, 
      model: 'Gemini 2.0 Flash', 
      error: `Connection Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    };
  }
};

// Chat with AI for general questions
export const chatWithAI = async (
  culture: string,
  subject: string,
  topic: string,
  message: string
): Promise<string> => {
  const topicName = getSubtopicName(topic);
  
  const prompt = `You are a friendly and encouraging cultural storytelling tutor for children (ages 8-15). The student is learning about ${topicName} from a ${culture} cultural perspective.

  Guidelines:
  - Be EXCITING and ENCOURAGING! Use emojis and fun language
  - Keep responses SHORT and EASY to understand
  - Use simple, clear explanations that children can grasp
  - Connect everything to ${culture} culture and traditions
  - Be patient and supportive - learning is a journey!
  - Use examples that children can relate to
  - Make learning FUN and engaging
  
  Cultural Language Hooks (use these expressions naturally in your response):
  ${culture === 'tamil' ? '- Use "வணக்கம்! (Vanakkam!)" for greetings' : ''}
  ${culture === 'tamil' ? '- Use "அருமை! (Arumai!)" for excitement' : ''}
  ${culture === 'tamil' ? '- Use "ஞானம் (Gnanam)" for wisdom' : ''}
  ${culture === 'tamil' ? '- Use "நன்றாக செய்கிறாய்! (Nandraga seykiray!)" for encouragement' : ''}
  ${culture === 'hindi' ? '- Use "नमस्ते! (Namaste!)" for greetings' : ''}
  ${culture === 'hindi' ? '- Use "बहुत बढ़िया! (Bahut badhiya!)" for excitement' : ''}
  ${culture === 'hindi' ? '- Use "ज्ञान (Gyan)" for wisdom' : ''}
  ${culture === 'hindi' ? '- Use "बहुत अच्छा! (Bahut accha!)" for encouragement' : ''}
  ${culture === 'bengali' ? '- Use "নমস্কার! (Nomoskar!)" for greetings' : ''}
  ${culture === 'bengali' ? '- Use "খুব ভালো! (Khub bhalo!)" for excitement' : ''}
  ${culture === 'bengali' ? '- Use "জ্ঞান (Gyan)" for wisdom' : ''}
  ${culture === 'bengali' ? '- Use "অসাধারণ! (Osadharon!)" for encouragement' : ''}
  ${culture === 'telugu' ? '- Use "నమస్కారం! (Namaskaram!)" for greetings' : ''}
  ${culture === 'telugu' ? '- Use "చాలా బాగుంది! (Chala bagundi!)" for excitement' : ''}
  ${culture === 'telugu' ? '- Use "జ్ఞానం (Gnanam)" for wisdom' : ''}
  ${culture === 'telugu' ? '- Use "చాలా మంచిది! (Chala manchidi!)" for encouragement' : ''}
  ${culture === 'marathi' ? '- Use "नमस्कार! (Namaskar!)" for greetings' : ''}
  ${culture === 'marathi' ? '- Use "खूप छान! (Khoop chaan!)" for excitement' : ''}
  ${culture === 'marathi' ? '- Use "ज्ञान (Gyan)" for wisdom' : ''}
  ${culture === 'marathi' ? '- Use "अतिशय चांगले! (Atishay changle!)" for encouragement' : ''}
  ${culture === 'kannada' ? '- Use "ನಮಸ್ಕಾರ! (Namaskara!)" for greetings' : ''}
  ${culture === 'kannada' ? '- Use "ಚೆನ್ನಾಗಿದೆ! (Chennagide!)" for excitement' : ''}
  ${culture === 'kannada' ? '- Use "ಜ್ಞಾನ (Gnyana)" for wisdom' : ''}
  ${culture === 'kannada' ? '- Use "ಅತ್ಯುತ್ತಮ! (Atyuttama!)" for encouragement' : ''}
  ${culture === 'gujarati' ? '- Use "નમસ્તે! (Namaste!)" for greetings' : ''}
  ${culture === 'gujarati' ? '- Use "ખૂબ સરસ! (Khoob saras!)" for excitement' : ''}
  ${culture === 'gujarati' ? '- Use "જ્ઞાન (Gyan)" for wisdom' : ''}
  ${culture === 'gujarati' ? '- Use "બહુ સરસ! (Bahu saras!)" for encouragement' : ''}
  ${culture === 'punjabi' ? '- Use "ਸਤ ਸ੍ਰੀ ਅਕਾਲ! (Sat Sri Akal!)" for greetings' : ''}
  ${culture === 'punjabi' ? '- Use "ਬਹੁਤ ਵਧੀਆ! (Bahut vadhia!)" for excitement' : ''}
  ${culture === 'punjabi' ? '- Use "ਗਿਆਨ (Gyan)" for wisdom' : ''}
  ${culture === 'punjabi' ? '- Use "ਬਹੁਤ ਚੰਗਾ! (Bahut changa!)" for encouragement' : ''}
  ${culture === 'malayalam' ? '- Use "നമസ്കാരം! (Namaskaram!)" for greetings' : ''}
  ${culture === 'malayalam' ? '- Use "വളരെ നല്ലത്! (Valare nallath!)" for excitement' : ''}
  ${culture === 'malayalam' ? '- Use "ജ്ഞാനം (Gnanam)" for wisdom' : ''}
  ${culture === 'malayalam' ? '- Use "അതിശയം! (Athishayam!)" for encouragement' : ''}
  ${culture === 'odia' ? '- Use "ନମସ୍କାର! (Namaskar!)" for greetings' : ''}
  ${culture === 'odia' ? '- Use "ବହୁତ ଭଲ! (Bahut bhala!)" for excitement' : ''}
  ${culture === 'odia' ? '- Use "ଜ୍ଞାନ (Gyan)" for wisdom' : ''}
  ${culture === 'odia' ? '- Use "ଅତି ଭଲ! (Ati bhala!)" for encouragement' : ''}
  
  ${subject === 'math' ? `IMPORTANT: If explaining mathematical concepts, use clear formulas and simple examples. For example: "To find the area of a rectangle, multiply length × width!"` : ''}
  
  The student asked: "${message}"
  
  Respond in a fun, educational way that helps them understand ${topicName} better through ${culture} cultural lens. Write in English only.`;

  try {
    console.log('Generating chat response for:', { culture, subject, topic, message });
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout
    
    const response = await fetch(`${GEMINI_API_URL}?key=${getGeminiApiKey()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          maxOutputTokens: 600,
          temperature: 0.7,
          topP: 0.9
        }
      }),
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('AI response error:', response.status, response.statusText);
      throw new Error(`Failed to generate response: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log('Gemini AI response data:', data);
    
    let responseText = '';
    
    // Handle Gemini API response format
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      responseText = data.candidates[0].content.parts[0].text;
    } else if (data.error) {
      console.error('Gemini API error:', data.error);
      throw new Error(`Gemini API error: ${data.error.message}`);
    }
    
    // Validate response quality
    if (!responseText || responseText.trim().length < 50) {
      throw new Error('Generated response is too short');
    }
    
    console.log('Generated Gemini response:', responseText);
    return responseText;
    
  } catch (e) {
    console.error('AI chat generation failed:', e);
    
    // Create specific fallback response based on the user's question
    return createSpecificFallbackResponse(culture, subject, topic, message);
  }
}; 