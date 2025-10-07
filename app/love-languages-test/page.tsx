"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { questions, traitDescriptions } from "@/app/data/loveLanguagesTest";
import type { LoveLanguageQuestion } from "@/app/data/loveLanguagesTest";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function LoveLanguages() {
  const mainRef = useRef<HTMLDivElement>(null);
  const supabase = createClientComponentClient();
  const searchParams = useSearchParams();
  const [answers, setAnswers] = useState<{ [key: number]: 1 | 2 }>({});
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [scores, setScores] = useState<{ [key: string]: number }>({});
  const [resultId, setResultId] = useState<string | null>(null);
  const [copyState, setCopyState] = useState<"idle" | "copied" | "error">(
    "idle"
  );

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
    setTimeout(() => {
      if (mainRef.current) {
        mainRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
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
    // First calculate raw scores
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

    // Calculate total score
    const totalScore = Object.values(typeScores).reduce((a, b) => a + b, 0);

    // Convert to percentages that sum to 100
    const finalScores = {
      W: Math.round((typeScores.W / totalScore) * 100),
      S: Math.round((typeScores.S / totalScore) * 100),
      G: Math.round((typeScores.G / totalScore) * 100),
      T: Math.round((typeScores.T / totalScore) * 100),
      P: Math.round((typeScores.P / totalScore) * 100),
    };

    // Adjust for rounding errors to ensure sum is exactly 100
    const sum = Object.values(finalScores).reduce((a, b) => a + b, 0);
    if (sum !== 100) {
      const diff = 100 - sum;
      // Add the difference to the highest score
      const highestType = Object.entries(finalScores).reduce((a, b) =>
        b[1] > a[1] ? b : a
      )[0];
      finalScores[highestType] += diff;
    }

    const result = {
      scores: finalScores,
      answers: answers,
      timestamp: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("love_languages_results")
        .insert([{ result }])
        .select("id")
        .single();

      if (error) {
        console.error("Error saving results:", error);
      } else if (data?.id) {
        const id = String(data.id);
        setResultId(id);
        const origin =
          typeof window !== "undefined" ? window.location.origin : "";
        const shareUrl = `${origin}/love-languages-test?result_id=${id}`;
        await supabase
          .from("love_languages_results")
          .update({ result_url: shareUrl })
          .eq("id", id);
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

  const handleCopyShareLink = async () => {
    if (!resultId) return;
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    const shareUrl = `${origin}/love-languages-test?result_id=${resultId}`;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 2000);
    } catch (e) {
      setCopyState("error");
      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  // Load results if a result_id is present in the URL
  useEffect(() => {
    const paramId = searchParams?.get("result_id");
    if (!paramId) return;
    const load = async () => {
      try {
        const { data, error } = await supabase
          .from("love_languages_results")
          .select("result")
          .eq("id", paramId)
          .single();
        if (!error && data?.result?.scores) {
          setScores(data.result.scores);
          setShowResults(true);
          setResultId(paramId);
          scrollToTop();
        }
      } catch (e) {
        // no-op
      }
    };
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderQuestion = (question: LoveLanguageQuestion) => (
    <div key={question.id} className="space-y-5">
      <h3 className="text-base sm:text-lg font-medium text-center max-w-2xl mx-auto px-4 text-gray-200">
        Choose the statement that is more important for you:
      </h3>
      <div className="w-full max-w-2xl mx-auto space-y-4">
        <button
          onClick={() => handleAnswer(question.id, 1)}
          className={cn(
            "w-full p-5 text-left rounded-xl border-2 transition-all duration-200 text-base sm:text-lg",
            answers[question.id] === 1
              ? "bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/25 scale-[1.02]"
              : "border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/5"
          )}
        >
          {question.option1.text}
        </button>
        <button
          onClick={() => handleAnswer(question.id, 2)}
          className={cn(
            "w-full p-5 text-left rounded-xl border-2 transition-all duration-200 text-base sm:text-lg",
            answers[question.id] === 2
              ? "bg-gradient-to-r from-purple-500 to-purple-600 border-purple-400 text-white shadow-lg shadow-purple-500/25 scale-[1.02]"
              : "border-gray-700 hover:border-purple-500/50 hover:bg-purple-500/5"
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
    <div className="min-h-[100dvh] bg-background flex flex-col relative">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-background pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />

      <header className="border-b relative z-10 bg-background/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-6">
            <Link
              href="/"
              className="inline-flex items-center text-sm text-muted-foreground hover:text-purple-400 transition-colors"
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
              Go back to Home
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
            Love Languages Test
          </h1>
          <div className="space-y-2">
            <p className="text-gray-300 text-base sm:text-lg">
              Discover your primary love language and understand how you prefer
              to receive love
            </p>
            <div className="flex flex-wrap gap-3 text-sm">
              <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
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
                  className="h-4 w-4 text-purple-400"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                <span className="text-gray-300">3 minutes</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
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
                  className="h-4 w-4 text-purple-400"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
                <span className="text-gray-300">No registration</span>
              </div>
              <div className="flex items-center gap-2 bg-purple-500/10 px-3 py-1.5 rounded-full border border-purple-500/20">
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
                  className="h-4 w-4 text-purple-400"
                >
                  <line x1="12" y1="1" x2="12" y2="23" />
                  <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <span className="text-gray-300">100% Free</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main
        ref={mainRef}
        className="flex-1 py-8 relative z-10"
        id="main-content"
      >
        <div className="max-w-4xl mx-auto px-4">
          {!showResults ? (
            <div className="space-y-8">
              {/* Progress indicator */}
              <div className="bg-card/50 backdrop-blur-sm rounded-xl p-4 border border-gray-800">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm font-medium text-gray-300">
                    Page {currentPage + 1} of {totalPages}
                  </span>
                  <span className="text-sm text-gray-400">
                    {Object.keys(answers).length} / {questions.length} answered
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-purple-500 to-purple-600 transition-all duration-300"
                    style={{
                      width: `${
                        (Object.keys(answers).length / questions.length) * 100
                      }%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-12">
                {currentQuestions.map((question) => renderQuestion(question))}
              </div>

              <div className="flex justify-between items-center pt-8 px-4">
                <button
                  onClick={handlePrevious}
                  className={`px-6 py-3 rounded-xl text-sm sm:text-base font-medium transition-all
                    ${
                      currentPage > 0
                        ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700"
                        : "invisible"
                    }`}
                >
                  Previous
                </button>

                {isLastPage ? (
                  <button
                    onClick={calculateScores}
                    disabled={!isPageComplete()}
                    className={`px-8 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all
                      ${
                        isPageComplete()
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25"
                          : "opacity-50 cursor-not-allowed bg-gray-800 text-gray-400"
                      }`}
                  >
                    See Results
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    disabled={!isPageComplete()}
                    className={`px-8 py-3 rounded-xl text-sm sm:text-base font-semibold transition-all
                      ${
                        isPageComplete()
                          ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25"
                          : "opacity-50 cursor-not-allowed bg-gray-800 text-gray-400"
                      }`}
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 sm:p-10 border border-gray-800">
              <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-white"
                  >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h2 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                  Your Love Languages
                </h2>
                <p className="text-gray-400">
                  Here's how you prefer to give and receive love
                </p>
              </div>
              <div className="space-y-8">
                {traitOrder
                  .sort((a, b) => scores[b.number] - scores[a.number])
                  .map(({ number, name }, index) => (
                    <div key={number} className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          {index === 0 && (
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-br from-purple-500 to-purple-600 text-white text-sm font-bold">
                              1
                            </span>
                          )}
                          <h3 className="text-lg sm:text-xl font-semibold text-white">
                            {name}
                          </h3>
                        </div>
                        <span className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                          {scores[number]}%
                        </span>
                      </div>
                      <div className="h-3 bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
                          style={{ width: `${scores[number]}%` }}
                        />
                      </div>
                      <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                        {traitDescriptions[number].description}
                      </p>
                    </div>
                  ))}
              </div>

              <div className="mt-10 flex justify-center">
                <button
                  onClick={handleCopyShareLink}
                  disabled={!resultId}
                  className={`inline-flex items-center justify-center rounded-xl px-6 py-3 text-base font-semibold transition-all ${
                    resultId
                      ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25"
                      : "opacity-50 cursor-not-allowed bg-gray-800 text-gray-400"
                  }`}
                >
                  {copyState === "copied" ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="mr-2"
                    >
                      <circle cx="18" cy="5" r="3" />
                      <circle cx="6" cy="12" r="3" />
                      <circle cx="18" cy="19" r="3" />
                      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                    </svg>
                  )}
                  {copyState === "copied"
                    ? "Link copied!"
                    : copyState === "error"
                    ? "Copy failed"
                    : "Share your results"}
                </button>
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
