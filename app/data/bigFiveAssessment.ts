export interface AssessmentQuestion {
    question: string;
    type: number;  // 1: Extraversion, 2: Agreeableness, 3: Conscientiousness, 4: Emotional Stability, 5: Intellect
    math: "+" | "-";  // Indicates if this question adds or subtracts from the score
}



export const assessment: AssessmentQuestion[] = [
    // Extraversion (type: 1)
    { question: "Am the life of the party.", type: 1, math: "+" },
    { question: "Don't talk a lot.", type: 1, math: "-" },
    { question: "Feel comfortable around people.", type: 1, math: "+" },
    { question: "Keep in the background.", type: 1, math: "-" },
    { question: "Start conversations.", type: 1, math: "+" },
    { question: "Have little to say.", type: 1, math: "-" },
    { question: "Talk to a lot of different people at parties.", type: 1, math: "+" },
    { question: "Don't like to draw attention to myself.", type: 1, math: "-" },
    { question: "Don't mind being the center of attention.", type: 1, math: "+" },
    { question: "Am quiet around strangers.", type: 1, math: "-" },

    // Agreeableness (type: 2)
    { question: "Feel little concern for others.", type: 2, math: "-" },
    { question: "Am interested in people.", type: 2, math: "+" },
    { question: "Insult people.", type: 2, math: "-" },
    { question: "Sympathize with others' feelings.", type: 2, math: "+" },
    { question: "Am not interested in other people's problems.", type: 2, math: "-" },
    { question: "Have a soft heart.", type: 2, math: "+" },
    { question: "Am not really interested in others.", type: 2, math: "-" },
    { question: "Take time out for others.", type: 2, math: "+" },
    { question: "Feel others' emotions.", type: 2, math: "+" },
    { question: "Make people feel at ease.", type: 2, math: "+" },

    // Conscientiousness (type: 3)
    { question: "Am always prepared.", type: 3, math: "+" },
    { question: "Leave my belongings around.", type: 3, math: "-" },
    { question: "Pay attention to details.", type: 3, math: "+" },
    { question: "Make a mess of things.", type: 3, math: "-" },
    { question: "Get chores done right away.", type: 3, math: "+" },
    { question: "Often forget to put things back in their proper place.", type: 3, math: "-" },
    { question: "Like order.", type: 3, math: "+" },
    { question: "Shirk my duties.", type: 3, math: "-" },
    { question: "Follow a schedule.", type: 3, math: "+" },
    { question: "Am exacting in my work.", type: 3, math: "+" },

    // Emotional Stability (type: 4)
    { question: "Get stressed out easily.", type: 4, math: "-" },
    { question: "Am relaxed most of the time.", type: 4, math: "+" },
    { question: "Worry about things.", type: 4, math: "-" },
    { question: "Seldom feel blue.", type: 4, math: "+" },
    { question: "Am easily disturbed.", type: 4, math: "-" },
    { question: "Get upset easily.", type: 4, math: "-" },
    { question: "Change my mood a lot.", type: 4, math: "-" },
    { question: "Have frequent mood swings.", type: 4, math: "-" },
    { question: "Get irritated easily.", type: 4, math: "-" },
    { question: "Often feel blue.", type: 4, math: "-" },

    // Intellect/Imagination (type: 5)
    { question: "Have a rich vocabulary.", type: 5, math: "+" },
    { question: "Have difficulty understanding abstract ideas.", type: 5, math: "-" },
    { question: "Have a vivid imagination.", type: 5, math: "+" },
    { question: "Am not interested in abstract ideas.", type: 5, math: "-" },
    { question: "Have excellent ideas.", type: 5, math: "+" },
    { question: "Do not have a good imagination.", type: 5, math: "-" },
    { question: "Am quick to understand things.", type: 5, math: "+" },
    { question: "Use difficult words.", type: 5, math: "+" },
    { question: "Spend time reflecting on things.", type: 5, math: "+" },
    { question: "Am full of ideas.", type: 5, math: "+" }
];

export const traitDescriptions = {
    1: {
      title: "Extraversion",
      description: "Extraversion reflects a tendency to seek social interaction and stimulation. High scorers tend to be outgoing, energetic, and assertive in social situations. They typically enjoy being around others and actively seek out social experiences. Lower scorers tend to be more reserved and may prefer smaller social gatherings or solitary activities."
    },
    2: {
      title: "Emotional Stability",
      description: "Emotional Stability (opposite of Neuroticism) indicates how one manages emotions and stress. High scorers tend to be calm, resilient, and even-tempered, handling stress well and maintaining emotional balance. Lower scorers may experience more emotional ups and downs and be more sensitive to stress."
    },
    3: {
      title: "Agreeableness",
      description: "Agreeableness reflects how people interact with others. High scorers tend to be cooperative, compassionate, and considerate of others' feelings. They typically value harmony and maintain positive relationships. Lower scorers may be more competitive and skeptical in their interactions."
    },
    4: {
      title: "Conscientiousness",
      description: "Conscientiousness shows how organized and goal-directed someone is. High scorers tend to be responsible, organized, and thorough in their tasks. They usually plan ahead and pay attention to details. Lower scorers tend to be more flexible and spontaneous but might be less structured."
    },
    5: {
      title: "Intellect/Imagination",
      description: "Also known as Openness to Experience, this trait reflects curiosity and creativity. High scorers tend to be imaginative, intellectually curious, and appreciative of art and new ideas. They often seek out novel experiences. Lower scorers tend to prefer familiar routines and conventional approaches."
    }
  } as const;

export const answerOptions = [
    { value: 1, label: "Very Inaccurate" },
    { value: 2, label: "Moderately Inaccurate" },
    { value: 3, label: "Neither Accurate Nor Inaccurate" },
    { value: 4, label: "Moderately Accurate" },
    { value: 5, label: "Very Accurate" }
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