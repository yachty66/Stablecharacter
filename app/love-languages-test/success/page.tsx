"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function SuccessContent() {
  const searchParams = useSearchParams();
  const email = searchParams?.get("email");

  return (
    <div className="min-h-[100dvh] bg-background flex flex-col relative">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-background pointer-events-none" />
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent pointer-events-none" />

      <main className="flex-1 py-8 sm:py-16 relative z-10">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-card/30 backdrop-blur-sm rounded-2xl p-6 sm:p-8 md:p-12 border border-gray-800 text-center">
            {/* Success Icon */}
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-green-500 to-green-600 mb-4 sm:mb-6">
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
                className="text-white sm:w-10 sm:h-10"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            {/* Success Message */}
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent px-2">
              Payment Successful!
            </h1>

            <p className="text-base sm:text-lg text-gray-300 mb-6 sm:mb-8 px-2">
              Thank you for purchasing the Premium Love Languages Package
            </p>

            {/* Email Confirmation */}
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
              <div className="flex items-start gap-3 sm:gap-4">
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
                  className="text-purple-400 flex-shrink-0 mt-0.5 sm:w-6 sm:h-6"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
                <div className="text-left flex-1">
                  <h3 className="font-semibold text-white mb-2 text-sm sm:text-base">
                    Check Your Email
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-300">
                    Within the next{" "}
                    <strong className="text-white">12 hours</strong>, you'll
                    receive an email{email ? ` at ${email}` : ""} with:
                  </p>
                  <ul className="mt-3 space-y-2 text-xs sm:text-sm text-gray-400">
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5"
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
                      <span>
                        Your personalized Love Languages guide and infographic
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5"
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
                      <span>Discord community invite link</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <svg
                        className="w-4 h-4 text-purple-400 flex-shrink-0 mt-0.5"
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
                      <span>Access to exclusive resources</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="text-xs sm:text-sm text-gray-400 mb-6 sm:mb-8 px-2">
              <p className="mb-2">
                If you don't receive the email within 12 hours, please check
                your spam folder.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-2">
              <Link
                href="/love-languages-test"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white text-sm sm:text-base font-semibold transition-all shadow-lg shadow-purple-500/25"
              >
                Take Test Again
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center px-5 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gray-800 hover:bg-gray-700 text-white text-sm sm:text-base font-semibold transition-all border border-gray-700"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </main>

      <footer className="border-t relative z-10">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <p className="text-sm text-muted-foreground text-center">
            © 2025 Stablecharacter. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-gray-400">Loading...</div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
