export interface QuestionOption {
  text: string;
  value: string;
  icon?: string;
}

export interface SliderAttribute {
  key: string;
  label: string;
  min: number;
  max: number;
  default: number;
}

export interface Question {
  id: string;
  question: string;
  subtitle?: string;
  type?: 'radio' | 'sliderGroup';
  options?: QuestionOption[];
  attributes?: SliderAttribute[];
  weight: number;
}

export const racquetQuestions: Question[] = [
  {
    id: "level",
    question: "What's your tennis experience level?",
    subtitle: "This is the most important factor in finding your ideal racket.",
    options: [
      { text: "Beginner", value: "Beginner", icon: "🌱" },
      { text: "Intermediate", value: "Intermediate", icon: "🎾" },
      { text: "Advanced / Competitive", value: "Advanced", icon: "🏆" },
    ],
    weight: 0.22,
  },
  {
    id: "ageRange",
    question: "What's your age range?",
    subtitle: "Age influences the ideal weight and comfort level of your racket.",
    options: [
      { text: "Junior (under 17)", value: "Junior", icon: "👦" },
      { text: "Adult (18–49)", value: "Adult", icon: "🧑" },
      { text: "Senior (50+)", value: "Senior", icon: "🧓" },
    ],
    weight: 0.08,
  },
  {
    id: "physicality",
    question: "How would you describe your physical build?",
    subtitle: "Your strength helps determine the ideal racket weight.",
    options: [
      { text: "Slim / Light", value: "Light", icon: "🪶" },
      { text: "Average / Athletic", value: "Athletic", icon: "💪" },
      { text: "Strong / Heavy", value: "Strong", icon: "🦾" },
    ],
    weight: 0.10,
  },
  {
    id: "swingStyle",
    question: "How would you describe your swing style?",
    subtitle: "A fast, full swing generates its own power. A compact swing needs more help from the racket.",
    options: [
      { text: "Long & Fast", value: "Fast-Full", icon: "⚡" },
      { text: "Medium & Fluid", value: "Medium-Paced", icon: "🌊" },
      { text: "Short & Compact", value: "Short-Compact", icon: "🎯" },
    ],
    weight: 0.18,
  },
  {
    id: "strokeType",
    question: "What's your dominant shot type?",
    subtitle: "This helps determine the ideal string pattern for you.",
    options: [
      { text: "Heavy Topspin", value: "Topspin", icon: "🌀" },
      { text: "Flat / Aggressive", value: "Flat", icon: "➡️" },
      { text: "Varied / Slice", value: "Varied", icon: "🔄" },
    ],
    weight: 0.10,
  },
  {
    id: "backhand",
    question: "What type of backhand do you use?",
    subtitle: "One-handed backhands benefit from more maneuverable rackets with better feel.",
    options: [
      { text: "One-handed", value: "One-handed", icon: "☝️" },
      { text: "Two-handed", value: "Two-handed", icon: "✌️" },
      { text: "Still developing", value: "Any", icon: "🤷" },
    ],
    weight: 0.05,
  },
  {
    id: "commonMiss",
    question: "What's your most common mistake?",
    subtitle: "This tells us whether you need more control, power, or stability.",
    options: [
      { text: "Ball goes long (too much power)", value: "MissLong", icon: "📏" },
      { text: "Ball hits the net (not enough power)", value: "MissNet", icon: "🥅" },
      { text: "Ball goes wide (no direction)", value: "MissWide", icon: "↔️" },
      { text: "No consistent pattern", value: "Any", icon: "🤷" },
    ],
    weight: 0.12,
  },
  {
    id: "feelWeights",
    question: "What do you value most in a racket?",
    subtitle: "Drag the sliders to set the importance of each attribute.",
    type: "sliderGroup",
    attributes: [
      { key: "Comfort", label: "Comfort", min: 1, max: 5, default: 3 },
      { key: "Stability", label: "Stability", min: 1, max: 5, default: 3 },
      { key: "Maneuverability", label: "Maneuverability", min: 1, max: 5, default: 3 },
      { key: "Power", label: "Power", min: 1, max: 5, default: 3 },
      { key: "Control", label: "Control", min: 1, max: 5, default: 3 },
    ],
    weight: 0.12,
  },
  {
    id: "injuries",
    question: "Do you have any arm issues?",
    subtitle: "This is crucial for recommending the right frame stiffness.",
    options: [
      { text: "No arm issues", value: "None", icon: "✅" },
      { text: "Tennis elbow", value: "Elbow", icon: "🦾" },
      { text: "Shoulder or wrist pain", value: "Shoulder-Wrist", icon: "😣" },
      { text: "Yes, but unsure where", value: "Any-Pain", icon: "⚠️" },
    ],
    weight: 0.05,
  },
];

export const stringQuestions: Question[] = [
  {
    id: "level",
    question: "What's your tennis experience level?",
    subtitle: "Your level determines the type of string that will benefit you most.",
    options: [
      { text: "Beginner", value: "Beginner", icon: "🌱" },
      { text: "Intermediate", value: "Intermediate", icon: "🎾" },
      { text: "Advanced / Competitive", value: "Advanced", icon: "🏆" },
    ],
    weight: 0.20,
  },
  {
    id: "swingStyle",
    question: "How would you describe your swing speed?",
    subtitle: "Faster swings benefit from control-oriented strings; slower swings need more power.",
    options: [
      { text: "Fast & Aggressive", value: "Fast/Full", icon: "⚡" },
      { text: "Medium", value: "Medium", icon: "🌊" },
      { text: "Slow / Compact", value: "Compact", icon: "🎯" },
    ],
    weight: 0.18,
  },
  {
    id: "stringFeel",
    question: "What feel do you prefer from your strings?",
    subtitle: "This is a personal preference that affects your playing experience.",
    options: [
      { text: "Soft & Comfortable", value: "Soft", icon: "🛋️" },
      { text: "Crisp & Responsive", value: "Crisp", icon: "⚡" },
      { text: "No preference", value: "Neutral", icon: "⚖️" },
    ],
    weight: 0.15,
  },
  {
    id: "priority",
    question: "What's your top priority in strings?",
    subtitle: "Choose what matters most to you.",
    options: [
      { text: "Maximum Spin", value: "Spin", icon: "🌀" },
      { text: "Maximum Control", value: "Control", icon: "🎯" },
      { text: "Maximum Power", value: "Power", icon: "💥" },
      { text: "Maximum Comfort", value: "Comfort", icon: "😌" },
      { text: "Maximum Durability", value: "Durability", icon: "🔩" },
    ],
    weight: 0.20,
  },
  {
    id: "armIssues",
    question: "Do you have any arm issues?",
    subtitle: "Polyester strings are hard on the arm. We'll avoid them if needed.",
    options: [
      { text: "No arm issues", value: "No, I have no arm issues", icon: "✅" },
      { text: "Tennis elbow", value: "Tennis Elbow", icon: "🦾" },
      { text: "Shoulder or wrist pain", value: "Shoulder/Wrist", icon: "😣" },
    ],
    weight: 0.15,
  },
  {
    id: "breakStrings",
    question: "How often do you break strings?",
    subtitle: "Frequent string breakers need more durable options.",
    options: [
      { text: "Rarely (once a year or less)", value: "Rarely", icon: "🐢" },
      { text: "Occasionally (a few times a year)", value: "Sometimes", icon: "📅" },
      { text: "Frequently (monthly or more)", value: "Yes, frequently", icon: "💥" },
    ],
    weight: 0.12,
  },
  {
    id: "budget",
    question: "What's your string budget?",
    subtitle: "Natural gut is premium; polyester is the most affordable.",
    options: [
      { text: "Budget (up to $15)", value: "Up to $15", icon: "💵" },
      { text: "Mid-range ($15–$25)", value: "$15 - $25", icon: "💰" },
      { text: "Premium ($25+)", value: "$25+", icon: "💎" },
    ],
    weight: 0.10,
  },
];
