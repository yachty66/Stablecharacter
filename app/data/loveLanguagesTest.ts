export interface LoveLanguageQuestion {
  id: number;
  option1: {
    text: string;
    type: "W" | "S" | "G" | "T" | "P";
  };
  option2: {
    text: string;
    type: "W" | "S" | "G" | "T" | "P";
  };
}

export const questions: LoveLanguageQuestion[] = [
  {
    id: 1,
    option1: {
      text: "I like to receive encouraging or loving notes for no special reason.",
      type: "W",
    },
    option2: {
      text: "I like to be hugged.",
      type: "P",
    },
  },
  {
    id: 2,
    option1: {
      text: "I like to spend one-on-one time with a person who is special to me.",
      type: "T",
    },
    option2: {
      text: "I feel loved when someone gives me practical help.",
      type: "S",
    },
  },
  {
    id: 3,
    option1: {
      text: "I like it when people give me gifts.",
      type: "G",
    },
    option2: {
      text: "I like leisurely visits with friends and loved ones.",
      type: "T",
    },
  },
  {
    id: 4,
    option1: {
      text: "I feel loved when people do things to help me, like doing the laundry or cooking a meal.",
      type: "S",
    },
    option2: {
      text: "I feel loved when people give me a reassuring hugs or pats on the back.",
      type: "P",
    },
  },
  {
    id: 5,
    option1: {
      text: "I feel loved when someone I love or admire puts their arm around me.",
      type: "P",
    },
    option2: {
      text: "I feel loved when I receive a gift from someone who is important to me.",
      type: "G",
    },
  },
  {
    id: 6,
    option1: {
      text: "I like to go places with friends or loved ones.",
      type: "T",
    },
    option2: {
      text: 'I like to shake hands, give "high fives" or hold hands with people who are special to me.',
      type: "P",
    },
  },
  {
    id: 7,
    option1: {
      text: "Visible symbols of love (such as gifts) are important to me.",
      type: "G",
    },
    option2: {
      text: "I feel loved when people say kind or supportive things to me.",
      type: "W",
    },
  },
  {
    id: 8,
    option1: {
      text: "I like to sit close to people I enjoy being around.",
      type: "P",
    },
    option2: {
      text: "I like it when people tell me I'm attractive or handsome.",
      type: "W",
    },
  },
  {
    id: 9,
    option1: {
      text: "I like to spend time with friends and loved ones.",
      type: "T",
    },
    option2: {
      text: "I like to receive gifts from friends and loved ones.",
      type: "G",
    },
  },
  {
    id: 10,
    option1: {
      text: "Words of acceptance are important to me.",
      type: "W",
    },
    option2: {
      text: "I know someone loves me when he or she helps me.",
      type: "S",
    },
  },
  {
    id: 11,
    option1: {
      text: "I like being together and doing things with friends and loved ones.",
      type: "T",
    },
    option2: {
      text: "I like it when kind words are spoken to me.",
      type: "W",
    },
  },
  {
    id: 12,
    option1: {
      text: "What someone does affects me more than what they say.",
      type: "S",
    },
    option2: {
      text: "Hugs make me feel connected and valued.",
      type: "P",
    },
  },
  {
    id: 13,
    option1: {
      text: "I value praise and try to avoid criticism.",
      type: "W",
    },
    option2: {
      text: "Several small gifts mean more to me than one large gift.",
      type: "G",
    },
  },
  {
    id: 14,
    option1: {
      text: "I feel close to someone when we are talking or doing something together.",
      type: "T",
    },
    option2: {
      text: "I feel closer to friends and loved ones when we hug or shake hands.",
      type: "P",
    },
  },
  {
    id: 15,
    option1: {
      text: "I like for people to compliment my achievements.",
      type: "W",
    },
    option2: {
      text: "I know people love me when they do things for me they don't enjoy doing.",
      type: "S",
    },
  },
  {
    id: 16,
    option1: {
      text: "I like physical touch from friends and loved ones when I'm around them.",
      type: "P",
    },
    option2: {
      text: "I like when people listen to me and show genuine interest in what I'm saying.",
      type: "W",
    },
  },
  {
    id: 17,
    option1: {
      text: "I feel loved when friends and loved ones help me with jobs or projects.",
      type: "S",
    },
    option2: {
      text: "I really enjoy receiving gifts from friends and loved ones.",
      type: "G",
    },
  },
  {
    id: 18,
    option1: {
      text: "I like for people to compliment my appearance.",
      type: "W",
    },
    option2: {
      text: "I feel loved when people take time to understand my feelings.",
      type: "T",
    },
  },
  {
    id: 19,
    option1: {
      text: "I feel secure when a special person is physically close to me.",
      type: "P",
    },
    option2: {
      text: "Acts of service make me feel loved.",
      type: "S",
    },
  },
  {
    id: 20,
    option1: {
      text: "I appreciate the many things that special people do for me.",
      type: "S",
    },
    option2: {
      text: "I like receiving gifts that special people make for me.",
      type: "G",
    },
  },
  {
    id: 21,
    option1: {
      text: "I really enjoy the feeling I get when someone gives me undivided attention.",
      type: "T",
    },
    option2: {
      text: "I really enjoy the feeling I get when someone does an act of service for me.",
      type: "S",
    },
  },
  {
    id: 22,
    option1: {
      text: "I like it when a person celebrates my birthday with a gift.",
      type: "G",
    },
    option2: {
      text: "I like it when a person tells meaningful words to me on my birthday.",
      type: "W",
    },
  },
  {
    id: 23,
    option1: {
      text: "I know a person is thinking of me when they give me a gift.",
      type: "G",
    },
    option2: {
      text: "I feel loved when a person helps me with my chores or tasks.",
      type: "S",
    },
  },
  {
    id: 24,
    option1: {
      text: "I appreciate it when someone listens patiently and doesn't interrupt me.",
      type: "T",
    },
    option2: {
      text: "I appreciate it when someone remembers special days with a gift.",
      type: "G",
    },
  },
  {
    id: 25,
    option1: {
      text: "I like knowing loved ones are concerned enough to help with my daily tasks.",
      type: "S",
    },
    option2: {
      text: "I enjoy extended trips with someone who is special to me.",
      type: "T",
    },
  },
  {
    id: 26,
    option1: {
      text: "I don't mind physical affection from friends I am close to.",
      type: "P",
    },
    option2: {
      text: "Receiving a gift given for no special reason excites me.",
      type: "G",
    },
  },
  {
    id: 27,
    option1: {
      text: "I like to be told that I am appreciated.",
      type: "W",
    },
    option2: {
      text: "I like for a person to look at me when we are talking.",
      type: "T",
    },
  },
  {
    id: 28,
    option1: {
      text: "Gifts from a friend or loved one are always special to me.",
      type: "G",
    },
    option2: {
      text: "I feel good when a friend or loved one hugs or touches me.",
      type: "P",
    },
  },
  {
    id: 29,
    option1: {
      text: "I feel loved when a person enthusiastically does some task I have requested.",
      type: "S",
    },
    option2: {
      text: "I feel loved when I am told how much I am appreciated.",
      type: "W",
    },
  },
  {
    id: 30,
    option1: {
      text: "I need physical contact with people every day.",
      type: "P",
    },
    option2: {
      text: "I need words of encouragement and affirmation every day.",
      type: "W",
    },
  },
];

export const traitDescriptions = {
  W: {
    title: "Words of Affirmation",
    description:
      "You value verbal expressions of love, including compliments, words of appreciation, and verbal encouragement. Written and spoken words make you feel most valued and understood.",
  },
  S: {
    title: "Acts of Service",
    description:
      "You feel most loved when others do things to help you. Actions speak louder than words, and you appreciate when someone goes out of their way to make your life easier.",
  },
  G: {
    title: "Receiving Gifts",
    description:
      "You feel most loved through tangible expressions of love. The thought, effort, and symbolic value behind gifts make you feel appreciated and valued.",
  },
  T: {
    title: "Quality Time",
    description:
      "You feel most loved when others give you their undivided attention. Meaningful conversations and shared activities make you feel particularly valued.",
  },
  P: {
    title: "Physical Touch",
    description:
      "You feel most loved through physical expressions of affection. Hugs, pats on the back, holding hands, and thoughtful touches make you feel appreciated.",
  },
} as const;