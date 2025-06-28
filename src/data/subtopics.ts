// Comprehensive subtopics for each subject
export const subjectSubtopics = {
  math: {
    elementary: [
      'addition_and_subtraction',
      'multiplication_and_division',
      'fractions',
      'decimals',
      'basic_geometry',
      'measurement',
      'time_and_money',
      'patterns_and_sequences'
    ],
    'middle school': [
      'algebra_basics',
      'geometry',
      'fractions_and_decimals',
      'percentages',
      'ratios_and_proportions',
      'data_and_statistics',
      'basic_trigonometry',
      'number_systems'
    ],
    'high school': [
      'advanced_algebra',
      'calculus_basics',
      'trigonometry',
      'probability_and_statistics',
      'coordinate_geometry',
      'mathematical_modeling',
      'number_theory',
      'linear_programming'
    ]
  },
  science: {
    elementary: [
      'plants_and_animals',
      'weather_and_climate',
      'simple_machines',
      'matter_and_energy',
      'earth_and_space',
      'human_body',
      'ecosystems',
      'forces_and_motion'
    ],
    'middle school': [
      'chemistry_basics',
      'physics_fundamentals',
      'biology_cells',
      'earth_science',
      'energy_and_heat',
      'light_and_sound',
      'genetics_basics',
      'environmental_science'
    ],
    'high school': [
      'organic_chemistry',
      'advanced_physics',
      'molecular_biology',
      'astronomy',
      'thermodynamics',
      'electromagnetism',
      'evolution',
      'biotechnology'
    ]
  },
  history: {
    elementary: [
      'ancient_civilizations',
      'medieval_periods',
      'exploration_and_discovery',
      'independence_movements',
      'world_wars',
      'cultural_heritage',
      'famous_leaders',
      'important_events'
    ],
    'middle school': [
      'ancient_india',
      'medieval_india',
      'colonial_period',
      'freedom_struggle',
      'world_history',
      'cultural_evolution',
      'social_movements',
      'economic_history'
    ],
    'high school': [
      'ancient_civilizations',
      'medieval_history',
      'modern_history',
      'independence_movements',
      'world_wars',
      'cold_war',
      'globalization',
      'contemporary_issues'
    ]
  },
  literature: {
    elementary: [
      'folk_tales',
      'poetry_basics',
      'story_elements',
      'character_development',
      'reading_comprehension',
      'creative_writing',
      'cultural_stories',
      'moral_tales'
    ],
    'middle school': [
      'classical_literature',
      'poetry_analysis',
      'drama_and_theater',
      'short_stories',
      'literary_devices',
      'cultural_poetry',
      'biographies',
      'essay_writing'
    ],
    'high school': [
      'world_literature',
      'advanced_poetry',
      'drama_analysis',
      'novel_study',
      'literary_criticism',
      'creative_writing',
      'cultural_texts',
      'modern_literature'
    ]
  }
};

// Human-readable subtopic names
export const subtopicNames = {
  // Math subtopics
  addition_and_subtraction: 'Addition and Subtraction',
  multiplication_and_division: 'Multiplication and Division',
  fractions: 'Fractions',
  decimals: 'Decimals',
  basic_geometry: 'Basic Geometry',
  measurement: 'Measurement',
  time_and_money: 'Time and Money',
  patterns_and_sequences: 'Patterns and Sequences',
  algebra_basics: 'Algebra Basics',
  geometry: 'Geometry',
  fractions_and_decimals: 'Fractions and Decimals',
  percentages: 'Percentages',
  ratios_and_proportions: 'Ratios and Proportions',
  data_and_statistics: 'Data and Statistics',
  basic_trigonometry: 'Basic Trigonometry',
  number_systems: 'Number Systems',
  advanced_algebra: 'Advanced Algebra',
  calculus_basics: 'Calculus Basics',
  trigonometry: 'Trigonometry',
  probability_and_statistics: 'Probability and Statistics',
  coordinate_geometry: 'Coordinate Geometry',
  mathematical_modeling: 'Mathematical Modeling',
  number_theory: 'Number Theory',
  linear_programming: 'Linear Programming',

  // Science subtopics
  plants_and_animals: 'Plants and Animals',
  weather_and_climate: 'Weather and Climate',
  simple_machines: 'Simple Machines',
  matter_and_energy: 'Matter and Energy',
  earth_and_space: 'Earth and Space',
  human_body: 'Human Body',
  ecosystems: 'Ecosystems',
  forces_and_motion: 'Forces and Motion',
  chemistry_basics: 'Chemistry Basics',
  physics_fundamentals: 'Physics Fundamentals',
  biology_cells: 'Biology - Cells',
  earth_science: 'Earth Science',
  energy_and_heat: 'Energy and Heat',
  light_and_sound: 'Light and Sound',
  genetics_basics: 'Genetics Basics',
  environmental_science: 'Environmental Science',
  organic_chemistry: 'Organic Chemistry',
  advanced_physics: 'Advanced Physics',
  molecular_biology: 'Molecular Biology',
  astronomy: 'Astronomy',
  thermodynamics: 'Thermodynamics',
  electromagnetism: 'Electromagnetism',
  evolution: 'Evolution',
  biotechnology: 'Biotechnology',

  // History subtopics
  ancient_civilizations: 'Ancient Civilizations',
  medieval_periods: 'Medieval Periods',
  exploration_and_discovery: 'Exploration and Discovery',
  independence_movements: 'Independence Movements',
  world_wars: 'World Wars',
  cultural_heritage: 'Cultural Heritage',
  famous_leaders: 'Famous Leaders',
  important_events: 'Important Events',
  ancient_india: 'Ancient India',
  medieval_india: 'Medieval India',
  colonial_period: 'Colonial Period',
  freedom_struggle: 'Freedom Struggle',
  world_history: 'World History',
  cultural_evolution: 'Cultural Evolution',
  social_movements: 'Social Movements',
  economic_history: 'Economic History',
  modern_history: 'Modern History',
  cold_war: 'Cold War',
  globalization: 'Globalization',
  contemporary_issues: 'Contemporary Issues',

  // Literature subtopics
  folk_tales: 'Folk Tales',
  poetry_basics: 'Poetry Basics',
  story_elements: 'Story Elements',
  character_development: 'Character Development',
  reading_comprehension: 'Reading Comprehension',
  creative_writing: 'Creative Writing',
  cultural_stories: 'Cultural Stories',
  moral_tales: 'Moral Tales',
  classical_literature: 'Classical Literature',
  poetry_analysis: 'Poetry Analysis',
  drama_and_theater: 'Drama and Theater',
  short_stories: 'Short Stories',
  literary_devices: 'Literary Devices',
  cultural_poetry: 'Cultural Poetry',
  biographies: 'Biographies',
  essay_writing: 'Essay Writing',
  world_literature: 'World Literature',
  advanced_poetry: 'Advanced Poetry',
  drama_analysis: 'Drama Analysis',
  novel_study: 'Novel Study',
  literary_criticism: 'Literary Criticism',
  cultural_texts: 'Cultural Texts',
  modern_literature: 'Modern Literature'
};

// Get subtopics for a specific subject and level
export const getSubtopics = (subject: string, level: string): string[] => {
  return subjectSubtopics[subject as keyof typeof subjectSubtopics]?.[level as keyof typeof subjectSubtopics.math] || [];
};

// Get human-readable name for a subtopic
export const getSubtopicName = (subtopic: string): string => {
  return subtopicNames[subtopic as keyof typeof subtopicNames] || subtopic;
}; 