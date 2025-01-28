export interface AssessmentQuestion {
  question: string;
  type: string; // MBTI category like EI, SN, TF, or JP
  math: "+" | "-";
}

export const assessment: AssessmentQuestion[] = [
  // I/E Questions
  { question: "You regularly make new friends.", type: "EI", math: "-" },
  {
    question:
      "You find the idea of networking or promoting yourself to strangers very daunting.",
    type: "EI",
    math: "+",
  },
  {
    question:
      "You feel comfortable just walking up to someone you find interesting and striking up a conversation.",
    type: "EI",
    math: "-",
  },
  {
    question: "You enjoy participating in team-based activities.",
    type: "EI",
    math: "-",
  },
  {
    question: "You enjoy solitary hobbies or activities more than group ones.",
    type: "EI",
    math: "+",
  },
  {
    question:
      "You usually wait for others to introduce themselves first at social gatherings.",
    type: "EI",
    math: "+",
  },
  {
    question: "You usually prefer to be around others rather than on your own.",
    type: "EI",
    math: "-",
  },
  {
    question: "Your friends would describe you as lively and outgoing.",
    type: "EI",
    math: "-",
  },
  { question: "You avoid making phone calls.", type: "EI", math: "+" },
  {
    question: "You can easily connect with people you have just met.",
    type: "EI",
    math: "-",
  },
  {
    question:
      "You would love a job that requires you to work alone most of the time.",
    type: "EI",
    math: "+",
  },
  {
    question:
      "You feel more drawn to busy, bustling atmospheres than to quiet, intimate places.",
    type: "EI",
    math: "-",
  },

  // // S/N Questions
  // {
  //   question:
  //     "Complex and novel ideas excite you more than simple and straightforward ones.",
  //   type: "SN",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You are not too interested in discussions about various interpretations of creative works.",
  //   type: "SN",
  //   math: "+",
  // },
  // {
  //   question: "You enjoy experimenting with new and untested approaches.",
  //   type: "SN",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You actively seek out new experiences and knowledge areas to explore.",
  //   type: "SN",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You cannot imagine yourself writing fictional stories for a living.",
  //   type: "SN",
  //   math: "+",
  // },
  // { question: "You enjoy debating ethical dilemmas.", type: "SN", math: "-" },
  // {
  //   question:
  //     "You become bored or lose interest when the discussion gets highly theoretical.",
  //   type: "SN",
  //   math: "+",
  // },
  // {
  //   question:
  //     "You are drawn to various forms of creative expression, such as writing.",
  //   type: "SN",
  //   math: "-",
  // },
  // {
  //   question: "You enjoy exploring unfamiliar ideas and viewpoints.",
  //   type: "SN",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You are not too interested in discussing theories on what the world could look like in the future.",
  //   type: "SN",
  //   math: "+",
  // },
  // {
  //   question:
  //     "You believe that pondering abstract philosophical questions is a waste of time.",
  //   type: "SN",
  //   math: "+",
  // },
  // {
  //   question:
  //     "You prefer tasks that require you to come up with creative solutions rather than follow concrete steps.",
  //   type: "SN",
  //   math: "-",
  // },

  // // T/F Questions
  // {
  //   question:
  //     "You usually feel more persuaded by what resonates emotionally with you than by factual arguments.",
  //   type: "TF",
  //   math: "-",
  // },
  // {
  //   question:
  //     "People's stories and emotions speak louder to you than numbers or data.",
  //   type: "TF",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You prioritize facts over people's feelings when determining a course of action.",
  //   type: "TF",
  //   math: "+",
  // },
  // {
  //   question: "You prioritize being sensitive over being completely honest.",
  //   type: "TF",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You favor efficiency in decisions, even if it means disregarding some emotional aspects.",
  //   type: "TF",
  //   math: "+",
  // },
  // {
  //   question:
  //     "In disagreements, you prioritize proving your point over preserving the feelings of others.",
  //   type: "TF",
  //   math: "+",
  // },
  // {
  //   question: "You are not easily swayed by emotional arguments.",
  //   type: "TF",
  //   math: "+",
  // },
  // {
  //   question:
  //     "When facts and feelings conflict, you usually find yourself following your heart.",
  //   type: "TF",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You usually base your choices on objective facts rather than emotional impressions.",
  //   type: "TF",
  //   math: "+",
  // },
  // {
  //   question: "Your emotions control you more than you control them.",
  //   type: "TF",
  //   math: "-",
  // },
  // {
  //   question:
  //     "When making decisions, you focus more on how the affected people might feel than on what is most logical or efficient.",
  //   type: "TF",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You are more likely to rely on emotional intuition than logical reasoning when making a choice.",
  //   type: "TF",
  //   math: "-",
  // },

  // // J/P Questions
  // {
  //   question: "Your living and working spaces are clean and organized.",
  //   type: "JP",
  //   math: "+",
  // },
  // {
  //   question:
  //     "You prioritize and plan tasks effectively, often completing them well before the deadline.",
  //   type: "JP",
  //   math: "+",
  // },
  // {
  //   question: "You like to use organizing tools like schedules and lists.",
  //   type: "JP",
  //   math: "+",
  // },
  // {
  //   question: "You often allow the day to unfold without any schedule at all.",
  //   type: "JP",
  //   math: "-",
  // },
  // {
  //   question: "You prefer to do your chores before allowing yourself to relax.",
  //   type: "JP",
  //   math: "+",
  // },
  // {
  //   question: "You often end up doing things at the last possible moment.",
  //   type: "JP",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You find it challenging to maintain a consistent work or study schedule.",
  //   type: "JP",
  //   math: "-",
  // },
  // {
  //   question: "You like to have a to-do list for each day.",
  //   type: "JP",
  //   math: "+",
  // },
  // {
  //   question:
  //     "If your plans are interrupted, your top priority is to get back on track as soon as possible.",
  //   type: "JP",
  //   math: "+",
  // },
  // {
  //   question:
  //     "Your personal work style is closer to spontaneous bursts of energy than organized and consistent efforts.",
  //   type: "JP",
  //   math: "-",
  // },
  // {
  //   question:
  //     "You complete things methodically without skipping over any steps.",
  //   type: "JP",
  //   math: "+",
  // },
  // { question: "You struggle with deadlines.", type: "JP", math: "-" },
];

export const traitDescriptions = {
  EI: {
    title: "Extraversion vs. Introversion",
    description:
      "Extraversion reflects a preference for social interaction, external stimulation, and action. Introversion reflects a preference for introspection, reflection, and solitary activities.",
  },
  SN: {
    title: "Sensing vs. Intuition",
    description:
      "Sensing reflects a preference for concrete, factual information and practical approaches. Intuition reflects a preference for abstract ideas, possibilities, and innovation.",
  },
  TF: {
    title: "Thinking vs. Feeling",
    description:
      "Thinking reflects a preference for logic and objective decision-making. Feeling reflects a preference for empathy, values, and considering how decisions affect others.",
  },
  JP: {
    title: "Judging vs. Perceiving",
    description:
      "Judging reflects a preference for structure, organization, and planned approaches. Perceiving reflects a preference for spontaneity, adaptability, and flexibility.",
  },
} as const;

export const answerOptions = [
  { value: 1, label: "Strongly Disagree" },
  { value: 2, label: "Disagree" },
  { value: 3, label: "Neutral" },
  { value: 4, label: "Agree" },
  { value: 5, label: "Strongly Agree" },
] as const;

export const helpText = `
Describe yourself as you honestly are, not as you want to be.
Answer based on your natural tendencies and preferences, thinking about how you act in most situations.
This will help you gain the most accurate understanding of your personality type.

Indicate for each statement how much you agree:
1. Strongly Disagree
2. Disagree
3. Neutral
4. Agree
5. Strongly Agree
`;
