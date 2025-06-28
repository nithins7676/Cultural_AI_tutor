import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX, Play, Pause, RotateCcw, Info, X, Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VoiceStorytellingProps {
  text: string;
  title: string;
  culture: string;
}

// Cultural expressions for different cultures
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

const VoiceStorytelling: React.FC<VoiceStorytellingProps> = ({ text, title, culture }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(true);
  const [currentVoice, setCurrentVoice] = useState<SpeechSynthesisVoice | null>(null);
  const [showVoiceInfo, setShowVoiceInfo] = useState(false);
  const [showCulturalInfo, setShowCulturalInfo] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const speechRef = useRef<SpeechSynthesisUtterance | null>(null);
  const expressions = getCulturalExpressions(culture);

  useEffect(() => {
    // Load voices when component mounts
    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      if (voices.length > 0) {
        const voice = getVoiceForCulture();
        if (voice) {
          setCurrentVoice(voice);
        }
      }
    };

    // Handle voice loading
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }

    // Initial load
    loadVoices();

    // Cleanup
    return () => {
      if (window.speechSynthesis.onvoiceschanged) {
        window.speechSynthesis.onvoiceschanged = null;
      }
    };
  }, [culture]);

  // Get appropriate voice for the culture
  const getVoiceForCulture = () => {
    const voices = window.speechSynthesis.getVoices();
    if (!voices.length) return null;

    // Try to find a voice that matches the culture
    const cultureVoices: Record<string, string[]> = {
      hindi: ['hi-IN', 'en-IN'],
      tamil: ['ta-IN', 'en-IN'],
      bengali: ['bn-IN', 'en-IN'],
      telugu: ['te-IN', 'en-IN'],
      marathi: ['mr-IN', 'en-IN'],
      kannada: ['kn-IN', 'en-IN'],
      gujarati: ['gu-IN', 'en-IN'],
      punjabi: ['pa-IN', 'en-IN'],
      malayalam: ['ml-IN', 'en-IN'],
      odia: ['or-IN', 'en-IN']
    };

    const preferredVoices = cultureVoices[culture] || ['en-IN', 'en-US'];
    
    // First, try to find a voice that matches the culture
    for (const voiceCode of preferredVoices) {
      const voice = voices.find(v => v.lang.includes(voiceCode));
      if (voice) return voice;
    }
    
    // Ultra-natural voice selection for human-like storytelling
    const naturalVoices = voices.filter(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Natural') || 
       v.name.includes('Premium') || 
       v.name.includes('Enhanced') ||
       v.name.includes('Neural') ||
       v.name.includes('Studio') ||
       v.name.includes('Professional') ||
       v.name.includes('Female') ||
       v.name.includes('Warm') ||
       v.name.includes('Soft') ||
       v.name.includes('Human') ||
       v.name.includes('Real') ||
       v.name.includes('Authentic'))
    );
    
    if (naturalVoices.length > 0) {
      // Prioritize voices with natural/human indicators
      const ultraNaturalVoice = naturalVoices.find(v => 
        v.name.includes('Natural') || 
        v.name.includes('Human') || 
        v.name.includes('Real') ||
        v.name.includes('Authentic')
      );
      if (ultraNaturalVoice) return ultraNaturalVoice;
      
      // Then try warm/soft voices
      const warmVoice = naturalVoices.find(v => 
        v.name.includes('Warm') || 
        v.name.includes('Soft')
      );
      if (warmVoice) return warmVoice;
      
      // Then try enhanced/premium voices
      const enhancedVoice = naturalVoices.find(v => 
        v.name.includes('Enhanced') || 
        v.name.includes('Premium') ||
        v.name.includes('Neural')
      );
      if (enhancedVoice) return enhancedVoice;
      
      // Fallback to any natural voice
      return naturalVoices[0];
    }
    
    // Look for voices with good quality indicators
    const qualityVoices = voices.filter(v => 
      v.lang.startsWith('en') && 
      (v.name.includes('Female') || 
       v.name.includes('Male') ||
       v.name.includes('Voice') ||
       v.name.includes('Speaker'))
    );
    
    if (qualityVoices.length > 0) {
      return qualityVoices[0];
    }
    
    // Final fallback to any English voice
    return voices.find(v => v.lang.startsWith('en')) || voices[0];
  };

  const startVoiceStory = () => {
    if (!isVoiceEnabled) return;

    // Stop any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance();
    const voice = getVoiceForCulture();
    
    if (voice) {
      utterance.voice = voice;
      setCurrentVoice(voice);
    }

    // Ultra-natural speech settings for human-like storytelling
    utterance.rate = 0.75; // Much slower for natural pacing and expression
    utterance.pitch = 1.0; // Natural pitch for human-like sound
    utterance.volume = 0.9; // Slightly lower for warmth

    // Create natural, human-like text with perfect pauses
    const naturalText = createNaturalSpeech(text);
    utterance.text = naturalText;

    // Event handlers
    utterance.onstart = () => {
      setIsPlaying(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
    };

    utterance.onpause = () => {
      setIsPaused(true);
    };

    utterance.onresume = () => {
      setIsPaused(false);
    };

    speechRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  // Function to create truly natural speech with human-like patterns
  const createNaturalSpeech = (text: string): string => {
    return text
      // Add natural sentence pauses (longer pauses for storytelling)
      .replace(/\./g, '... ')
      .replace(/!/g, '!... ')
      .replace(/\?/g, '?... ')
      
      // Add natural comma pauses
      .replace(/,/g, ', ')
      
      // Add emphasis pauses around cultural expressions
      .replace(/(வணக்கம்!|அருமை!|ஞானம்|நன்றாக செய்கிறாய்!|नमस्ते!|बहुत बढ़िया!|ज्ञान|बहुत अच्छा!|নমস্কার!|খুব ভালো!|জ্ঞান|অসাধারণ!|నమస్కారం!|చాలా బాగుంది!|జ్ఞానం|చాలా మంచిది!|नमस्कार!|खूप छान!|ज्ञान|अतिशय चांगले!|ನಮಸ್ಕಾರ!|ಚೆನ್ನಾಗಿದೆ!|ಜ್ಞಾನ|ಅತ್ಯುತ್ತಮ!|નમસ્તે!|ખૂબ સરસ!|જ્ઞાન|બહુ સરસ!|ਸਤ ਸ੍ਰੀ ਅਕਾਲ!|ਬਹੁਤ ਵਧੀਆ!|ਗਿਆਨ|ਬਹੁਤ ਚੰਗਾ!|നമസ്കാരം!|വളരെ നല്ലത്!|ജ്ഞാനം|അതിശയം!|ନମସ୍କାର!|ବହୁତ ଭଲ!|ଜ୍ଞାନ|ଅତି ଭଲ!)/g, ' $1 ')
      
      // Add natural pauses around emojis for expression
      .replace(/(🌟|🌈|🔬|🕰️|🚀|🧠|✨|🤝|👴|👵|💫)/g, ' ... $1 ... ')
      
      // Add emphasis on key educational terms with natural pauses
      .replace(/\b(science|math|history|culture|tradition|ancestors|wisdom|knowledge|learning|education)\b/gi, ' ... $1 ... ')
      
      // Add natural pauses for storytelling flow
      .replace(/\b(Imagine|Think|Now|So|Then|But|And|Because|When|While)\b/gi, ' ... $1 ... ')
      
      // Add pauses around numbers and formulas for clarity
      .replace(/(\d+)/g, ' ... $1 ... ')
      .replace(/([A-Za-z]\s*=\s*[A-Za-z0-9+\-*/()²³]+)/g, ' ... $1 ... ')
      
      // Clean up multiple spaces and periods
      .replace(/\.{3,}/g, '...')
      .replace(/\s+/g, ' ')
      .trim();
  };

  const pauseVoiceStory = () => {
    if (isPlaying && !isPaused) {
      window.speechSynthesis.pause();
      setIsPaused(true);
    }
  };

  const resumeVoiceStory = () => {
    if (isPaused) {
      window.speechSynthesis.resume();
      setIsPaused(false);
    }
  };

  const stopVoiceStory = () => {
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    setIsPaused(false);
    setCurrentTime(0);
  };

  const toggleVoice = () => {
    if (isVoiceEnabled) {
      stopVoiceStory();
      setIsVoiceEnabled(false);
    } else {
      setIsVoiceEnabled(true);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Volume2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-800">Listen to the Story</h3>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {culture.charAt(0).toUpperCase() + culture.slice(1)} Voice
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowCulturalInfo(!showCulturalInfo)}
            className="text-orange-600 hover:text-orange-800"
          >
            <Globe className="w-4 h-4 mr-1" />
            Cultural Expressions
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowVoiceInfo(!showVoiceInfo)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Info className="w-4 h-4 mr-1" />
            Voice Info
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleVoice}
            className={`${isVoiceEnabled ? 'text-blue-600' : 'text-gray-400'}`}
          >
            {isVoiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </Button>
        </div>
      </div>

      {/* Voice Information */}
      {showVoiceInfo && (
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-blue-800">
                Current Voice: <span className="font-semibold">{currentVoice?.name || 'Loading...'}</span>
              </p>
              <p className="text-xs text-blue-600 mt-1">
                Ultra-natural, human-like storytelling voice selected for {culture} culture
              </p>
              {currentVoice?.name && (
                <div className="flex items-center gap-2 mt-2">
                  {currentVoice.name.includes('Natural') || currentVoice.name.includes('Neural') || currentVoice.name.includes('Human') || currentVoice.name.includes('Real') || currentVoice.name.includes('Authentic') ? (
                    <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
                      🌟 Ultra Natural
                    </Badge>
                  ) : currentVoice.name.includes('Enhanced') || currentVoice.name.includes('Premium') || currentVoice.name.includes('Warm') || currentVoice.name.includes('Soft') ? (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
                      ✨ Natural Voice
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-gray-100 text-gray-800 text-xs">
                      🎤 Standard Voice
                    </Badge>
                  )}
                  <span className="text-xs text-gray-600">
                    Rate: 0.75x | Pitch: Natural | Volume: Natural
                  </span>
                </div>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowVoiceInfo(false)}
              className="text-blue-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Cultural Expressions */}
      {showCulturalInfo && (
        <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-orange-800 flex items-center gap-2">
              <Globe className="w-4 h-4" />
              {culture.charAt(0).toUpperCase() + culture.slice(1)} Cultural Expressions
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCulturalInfo(false)}
              className="text-orange-600"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-orange-100 p-2 rounded">
              <span className="font-medium text-orange-800">Greeting:</span> {expressions.greeting}
            </div>
            <div className="bg-orange-100 p-2 rounded">
              <span className="font-medium text-orange-800">Excitement:</span> {expressions.excitement}
            </div>
            <div className="bg-orange-100 p-2 rounded">
              <span className="font-medium text-orange-800">Wisdom:</span> {expressions.wisdom}
            </div>
            <div className="bg-orange-100 p-2 rounded">
              <span className="font-medium text-orange-800">Encouragement:</span> {expressions.encouragement}
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center gap-3">
        <Button
          onClick={isPlaying ? (isPaused ? resumeVoiceStory : pauseVoiceStory) : startVoiceStory}
          disabled={!isVoiceEnabled}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          {isPlaying ? (
            isPaused ? (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume
              </>
            ) : (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause
              </>
            )
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Play Story
            </>
          )}
        </Button>

        {isPlaying && (
          <Button
            onClick={stopVoiceStory}
            variant="outline"
            size="sm"
            className="text-gray-600"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Stop
          </Button>
        )}

        <div className="text-sm text-gray-600">
          {isVoiceEnabled ? 'Voice enabled' : 'Voice disabled'}
        </div>
      </div>

      <div className="mt-3 text-xs text-gray-500">
        <p>🎧 Listen to the story with an ultra-natural, human-like voice!</p>
        <p>🎯 Perfect for children who prefer audio learning</p>
        <p>🌍 Voice automatically selected for {culture} culture</p>
        <p>💝 Natural speech with perfect pauses and pitch modulation</p>
        <p>🎭 Human-like storytelling with emotional expression</p>
      </div>
    </div>
  );
};

export default VoiceStorytelling; 