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

      <main
        ref={mainRef}
        className="flex-1 py-8 relative z-10"
        id="main-content"
      >
        <div className="max-w-4xl mx-auto px-4">
          {!showResults ? (
            <div className="space-y-8">
              {/* Back button */}
              <Link
                href="/"
                className="inline-flex items-center text-sm text-gray-400 hover:text-purple-400 transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="mr-1.5"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
                Back to Home
              </Link>

              {/* Test info header */}
              <div className="text-center space-y-3">
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                  Love Languages Test
                </h1>
                <div className="flex items-center justify-center gap-3 text-xs sm:text-sm text-gray-400">
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                    3 min
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                    </svg>
                    Secure & Private
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="4.93" y1="4.93" x2="19.07" y2="19.07" />
                    </svg>
                    No registration
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    100% Free
                  </span>
                </div>
              </div>

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
                        <h3 className="text-lg sm:text-xl font-semibold text-white">
                          {name}
                        </h3>
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

              {/* Upsell Section */}
              <div className="mt-12 space-y-6">
                <div className="text-center">
                  <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                    Take Your Understanding Further
                  </h3>
                  <p className="text-gray-400">
                    Unlock premium resources to deepen your love languages
                    knowledge
                  </p>
                </div>

                <div className="max-w-2xl mx-auto">
                  {/* Combined Premium Package */}
                  <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-2xl p-8 border-2 border-purple-500/30">
                    <div className="text-center mb-6">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 mb-4">
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
                          <path d="M12 2L2 7l10 5 10-5-10-5z" />
                          <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
                        </svg>
                      </div>
                      <h4 className="text-2xl font-bold text-white mb-2">
                        Premium Love Languages Package
                      </h4>
                      <p className="text-gray-300 mb-4">
                        Get everything you need to master your love languages
                        and connect with a supportive community
                      </p>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 mb-6">
                        <span className="text-3xl font-bold text-white">
                          $9
                        </span>
                        <span className="text-gray-400">one-time payment</span>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-6 mb-6">
                      <div>
                        <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
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
                            className="text-purple-400"
                          >
                            <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
                          </svg>
                          Complete Guide
                        </h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-purple-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Detailed infographic with your results
                          </li>
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-purple-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Practical tips for each love language
                          </li>
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-purple-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Relationship improvement strategies
                          </li>
                        </ul>
                      </div>
                      <div>
                        <h5 className="text-white font-semibold mb-3 flex items-center gap-2">
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
                            className="text-purple-400"
                          >
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                            <circle cx="9" cy="7" r="4" />
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                          </svg>
                          Discord Community
                        </h5>
                        <ul className="space-y-2 text-sm text-gray-400">
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-purple-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Exclusive community access
                          </li>
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-purple-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Monthly live Q&A sessions
                          </li>
                          <li className="flex items-center gap-2">
                            <svg
                              className="w-4 h-4 text-purple-400 flex-shrink-0"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Share tips and learn from others
                          </li>
                        </ul>
                      </div>
                    </div>

                    <button className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-purple-500/25 text-lg">
                      Get Premium Package - $9
                    </button>
                  </div>
                </div>
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
