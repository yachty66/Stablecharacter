"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { questions, traitDescriptions } from "@/app/data/loveLanguagesTest";
import Link from "next/link";

export default function LoveLanguages() {
  const mainRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const [answers, setAnswers] = useState<{ [key: number]: 1 | 2 }>({});
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});

  const traitOrder = [
    { number: "W", name: "Words of Affirmation" },
    { number: "S", name: "Acts of Service" },
    { number: "G", name: "Receiving Gifts" },
    { number: "T", name: "Quality Time" },
    { number: "P", name: "Physical Touch" },
  ];

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

  const handleAnswer = (questionId: number, value: 1 | 2) => {
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

  const calculateScores = async () => {
    const typeScores = { W: 0, S: 0, G: 0, T: 0, P: 0 };

    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        if (answer === 1) {
          typeScores[question.option1.type] += 1;
        } else if (answer === 2) {
          typeScores[question.option2.type] += 1;
        }
      }
    });

    const traitQuestionCounts = {
      W: questions.filter(
        (q) => q.option1.type === "W" || q.option2.type === "W"
      ).length,
      S: questions.filter(
        (q) => q.option1.type === "S" || q.option2.type === "S"
      ).length,
      G: questions.filter(
        (q) => q.option1.type === "G" || q.option2.type === "G"
      ).length,
      T: questions.filter(
        (q) => q.option1.type === "T" || q.option2.type === "T"
      ).length,
      P: questions.filter(
        (q) => q.option1.type === "P" || q.option2.type === "P"
      ).length,
    };

    const finalScores = {
      W: Math.round((typeScores.W / traitQuestionCounts.W) * 100),
      S: Math.round((typeScores.S / traitQuestionCounts.S) * 100),
      G: Math.round((typeScores.G / traitQuestionCounts.G) * 100),
      T: Math.round((typeScores.T / traitQuestionCounts.T) * 100),
      P: Math.round((typeScores.P / traitQuestionCounts.P) * 100),
    };

    const result = {
      scores: finalScores,
      answers: answers,
      timestamp: new Date().toISOString(),
    };

    try {
      const { error } = await supabase
        .from("love_languages_results")
        .insert([{ result }]);

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
        event_label: "Love Languages Test",
      });
    }
  };

  const renderQuestion = (question: LoveLanguageQuestion) => (
    <div key={question.id} className="space-y-4">
      <h3 className="text-base sm:text-lg font-medium text-center max-w-2xl mx-auto px-4">
        Choose the statement that is more important for you:
      </h3>
      <div className="w-full max-w-md mx-auto space-y-3">
        <button
          onClick={() => handleAnswer(question.id, 1)}
          className={cn(
            "w-full p-4 text-left rounded-lg border transition-colors",
            answers[question.id] === 1
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {question.option1.text}
        </button>
        <button
          onClick={() => handleAnswer(question.id, 2)}
          className={cn(
            "w-full p-4 text-left rounded-lg border transition-colors",
            answers[question.id] === 2
              ? "bg-primary text-primary-foreground"
              : "hover:bg-muted"
          )}
        >
          {question.option2.text}
        </button>
      </div>
    </div>
  );

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
              Go to MBTI Characters Chat
            </Link>
          </div>
          <h1 className="text-3xl font-bold mb-3">Love Languages Test</h1>
          <div className="space-y-2">
            <p className="text-muted-foreground">
              Discover your primary love language and understand how you prefer
              to receive love
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

      <main ref={mainRef} className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Love Languages Test</h1>
            <p className="text-muted-foreground">
              Discover your primary love language and understand how you prefer
              to receive love and affection.
            </p>
          </div>

          {!showResults ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Question {currentPage * questionsPerPage + 1} -{" "}
                  {Math.min(
                    (currentPage + 1) * questionsPerPage,
                    questions.length
                  )}{" "}
                  of {questions.length}
                </h2>
                <div className="text-sm text-muted-foreground">
                  Page {currentPage + 1} of {totalPages}
                </div>
              </div>

              <div className="space-y-12">
                {currentQuestions.map((question) => renderQuestion(question))}
              </div>

              <div className="flex justify-between pt-8">
                <button
                  onClick={handlePrevious}
                  disabled={currentPage === 0}
                  className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                {isLastPage ? (
                  <button
                    onClick={calculateScores}
                    disabled={!isPageComplete()}
                    className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    View Results
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!isPageComplete()}
                    className="px-4 py-2 rounded-lg border hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-muted/50 rounded-lg p-8">
              <h2 className="text-2xl font-bold text-center mb-6">
                Your Results
              </h2>
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
                        style={{ width: `${scores[number]}%` }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {traitDescriptions[number].description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            Based on Gary Chapman's Five Love Languages framework.{" "}
            <a
              href="https://www.5lovelanguages.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              Learn more about the Five Love Languages
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
