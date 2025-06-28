// Environment configuration
export const config = {
  supabase: {
    url: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    anonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key',
  },
  ai: {
    enabled: true, // AI is always enabled
    geminiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCa64t0G8j83WvR_e2qD9csLVMiRol_8nw',
  },
  app: {
    name: 'Cultural AI Tutor',
    version: '1.0.0',
    description: 'AI-Powered Cultural Storytelling Tutor',
  }
};

// Validate configuration
export const validateConfig = () => {
  const warnings = [];
  
  if (config.supabase.url === 'https://your-project.supabase.co') {
    warnings.push('Supabase URL not configured. Using local storage only.');
  }
  
  if (config.supabase.anonKey === 'your-anon-key') {
    warnings.push('Supabase API key not configured. Using local storage only.');
  }
  
  return warnings;
}; 