"use client";

import { useState, useRef } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Link from "next/link";
import {
  questions,
  traitDescriptions,
  traitOrder,
} from "../data/darkTriadTest";

export default function DarkTriad() {
  const mainRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage((prev) => prev + 1);
      scrollToTop();
    }
  };

  const handlePrevious = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
      scrollToTop();
    }
  };

  const isPageComplete = () => {
    return currentQuestions.every((q) => answers[q.id] !== undefined);
  };

  const isLastPage = currentPage === totalPages - 1;

  const calculateScores = async () => {
    const typeScores = { M: 0, N: 0, P: 0 };

    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        const score = question.math === "+" ? answer : 6 - answer;
        typeScores[question.type] += score;
      }
    });

    // Calculate trait-specific percentages
    const traitQuestionCounts = {
      M: questions.filter((q) => q.type === "M").length,
      N: questions.filter((q) => q.type === "N").length,
      P: questions.filter((q) => q.type === "P").length,
    };

    const finalScores = {
      M: Math.round((typeScores.M / (traitQuestionCounts.M * 5)) * 100),
      N: Math.round((typeScores.N / (traitQuestionCounts.N * 5)) * 100),
      P: Math.round((typeScores.P / (traitQuestionCounts.P * 5)) * 100),
    };

    try {
      const { error } = await supabase.from("dark_triad_results").insert([
        {
          scores: finalScores,
          answers: answers,
          timestamp: new Date().toISOString(),
        },
      ]);

      if (error) {
        console.error("Error saving results:", error);
      }
    } catch (error) {
      console.error("Error saving results:", error);
    }

    setScores(finalScores);
    setShowResults(true);
    scrollToTop();

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "test_completed", {
        event_category: "Engagement",
        event_label: "Dark Triad Test",
      });
    }
  };

  const renderResults = () => {
    if (!showResults) return null;

    return (
      <div className="bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Your Results</h2>

        <p className="text-muted-foreground mb-8 text-center">
          Your Dark Triad personality assessment results are shown below. Each
          trait is scored as a percentage of the maximum possible score.
        </p>

        <div className="space-y-8">
          {traitOrder.map(({ number, name }) => (
            <div key={number} className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">{name}</h3>
                <span className="text-sm font-medium">
                  Score: {scores[number]}%
                </span>
              </div>
              <div className="h-2 bg-secondary rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${scores[number]}%`,
                  }}
                />
              </div>
              <p className="text-sm text-muted-foreground">
                {traitDescriptions[number].description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 flex justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
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
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
            Chat about results
          </Link>
        </div>
      </div>
    );
  };

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
              Go to MBTI Characters Chat
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-3">
            Dark Triad Personality Test
          </h1>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Discover your personality traits through this psychological
              assessment
            </p>
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              <div className="flex items-center">
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
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                Takes 3 minutes
              </div>
              <div className="flex items-center">
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
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                No registration required
              </div>
              <div className="flex items-center">
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
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </header>

      <main ref={mainRef} className="flex-1 py-8">
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
                <div key={question.id} className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-center max-w-2xl mx-auto px-4">
                    {question.question}
                  </h3>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-md space-y-2">
                      {[
                        { value: 1, label: "Strongly Disagree" },
                        { value: 2, label: "Disagree" },
                        { value: 3, label: "Neutral" },
                        { value: 4, label: "Agree" },
                        { value: 5, label: "Strongly Agree" },
                      ].map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => handleAnswer(question.id, value)}
                          className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors
                            ${
                              answers[question.id] === value
                                ? "bg-primary text-primary-foreground"
                                : "bg-background hover:bg-muted border"
                            }`}
                        >
                          <span className="text-sm sm:text-base">{label}</span>
                          <span className="text-sm sm:text-base font-medium">
                            {value}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex justify-between items-center pt-8 px-4">
                <button
                  onClick={handlePrevious}
                  className={`px-4 sm:px-6 py-2 rounded-lg text-sm sm:text-base font-medium transition-opacity
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
                    className={`bg-primary text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-opacity
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
                    className={`bg-primary text-primary-foreground px-6 sm:px-8 py-2 sm:py-3 rounded-lg text-sm sm:text-base font-medium transition-opacity
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
            renderResults()
          )}
        </div>
      </main>
    </div>
  );
}
