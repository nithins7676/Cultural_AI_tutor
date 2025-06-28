import { supabase, User, Progress, Story } from './supabase';
import { storyBank } from '@/data/storyBank';

// User Management
export const createUser = async (userData: Omit<User, 'id' | 'created_at'>): Promise<User | null> => {
  try {
    console.log('Attempting to create user with data:', userData);
    
    // Ensure all required fields are present
    const userDataWithDefaults = {
      ...userData,
      topics: userData.topics || []
    };
    
    const { data, error } = await supabase
      .from('users')
      .insert([userDataWithDefaults])
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating user:', error);
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      return null;
    }

    console.log('User created successfully:', data);
    return data;
  } catch (error) {
    console.error('Exception creating user:', error);
    return null;
  }
};

export const getUser = async (userId: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching user:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Story Management
export const getStory = async (culture: string, subject: string, topic: string): Promise<any> => {
  try {
    // First try to get from Supabase
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('culture', culture)
      .single();

    if (data && !error) {
      const storyKey = `${subject}_${topic}`;
      const storyContent = data.story[storyKey];
      const questions = data.questions[subject] || [];
      
      if (storyContent) {
        return { story: storyContent, questions };
      }
    }

    // Fallback to local story bank
    const localStory = storyBank[culture as keyof typeof storyBank];
    if (localStory) {
      const segment = localStory.segments.find(s => s.subject === subject);
      if (segment) {
        return {
          story: segment.content,
          questions: [
            segment.questions.multipleChoice,
            segment.questions.openEnded
          ]
        };
      }
    }

    return { story: 'Story not found', questions: [] };
  } catch (error) {
    console.error('Error fetching story:', error);
    return { story: 'Error loading story', questions: [] };
  }
};

// Progress Management
export const updateProgress = async (progressData: Omit<Progress, 'id' | 'created_at'>): Promise<Progress | null> => {
  try {
    const { data, error } = await supabase
      .from('progress')
      .upsert([progressData], { onConflict: 'user_id,subject,topic' })
      .select()
      .single();

    if (error) {
      console.error('Error updating progress:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error updating progress:', error);
    return null;
  }
};

export const getUserProgress = async (userId: string): Promise<Progress[]> => {
  try {
    const { data, error } = await supabase
      .from('progress')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      console.error('Error fetching progress:', error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching progress:', error);
    return [];
  }
};

// Answer Feedback
export const submitAnswer = async (
  culture: string, 
  subject: string, 
  topic: string, 
  answer: string, 
  question: any
): Promise<string> => {
  try {
    // Get the story to find feedback
    const localStory = storyBank[culture as keyof typeof storyBank];
    if (localStory) {
      const segment = localStory.segments.find(s => s.subject === subject);
      if (segment) {
        const isCorrect = question.type === 'mcq' 
          ? answer === question.options[question.correct]
          : true; // For open-ended questions, always provide encouragement
        
        return isCorrect ? segment.feedback.correct : segment.feedback.encouragement;
      }
    }

    // Default feedback
    const isCorrect = question.type === 'mcq' 
      ? answer === question.options[question.correct]
      : true;
    
    return isCorrect 
      ? `Great job! Your ${topic} answer reflects ${culture} traditions!`
      : `Try again! Review ${topic} in ${culture} context.`;
  } catch (error) {
    console.error('Error submitting answer:', error);
    return 'Thank you for your answer!';
  }
};

// Seed database with story data
export const seedStories = async (): Promise<void> => {
  try {
    const stories = Object.entries(storyBank).map(([culture, data]) => ({
      culture,
      story: data.segments.reduce((acc, segment) => {
        acc[`${segment.subject}_${segment.title.toLowerCase().replace(/\s+/g, '_')}`] = segment.content;
        return acc;
      }, {} as Record<string, string>),
      questions: data.segments.reduce((acc, segment) => {
        if (!acc[segment.subject]) {
          acc[segment.subject] = [];
        }
        acc[segment.subject].push(segment.questions.multipleChoice, segment.questions.openEnded);
        return acc;
      }, {} as Record<string, any[]>)
    }));

    const { error } = await supabase
      .from('stories')
      .upsert(stories, { onConflict: 'culture' });

    if (error) {
      console.error('Error seeding stories:', error);
    } else {
      console.log('Stories seeded successfully');
    }
  } catch (error) {
    console.error('Error seeding stories:', error);
  }
}; 