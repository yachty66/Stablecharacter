"use client";

import { useState } from "react";
import Link from "next/link";

interface Question {
  id: number;
  text: string;
  factor: string;
}

const questions: Question[] = [
  // Extraversion (E)
  {
    id: 1,
    text: "I am the life of the party",
    factor: "extraversion",
  },
  {
    id: 2,
    text: "I feel comfortable around people",
    factor: "extraversion",
  },
  {
    id: 3,
    text: "I start conversations",
    factor: "extraversion",
  },

  // Agreeableness (A)
  {
    id: 4,
    text: "I feel others' emotions",
    factor: "agreeableness",
  },
  {
    id: 5,
    text: "I make people feel at ease",
    factor: "agreeableness",
  },
  {
    id: 6,
    text: "I take time out for others",
    factor: "agreeableness",
  },

  // Conscientiousness (C)
  {
    id: 7,
    text: "I am always prepared",
    factor: "conscientiousness",
  },
  {
    id: 8,
    text: "I pay attention to details",
    factor: "conscientiousness",
  },
  {
    id: 9,
    text: "I follow a schedule",
    factor: "conscientiousness",
  },

  // Neuroticism (N)
  {
    id: 10,
    text: "I get stressed out easily",
    factor: "neuroticism",
  },
  {
    id: 11,
    text: "I worry about things",
    factor: "neuroticism",
  },
  {
    id: 12,
    text: "I change my mood a lot",
    factor: "neuroticism",
  },

  // Openness (O)
  {
    id: 13,
    text: "I have a vivid imagination",
    factor: "openness",
  },
  {
    id: 14,
    text: "I have excellent ideas",
    factor: "openness",
  },
  {
    id: 15,
    text: "I spend time reflecting on things",
    factor: "openness",
  },
];

export default function BigFive() {
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const isPageComplete = () => {
    return currentQuestions.every((q) => answers[q.id] !== undefined);
  };

  const isLastPage = currentPage === totalPages - 1;

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col">
      <header className="border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2 h-4 w-4"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
              Back to MBTI Characters Chat
            </Link>
          </div>
          <h1 className="text-3xl font-bold">Big Five Personality Test</h1>
          <p className="text-muted-foreground mt-2">
            Discover your personality traits through this scientific assessment
          </p>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4">
          {!showResults ? (
            <div className="space-y-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <span className="text-sm text-muted-foreground">
                  {questions.length} questions total
                </span>
              </div>

              {currentQuestions.map((question) => (
                <div key={question.id} className="bg-muted/50 rounded-lg p-6">
                  <p className="text-lg mb-4">{question.text}</p>
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between">
                    <span className="text-sm text-muted-foreground">
                      Strongly Disagree
                    </span>
                    <div className="flex gap-2 sm:gap-4">
                      {[1, 2, 3, 4, 5].map((value) => (
                        <button
                          key={value}
                          onClick={() => handleAnswer(question.id, value)}
                          className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors
                            ${
                              answers[question.id] === value
                                ? "bg-primary text-primary-foreground"
                                : "bg-background hover:bg-muted border"
                            }`}
                        >
                          {value}
                        </button>
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Strongly Agree
                    </span>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-8">
                <button
                  onClick={handlePrevious}
                  className={`px-6 py-2 rounded-lg font-medium transition-opacity
                    ${
                      currentPage > 0
                        ? "bg-secondary text-secondary-foreground hover:opacity-90"
                        : "invisible"
                    }`}
                >
                  Previous
                </button>

                {isLastPage ? (
                  <button
                    onClick={() => setShowResults(true)}
                    disabled={!isPageComplete()}
                    className={`bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium transition-opacity
                      ${
                        isPageComplete()
                          ? "hover:opacity-90"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                  >
                    See Results
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!isPageComplete()}
                    className={`bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium transition-opacity
                      ${
                        isPageComplete()
                          ? "hover:opacity-90"
                          : "opacity-50 cursor-not-allowed"
                      }`}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Your Results</h2>
              {/* Display results here */}
              <Link
                href="/"
                className="inline-block mt-6 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Chat with MBTI Characters
              </Link>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Based on the scientific Big Five personality model
          </p>
        </div>
      </footer>
    </div>
  );
}
