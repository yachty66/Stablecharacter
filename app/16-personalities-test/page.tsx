"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState, useRef } from "react";
import Link from "next/link";
import { assessment, AssessmentQuestion } from "@/app/data/16PersonalitiesTest";

const questions: AssessmentQuestion[] = assessment;

export default function SixteenPersonalities() {
  const mainRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();

  // State management
  const [answers, setAnswers] = useState<{ [key: string]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const calculateScores = async () => {
    const dimensionScores = {
      EI: 0,
      NS: 0,
      TF: 0,
      JP: 0,
    };

    // Calculate the scores for each dimension using the structured data
    questions.forEach((question) => {
      const answer = answers[question.text];
      if (answer !== undefined) {
        const score = question.math === "+" ? answer : -answer;
        dimensionScores[question.type] += score;
      }
    });

    const type = {
      EI: dimensionScores.EI > 0 ? "E" : "I",
      NS: dimensionScores.NS > 0 ? "N" : "S",
      TF: dimensionScores.TF > 0 ? "T" : "F",
      JP: dimensionScores.JP > 0 ? "J" : "P",
    };

    const mbtiType = `${type.EI}${type.NS}${type.TF}${type.JP}`;

    const result = {
      scores: dimensionScores,
      type: mbtiType,
      answers: answers,
      timestamp: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("sixteen_personalities_results")
        .insert([{ result }]);

      if (error) {
        console.error("Error saving results:", error);
      }
    } catch (error) {
      console.error("Error saving results:", error);
    }

    setScores(dimensionScores);
    setShowResults(true);
    scrollToTop();

    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("event", "test_completed", {
        event_category: "Engagement",
        event_label: "16 Personalities Test",
        mbti_type: mbtiType,
      });
    }
  };

  const handleAnswer = (questionText: string, value: number) => {
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      newAnswers[questionText] = value;
      return newAnswers;
    });
  };

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: "smooth" });
    }
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
    return currentQuestions.every((q) => answers[q.text] !== undefined);
  };

  const isLastPage = currentPage === totalPages - 1;

  const renderResults = () => {
    if (!showResults) return null;

    const mbtiType = `${scores.EI > 0 ? "E" : "I"}${scores.NS > 0 ? "N" : "S"}${
      scores.TF > 0 ? "T" : "F"
    }${scores.JP > 0 ? "J" : "P"}`;

    return (
      <div className="bg-muted/50 rounded-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Your Results</h2>

        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center">
            <h3 className="text-4xl font-bold mb-4">{mbtiType}</h3>
            <p className="text-muted-foreground">Your personality type is:</p>
          </div>

          <div className="space-y-6">
            {/* E/I Scale */}
            <div>
              <div className="flex justify-between mb-2">
                <span>Introversion (I)</span>
                <span>Extraversion (E)</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${((scores.EI + 21) / 42) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* N/S Scale */}
            <div>
              <div className="flex justify-between mb-2">
                <span>Sensing (S)</span>
                <span>Intuition (N)</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${((scores.NS + 21) / 42) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* T/F Scale */}
            <div>
              <div className="flex justify-between mb-2">
                <span>Feeling (F)</span>
                <span>Thinking (T)</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${((scores.TF + 21) / 42) * 100}%`,
                  }}
                />
              </div>
            </div>

            {/* J/P Scale */}
            <div>
              <div className="flex justify-between mb-2">
                <span>Perceiving (P)</span>
                <span>Judging (J)</span>
              </div>
              <div className="h-2 bg-muted rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{
                    width: `${((scores.JP + 21) / 42) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>

          <div className="text-center pt-6">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-primary text-primary-foreground px-8 py-3 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Explore Characters with Your Type
            </Link>
          </div>
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
          <h1 className="text-3xl font-bold mb-3">16 Personalities Test</h1>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Discover your MBTI personality type through this comprehensive
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
                Takes 5 minutes
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
                <div key={question.text} className="space-y-4">
                  <h3 className="text-base sm:text-lg font-medium text-center max-w-2xl mx-auto px-4">
                    {question.text}
                  </h3>
                  <div className="flex flex-col items-center space-y-4">
                    <div className="w-full max-w-md space-y-2">
                      {question.options.map((option) => (
                        <button
                          key={`${question.text}-${option.value}`}
                          onClick={() =>
                            handleAnswer(question.text, option.value)
                          }
                          className={`w-full flex items-center justify-between px-4 py-2 rounded-lg transition-colors
                            ${
                              answers[question.text] === option.value
                                ? "bg-primary text-primary-foreground"
                                : "bg-background hover:bg-muted border"
                            }`}
                        >
                          <span className="text-sm sm:text-base">
                            {option.text}
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

      <footer className="border-t">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Based on the Myers-Briggs Type Indicator (MBTI®) personality
            framework
          </p>
        </div>
      </footer>
    </div>
  );
}
