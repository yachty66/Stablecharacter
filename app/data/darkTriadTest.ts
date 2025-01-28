export const questions = [
  {
    id: 1,
    question: "It's not wise to tell your secrets.",
    type: "M",
    math: "+",
  },
  {
    id: 2,
    question: "People see me as a natural leader.",
    type: "M",
    math: "+",
  },
  {
    id: 3,
    question: "I like to get revenge on authorities.",
    type: "P",
    math: "+",
  },
  {
    id: 4,
    question: "I like to use clever manipulation to get my way.",
    type: "M",
    math: "+",
  },
  {
    id: 5,
    question: "I hate being the center of attention.",
    type: "N",
    math: "-",
  },
  {
    id: 6,
    question: "I avoid dangerous situations.",
    type: "P",
    math: "-",
  },
  {
    id: 7,
    question:
      "Whatever it takes, you must get the important people on your side.",
    type: "M",
    math: "+",
  },
  {
    id: 8,
    question: "Many group activities tend to be dull without me.",
    type: "N",
    math: "+",
  },
  {
    id: 9,
    question: "Payback needs to be quick and nasty.",
    type: "P",
    math: "+",
  },
  {
    id: 10,
    question:
      "Avoid direct conflict with others because they may be useful in the future.",
    type: "M",
    math: "+",
  },
  {
    id: 11,
    question: "I know that I am special because everyone keeps telling me so.",
    type: "N",
    math: "+",
  },
  {
    id: 12,
    question: "People often say I'm out of control.",
    type: "P",
    math: "+",
  },
  {
    id: 13,
    question:
      "It's wise to keep track of information that you can use against people later.",
    type: "M",
    math: "+",
  },
  {
    id: 14,
    question: "I like to get acquainted with important people.",
    type: "M",
    math: "+",
  },
  {
    id: 15,
    question: "It's true that I can be mean to others.",
    type: "P",
    math: "+",
  },
  {
    id: 16,
    question: "You should wait for the right time to get back at people.",
    type: "P",
    math: "+",
  },
  {
    id: 17,
    question: "I feel embarrassed if someone compliments me.",
    type: "N",
    math: "-",
  },
  {
    id: 18,
    question: "People who mess with me always regret it.",
    type: "P",
    math: "+",
  },
  {
    id: 19,
    question:
      "There are things you should hide from other people because they don't need to know.",
    type: "M",
    math: "+",
  },
  {
    id: 20,
    question: "I have been compared to famous people.",
    type: "N",
    math: "+",
  },
  {
    id: 21,
    question: "I have never gotten into trouble with the law.",
    type: "P",
    math: "-",
  },
  {
    id: 22,
    question: "Make sure your plans benefit you, not others.",
    type: "M",
    math: "+",
  },
  {
    id: 23,
    question: "I am an average person.",
    type: "N",
    math: "-",
  },
  {
    id: 24,
    question: "I enjoy having sex with people I hardly know.",
    type: "P",
    math: "+",
  },
  {
    id: 25,
    question: "Most people can be manipulated.",
    type: "M",
    math: "+",
  },
  {
    id: 26,
    question: "I insist on getting the respect I deserve.",
    type: "N",
    math: "+",
  },
  {
    id: 27,
    question: "I'll say anything to get what I want.",
    type: "P",
    math: "+",
  },
];

export const traitDescriptions = {
  M: {
    title: "Machiavellianism",
    description:
      "Tendency to manipulate and deceive others for personal gain. High scorers are more likely to use strategic thinking and manipulation to achieve their goals.",
  },
  N: {
    title: "Narcissism",
    description:
      "Excessive need for admiration and a grandiose sense of self-importance. High scorers tend to have an inflated sense of their own importance and a deep need for attention and admiration.",
  },
  P: {
    title: "Psychopathy",
    description:
      "Lack of empathy and remorse, combined with impulsive behavior. High scorers tend to show reduced empathy and fear, with increased impulsivity and thrill-seeking behavior.",
  },
} as const;

export const traitOrder = [
  { number: "M", name: "Machiavellianism" },
  { number: "N", name: "Narcissism" },
  { number: "P", name: "Psychopathy" },
];
