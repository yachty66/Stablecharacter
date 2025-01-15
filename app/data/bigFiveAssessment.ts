export interface AssessmentQuestion {
  question: string;
  type: number;
  math: "+" | "-";
}

export const assessment: AssessmentQuestion[] = [
  { question: "I am the life of the party.", type: 1, math: "+" },
  { question: "I feel little concern for others.", type: 2, math: "-" },
  { question: "I am always prepared.", type: 3, math: "+" },
  { question: "I get stressed out easily.", type: 4, math: "-" },
  { question: "I have a rich vocabulary.", type: 5, math: "+" },
  { question: "I don't talk a lot.", type: 1, math: "-" },
  { question: "I am interested in people.", type: 2, math: "+" },
  { question: "I leave my belongings around.", type: 3, math: "-" },
  { question: "I am relaxed most of the time.", type: 4, math: "+" },
  {
    question: "I have difficulty understanding abstract ideas.",
    type: 5,
    math: "-",
  },
  { question: "I feel comfortable around people.", type: 1, math: "+" },
  { question: "I insult people.", type: 2, math: "-" },
  { question: "I pay attention to details.", type: 3, math: "+" },
  { question: "I worry about things.", type: 4, math: "-" },
  { question: "I have a vivid imagination.", type: 5, math: "+" },
  { question: "I keep in the background.", type: 1, math: "-" },
  { question: "I sympathize with others' feelings.", type: 2, math: "+" },
  { question: "I make a mess of things.", type: 3, math: "-" },
  { question: "I seldom feel blue.", type: 4, math: "+" },
  { question: "I am not interested in abstract ideas.", type: 5, math: "-" },
  { question: "I start conversations.", type: 1, math: "+" },
  {
    question: "I am not interested in other people's problems.",
    type: 2,
    math: "-",
  },
  { question: "I get chores done right away.", type: 3, math: "+" },
  { question: "I am easily disturbed.", type: 4, math: "-" },
  { question: "I have excellent ideas.", type: 5, math: "+" },
  { question: "I have little to say.", type: 1, math: "-" },
  { question: "I have a soft heart.", type: 2, math: "+" },
  {
    question: "I often forget to put things back in their proper place.",
    type: 3,
    math: "-",
  },
  { question: "I get upset easily.", type: 4, math: "-" },
  { question: "I do not have a good imagination.", type: 5, math: "-" },
  {
    question: "I talk to a lot of different people at parties.",
    type: 1,
    math: "+",
  },
  { question: "I am not really interested in others.", type: 2, math: "-" },
  { question: "I like order.", type: 3, math: "+" },
  { question: "I change my mood a lot.", type: 4, math: "-" },
  { question: "I am quick to understand things.", type: 5, math: "+" },
  { question: "I don't like to draw attention to myself.", type: 1, math: "-" },
  { question: "I take time out for others.", type: 2, math: "+" },
  { question: "I shirk my duties.", type: 3, math: "-" },
  { question: "I have frequent mood swings.", type: 4, math: "-" },
  { question: "I use difficult words.", type: 5, math: "+" },
  {
    question: "I don't mind being the center of attention.",
    type: 1,
    math: "+",
  },
  { question: "I feel others' emotions.", type: 2, math: "+" },
  { question: "I follow a schedule.", type: 3, math: "+" },
  { question: "I get irritated easily.", type: 4, math: "-" },
  { question: "I spend time reflecting on things.", type: 5, math: "+" },
  { question: "I am quiet around strangers.", type: 1, math: "-" },
  { question: "I make people feel at ease.", type: 2, math: "+" },
  { question: "I am exacting in my work.", type: 3, math: "+" },
  { question: "I often feel blue.", type: 4, math: "-" },
  { question: "I am full of ideas.", type: 5, math: "+" },
];

export const traitDescriptions = {
  1: {
    title: "Extraversion",
    description:
      "Extraversion reflects a tendency to seek social interaction and stimulation. High scorers tend to be outgoing, energetic, and assertive in social situations. They typically enjoy being around others and actively seek out social experiences. Lower scorers tend to be more reserved and may prefer smaller social gatherings or solitary activities.",
  },
  2: {
    title: "Emotional Stability",
    description:
      "Emotional Stability (opposite of Neuroticism) indicates how one manages emotions and stress. High scorers tend to be calm, resilient, and even-tempered, handling stress well and maintaining emotional balance. Lower scorers may experience more emotional ups and downs and be more sensitive to stress.",
  },
  3: {
    title: "Agreeableness",
    description:
      "Agreeableness reflects how people interact with others. High scorers tend to be cooperative, compassionate, and considerate of others' feelings. They typically value harmony and maintain positive relationships. Lower scorers may be more competitive and skeptical in their interactions.",
  },
  4: {
    title: "Conscientiousness",
    description:
      "Conscientiousness shows how organized and goal-directed someone is. High scorers tend to be responsible, organized, and thorough in their tasks. They usually plan ahead and pay attention to details. Lower scorers tend to be more flexible and spontaneous but might be less structured.",
  },
  5: {
    title: "Intellect/Imagination",
    description:
      "Also known as Openness to Experience, this trait reflects curiosity and creativity. High scorers tend to be imaginative, intellectually curious, and appreciative of art and new ideas. They often seek out novel experiences. Lower scorers tend to prefer familiar routines and conventional approaches.",
  },
} as const;

export const answerOptions = [
  { value: 1, label: "Very Inaccurate" },
  { value: 2, label: "Moderately Inaccurate" },
  { value: 3, label: "Neither Accurate Nor Inaccurate" },
  { value: 4, label: "Moderately Accurate" },
  { value: 5, label: "Very Accurate" },
] as const;

export const helpText = `
Describe yourself as you generally are now, not as you wish to be in the future.
Describe yourself as you honestly see yourself, in relation to other people you know of the same sex as you are, and roughly your same age.
So that you can describe yourself in an honest manner, your responses will be kept in absolute confidence.

Indicate for each statement which answer best fits as a description of you:
1. Very Inaccurate
2. Moderately Inaccurate
3. Neither Accurate Nor Inaccurate
4. Moderately Accurate
5. Very Accurate
`;
