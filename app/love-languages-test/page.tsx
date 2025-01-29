"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { questions, traitDescriptions } from "@/app/data/loveLanguagesTest";

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
    <div>
      <main ref={mainRef} className="min-h-screen py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-4">Love Languages Test</h1>
            <p className="text-muted-foreground">
              Discover your primary love language and understand how you prefer to
              receive love and affection.
            </p>
          </div>

          {!showResults ? (
            <div className="space-y-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">
                  Question {currentPage * questionsPerPage + 1} -{" "}
                  {Math.min((currentPage + 1) * questionsPerPage, questions.length)} of{" "}
                  {questions.length}
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
              <h2 className="text-2xl font-bold text-center mb-6">Your Results</h2>
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
