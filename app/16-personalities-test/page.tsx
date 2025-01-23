"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
import Link from "next/link";
import {
  personalityAssessment,
  AssessmentQuestion,
} from "@/app/data/16PersonalityTest";

interface Question extends AssessmentQuestion {
  id: number;
}

// Map questions with IDs
const questions: Question[] = personalityAssessment.map((q, index) => ({
  ...q,
  id: index + 1,
}));

export default function BigFive() {
  const supabase = createClientComponentClient();

  const traitOrder = [
    { number: 1, name: "Extraversion" },
    { number: 2, name: "Agreeableness" },
    { number: 3, name: "Conscientiousness" },
    { number: 4, name: "Emotional Stability" },
    { number: 5, name: "Intellect/Imagination" },
  ];

  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [showResults, setShowResults] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const [scores, setScores] = useState<{ [key: number]: number }>({});

  const questionsPerPage = 5;
  const totalPages = Math.ceil(questions.length / questionsPerPage);
  const currentQuestions = questions.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  const calculateScores = async () => {
    const typeScores = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    questions.forEach((question) => {
      const answer = answers[question.id];
      if (answer !== undefined) {
        const score = question.math === "+" ? answer : 5 - (answer - 1);
        typeScores[question.type] += score;
      }
    });

    const result = {
      scores: typeScores,
      answers: answers,
      timestamp: new Date().toISOString(),
    };

    try {
      const { data, error } = await supabase
        .from("big_five_results")
        .insert([{ result }]);

      if (error) {
        console.error("Error saving results:", error);
      } else {
        console.log("Results saved successfully:", data);
      }
    } catch (error) {
      console.error("Error saving results:", error);
    }

    setScores(typeScores);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleAnswer = (questionId: number, value: number) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
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

  const isPageComplete = () =>
    currentQuestions.every((q) => answers[q.id] !== undefined);

  return (
    <div>
      {!showResults ? (
        <div>
          {currentQuestions.map((question) => (
            <div key={question.id}>
              <p>{question.question}</p>
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  onClick={() => handleAnswer(question.id, value)}
                >
                  {value}
                </button>
              ))}
            </div>
          ))}
          <button onClick={handlePrevious} disabled={currentPage === 0}>
            Previous
          </button>
          <button
            onClick={handleNext}
            disabled={!isPageComplete() || currentPage === totalPages - 1}
          >
            Next
          </button>
          {isPageComplete() && currentPage === totalPages - 1 && (
            <button onClick={calculateScores}>Submit</button>
          )}
        </div>
      ) : (
        <div>
          <h2>Your Results</h2>
          {traitOrder.map(({ number, name }) => (
            <div key={number}>
              <p>
                {name}: {scores[number]}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
