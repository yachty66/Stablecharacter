interface MBTIFunction {
  name: string;
  role: string;
  description: string;
}

interface MBTIType {
  name: string;
  description: string;
  functions: MBTIFunction[];
  traits: string[];
}

interface MBTITypes {
  [key: string]: MBTIType;
}

const mbtiTypes = {
  INTJ: {
    name: "INTJ",
    description: "Introverted, Intuitive, Thinking, Judging",
    functions: [
      {
        name: "Introverted Intuition (Ni)",
        role: "Dominant",
        description:
          "Primary function that drives long-term vision and future-oriented thinking",
      },
      {
        name: "Extraverted Thinking (Te)",
        role: "Auxiliary",
        description:
          "Secondary function for logical decision-making and systematic planning",
      },
      {
        name: "Introverted Feeling (Fi)",
        role: "Tertiary",
        description: "Third function for personal values and moral judgments",
      },
      {
        name: "Extraverted Sensing (Se)",
        role: "Inferior",
        description:
          "Fourth function for experiencing and interacting with the immediate environment",
      },
    ],
    traits: [
      "Strategic planning",
      "Analytical thinking",
      "Independent",
      "Knowledge-seeking",
    ],
  },
  INTP: {
    name: "INTP",
    description: "Introverted, Intuitive, Thinking, Perceiving",
    functions: [
      {
        name: "Introverted Thinking (Ti)",
        role: "Dominant",
        description:
          "Primary function for analyzing and creating logical frameworks",
      },
      {
        name: "Extraverted Intuition (Ne)",
        role: "Auxiliary",
        description:
          "Secondary function for exploring possibilities and generating ideas",
      },
      {
        name: "Introverted Sensing (Si)",
        role: "Tertiary",
        description:
          "Third function for organizing information and recalling past experiences",
      },
      {
        name: "Extraverted Feeling (Fe)",
        role: "Inferior",
        description:
          "Fourth function for understanding and connecting with others' emotions",
      },
    ],
    traits: [
      "Logical analysis",
      "Theoretical thinking",
      "Innovation",
      "Problem-solving",
    ],
  },
  ENTJ: {
    name: "ENTJ",
    description: "Extraverted, Intuitive, Thinking, Judging",
    functions: [
      {
        name: "Extraverted Thinking (Te)",
        role: "Dominant",
        description:
          "Primary function for organizing, planning, and executing goals",
      },
      {
        name: "Introverted Intuition (Ni)",
        role: "Auxiliary",
        description:
          "Secondary function for strategic vision and future planning",
      },
      {
        name: "Extraverted Sensing (Se)",
        role: "Tertiary",
        description:
          "Third function for engaging with the immediate environment",
      },
      {
        name: "Introverted Feeling (Fi)",
        role: "Inferior",
        description:
          "Fourth function for processing personal values and emotions",
      },
    ],
    traits: [
      "Leadership",
      "Strategic planning",
      "Efficiency-driven",
      "Goal-oriented",
    ],
  },
  ENTP: {
    name: "ENTP",
    description: "Extraverted, Intuitive, Thinking, Perceiving",
    functions: [
      {
        name: "Extraverted Intuition (Ne)",
        role: "Dominant",
        description:
          "Primary function for generating possibilities and connections",
      },
      {
        name: "Introverted Thinking (Ti)",
        role: "Auxiliary",
        description:
          "Secondary function for analyzing and understanding complex systems",
      },
      {
        name: "Extraverted Feeling (Fe)",
        role: "Tertiary",
        description:
          "Third function for understanding group dynamics and social interaction",
      },
      {
        name: "Introverted Sensing (Si)",
        role: "Inferior",
        description: "Fourth function for maintaining stability and routine",
      },
    ],
    traits: ["Innovation", "Debate", "Adaptability", "Quick thinking"],
  },
  INFJ: {
    name: "INFJ",
    description: "Introverted, Intuitive, Feeling, Judging",
    functions: [
      {
        name: "Introverted Intuition (Ni)",
        role: "Dominant",
        description:
          "Primary function for understanding patterns and future implications",
      },
      {
        name: "Extraverted Feeling (Fe)",
        role: "Auxiliary",
        description:
          "Secondary function for understanding and harmonizing with others' emotions",
      },
      {
        name: "Introverted Thinking (Ti)",
        role: "Tertiary",
        description:
          "Third function for analyzing and making sense of information",
      },
      {
        name: "Extraverted Sensing (Se)",
        role: "Inferior",
        description:
          "Fourth function for experiencing and engaging with the present moment",
      },
    ],
    traits: ["Empathetic", "Insightful", "Idealistic", "Complex"],
  },
  INFP: {
    name: "INFP",
    description: "Introverted, Intuitive, Feeling, Perceiving",
    functions: [
      {
        name: "Introverted Feeling (Fi)",
        role: "Dominant",
        description:
          "Primary function for processing personal values and authentic emotions",
      },
      {
        name: "Extraverted Intuition (Ne)",
        role: "Auxiliary",
        description:
          "Secondary function for exploring possibilities and meanings",
      },
      {
        name: "Introverted Sensing (Si)",
        role: "Tertiary",
        description:
          "Third function for recalling past experiences and details",
      },
      {
        name: "Extraverted Thinking (Te)",
        role: "Inferior",
        description: "Fourth function for organizing and implementing plans",
      },
    ],
    traits: ["Idealistic", "Creative", "Authentic", "Value-driven"],
  },
  ENFJ: {
    name: "ENFJ",
    description: "Extraverted, Intuitive, Feeling, Judging",
    functions: [
      {
        name: "Extraverted Feeling (Fe)",
        role: "Dominant",
        description:
          "Primary function for understanding and influencing group dynamics",
      },
      {
        name: "Introverted Intuition (Ni)",
        role: "Auxiliary",
        description:
          "Secondary function for understanding patterns and future implications",
      },
      {
        name: "Extraverted Sensing (Se)",
        role: "Tertiary",
        description:
          "Third function for engaging with the immediate environment",
      },
      {
        name: "Introverted Thinking (Ti)",
        role: "Inferior",
        description:
          "Fourth function for analyzing and making logical decisions",
      },
    ],
    traits: ["Charismatic", "Empathetic", "Inspiring", "People-focused"],
  },
  ENFP: {
    name: "ENFP",
    description: "Extraverted, Intuitive, Feeling, Perceiving",
    functions: [
      {
        name: "Extraverted Intuition (Ne)",
        role: "Dominant",
        description:
          "Primary function for exploring possibilities and connections",
      },
      {
        name: "Introverted Feeling (Fi)",
        role: "Auxiliary",
        description:
          "Secondary function for processing personal values and authenticity",
      },
      {
        name: "Extraverted Thinking (Te)",
        role: "Tertiary",
        description: "Third function for organizing and implementing ideas",
      },
      {
        name: "Introverted Sensing (Si)",
        role: "Inferior",
        description: "Fourth function for maintaining stability and routine",
      },
    ],
    traits: ["Enthusiastic", "Creative", "Sociable", "Optimistic"],
  },
  ISTJ: {
    name: "ISTJ",
    description: "Introverted, Sensing, Thinking, Judging",
    functions: [
      {
        name: "Introverted Sensing (Si)",
        role: "Dominant",
        description:
          "Primary function for recalling details and maintaining established systems",
      },
      {
        name: "Extraverted Thinking (Te)",
        role: "Auxiliary",
        description:
          "Secondary function for organizing and implementing logical solutions",
      },
      {
        name: "Introverted Feeling (Fi)",
        role: "Tertiary",
        description: "Third function for processing personal values and ethics",
      },
      {
        name: "Extraverted Intuition (Ne)",
        role: "Inferior",
        description:
          "Fourth function for considering new possibilities and alternatives",
      },
    ],
    traits: ["Reliable", "Organized", "Practical", "Detail-oriented"],
  },
  ISFJ: {
    name: "ISFJ",
    description: "Introverted, Sensing, Feeling, Judging",
    functions: [
      {
        name: "Introverted Sensing (Si)",
        role: "Dominant",
        description:
          "Primary function for maintaining traditions and remembering details",
      },
      {
        name: "Extraverted Feeling (Fe)",
        role: "Auxiliary",
        description:
          "Secondary function for understanding and meeting others' needs",
      },
      {
        name: "Introverted Thinking (Ti)",
        role: "Tertiary",
        description:
          "Third function for analyzing and making sense of information",
      },
      {
        name: "Extraverted Intuition (Ne)",
        role: "Inferior",
        description: "Fourth function for exploring new possibilities",
      },
    ],
    traits: ["Nurturing", "Dependable", "Traditional", "Service-oriented"],
  },
  ESTJ: {
    name: "ESTJ",
    description: "Extraverted, Sensing, Thinking, Judging",
    functions: [
      {
        name: "Extraverted Thinking (Te)",
        role: "Dominant",
        description:
          "Primary function for organizing and implementing efficient systems",
      },
      {
        name: "Introverted Sensing (Si)",
        role: "Auxiliary",
        description:
          "Secondary function for maintaining established procedures",
      },
      {
        name: "Extraverted Intuition (Ne)",
        role: "Tertiary",
        description: "Third function for considering new approaches",
      },
      {
        name: "Introverted Feeling (Fi)",
        role: "Inferior",
        description:
          "Fourth function for processing personal values and emotions",
      },
    ],
    traits: ["Organized", "Practical", "Direct", "Traditional"],
  },
  ESFJ: {
    name: "ESFJ",
    description: "Extraverted, Sensing, Feeling, Judging",
    functions: [
      {
        name: "Extraverted Feeling (Fe)",
        role: "Dominant",
        description:
          "Primary function for harmonizing with and supporting others",
      },
      {
        name: "Introverted Sensing (Si)",
        role: "Auxiliary",
        description:
          "Secondary function for maintaining traditions and stability",
      },
      {
        name: "Extraverted Intuition (Ne)",
        role: "Tertiary",
        description: "Third function for exploring new social possibilities",
      },
      {
        name: "Introverted Thinking (Ti)",
        role: "Inferior",
        description:
          "Fourth function for analyzing and making logical decisions",
      },
    ],
    traits: ["Supportive", "Responsible", "Cooperative", "Traditional"],
  },
  ISTP: {
    name: "ISTP",
    description: "Introverted, Sensing, Thinking, Perceiving",
    functions: [
      {
        name: "Introverted Thinking (Ti)",
        role: "Dominant",
        description:
          "Primary function for analyzing mechanics and logical systems",
      },
      {
        name: "Extraverted Sensing (Se)",
        role: "Auxiliary",
        description:
          "Secondary function for engaging with the immediate environment and hands-on experiences",
      },
      {
        name: "Introverted Intuition (Ni)",
        role: "Tertiary",
        description:
          "Third function for understanding underlying patterns and implications",
      },
      {
        name: "Extraverted Feeling (Fe)",
        role: "Inferior",
        description:
          "Fourth function for connecting with others' emotions and social harmony",
      },
    ],
    traits: ["Practical", "Adaptable", "Technical", "Action-oriented"],
  },
  ISFP: {
    name: "ISFP",
    description: "Introverted, Sensing, Feeling, Perceiving",
    functions: [
      {
        name: "Introverted Feeling (Fi)",
        role: "Dominant",
        description:
          "Primary function for processing personal values and aesthetic appreciation",
      },
      {
        name: "Extraverted Sensing (Se)",
        role: "Auxiliary",
        description:
          "Secondary function for experiencing and engaging with the present moment",
      },
      {
        name: "Introverted Intuition (Ni)",
        role: "Tertiary",
        description:
          "Third function for understanding deeper meanings and future implications",
      },
      {
        name: "Extraverted Thinking (Te)",
        role: "Inferior",
        description: "Fourth function for organizing and implementing plans",
      },
    ],
    traits: ["Artistic", "Sensitive", "Spontaneous", "Experiential"],
  },
  ESTP: {
    name: "ESTP",
    description: "Extraverted, Sensing, Thinking, Perceiving",
    functions: [
      {
        name: "Extraverted Sensing (Se)",
        role: "Dominant",
        description:
          "Primary function for engaging with immediate experiences and opportunities",
      },
      {
        name: "Introverted Thinking (Ti)",
        role: "Auxiliary",
        description:
          "Secondary function for analyzing and understanding systems",
      },
      {
        name: "Extraverted Feeling (Fe)",
        role: "Tertiary",
        description:
          "Third function for navigating social situations and group dynamics",
      },
      {
        name: "Introverted Intuition (Ni)",
        role: "Inferior",
        description: "Fourth function for perceiving long-term implications",
      },
    ],
    traits: ["Energetic", "Pragmatic", "Risk-taking", "Resourceful"],
  },
  ESFP: {
    name: "ESFP",
    description: "Extraverted, Sensing, Feeling, Perceiving",
    functions: [
      {
        name: "Extraverted Sensing (Se)",
        role: "Dominant",
        description:
          "Primary function for experiencing and embracing the present moment",
      },
      {
        name: "Introverted Feeling (Fi)",
        role: "Auxiliary",
        description:
          "Secondary function for processing personal values and authenticity",
      },
      {
        name: "Extraverted Thinking (Te)",
        role: "Tertiary",
        description: "Third function for organizing and implementing actions",
      },
      {
        name: "Introverted Intuition (Ni)",
        role: "Inferior",
        description: "Fourth function for understanding future implications",
      },
    ],
    traits: ["Enthusiastic", "Spontaneous", "Entertaining", "Present-focused"],
  },
  // Add other MBTI types as needed
};

export default mbtiTypes;