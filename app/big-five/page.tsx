"use client";

import { useState } from "react";
import Link from "next/link";
import {
  assessment,
  AssessmentQuestion,
  traitDescriptions,
} from "@/app/data/bigFiveAssessment";

interface Question extends AssessmentQuestion {
  id: number;
}

const questions: Question[] = assessment.map((q, index) => ({
  ...q,
  id: index + 1,
}));

export default function BigFive() {
  // Initialize answers with all 5s
  const initialAnswers = questions.reduce((acc, question) => {
    acc[question.id] = 5;
    return acc;
  }, {} as { [key: number]: number });

  const [answers, setAnswers] = useState<{ [key: number]: number }>(
    initialAnswers
  );
  // Set showResults to true initially
  const [showResults, setShowResults] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  // Calculate initial scores
  const initialScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  questions.forEach((question) => {
    const score = question.math === "+" ? 5 : 6 - 5;
    initialScores[question.type] += score;
  });
  const [scores, setScores] = useState<{ [key: number]: number }>(
    initialScores
  );

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const calculateScores = () => {
    // Initialize scores for each trait type
    const newScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    // Calculate scores for each question
    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        // For positive questions (+), use the answer value directly
        // For negative questions (-), reverse the score (6 - answer)
        const score = question.math === "+" ? answer : 6 - answer;
        newScores[question.type] += score;
      }
    });

    setScores(newScores);
    setShowResults(true);
  };

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
                    onClick={calculateScores}
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
            <div className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-center">
                Your Results
              </h2>
              <p className="text-center text-muted-foreground mb-8">
                Your Big Five personality assessment results are shown below.
                Each score indicates your position relative to the general
                population, with higher scores showing where you rank compared
                to others. The scores range from 0 to 50, with 25 representing
                the average in society for each personality dimension.
              </p>
              <div className="space-y-6 max-w-md mx-auto">
                {Object.entries(scores).map(([type, score]) => (
                  <div key={type} className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {
                            traitDescriptions[
                              type as keyof typeof traitDescriptions
                            ].title
                          }
                        </span>
                        <span className="text-muted-foreground">
                          Score: {score} / 50
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2.5">
                        <div
                          className="bg-primary h-2.5 rounded-full"
                          style={{ width: `${(score / 50) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {
                        traitDescriptions[
                          type as keyof typeof traitDescriptions
                        ].description
                      }
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link
                  href="/"
                  className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  Chat with MBTI Characters
                </Link>
              </div>
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
