"use client";

import Image from "next/image";
import Link from "next/link";
import { RefreshCcw, Settings, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, FormEvent } from "react";

interface Message {
  text: string;
  isUser: boolean;
}

export default function MessagingInterface() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      // Add user message
      const userMessage = { text: inputValue, isUser: true };
      setMessages((prev) => [...prev, userMessage]);

      try {
        // Send the entire message history to the backend
        const response = await fetch("/api/py/message_response", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify([...messages, userMessage]),
        });

        const data = await response.json();

        // Add system response
        setMessages((prev) => [...prev, { text: data.message, isUser: false }]);
      } catch (error) {
        console.error("Error:", error);
        // Handle error appropriately
      }

      setInputValue("");
    }
  };

  return (
    <div className="flex justify-center bg-background min-h-screen">
      <div className="flex flex-col w-full max-w-3xl">
        {/* Header */}
        <header className="flex items-center justify-between px-4 py-2 border-b">
          <Button variant="ghost" size="icon">
            <RefreshCcw className="h-5 w-5 text-muted-foreground" />
          </Button>

          <div className="flex items-center gap-2">
            <span className="font-medium">Faith</span>
            <Image
              src="/placeholder.svg"
              alt="Profile"
              width={24}
              height={24}
              className="rounded-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <span className="sr-only">Share</span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-muted-foreground"
              >
                <path
                  d="M5 7.5C5 8.32843 4.32843 9 3.5 9C2.67157 9 2 8.32843 2 7.5C2 6.67157 2.67157 6 3.5 6C4.32843 6 5 6.67157 5 7.5ZM5.5 7.5C5.5 8.60457 4.60457 9.5 3.5 9.5C2.39543 9.5 1.5 8.60457 1.5 7.5C1.5 6.39543 2.39543 5.5 3.5 5.5C4.60457 5.5 5.5 6.39543 5.5 7.5Z"
                  fill="currentColor"
                />
                <path
                  d="M13 7.5C13 8.32843 12.3284 9 11.5 9C10.6716 9 10 8.32843 10 7.5C10 6.67157 10.6716 6 11.5 6C12.3284 6 13 6.67157 13 7.5ZM13.5 7.5C13.5 8.60457 12.6046 9.5 11.5 9.5C10.3954 9.5 9.5 8.60457 9.5 7.5C9.5 6.39543 10.3954 5.5 11.5 5.5C12.6046 5.5 13.5 6.39543 13.5 7.5Z"
                  fill="currentColor"
                />
                <path
                  d="M7 3.5C7 4.32843 6.32843 5 5.5 5C4.67157 5 4 4.32843 4 3.5C4 2.67157 4.67157 2 5.5 2C6.32843 2 7 2.67157 7 3.5ZM7.5 3.5C7.5 4.60457 6.60457 5.5 5.5 5.5C4.39543 5.5 3.5 4.60457 3.5 3.5C3.5 2.39543 4.39543 1.5 5.5 1.5C6.60457 1.5 7.5 2.39543 7.5 3.5Z"
                  fill="currentColor"
                />
                <path
                  d="M7 11.5C7 12.3284 6.32843 13 5.5 13C4.67157 13 4 12.3284 4 11.5C4 10.6716 4.67157 10 5.5 10C6.32843 10 7 10.6716 7 11.5ZM7.5 11.5C7.5 12.6046 6.60457 13.5 5.5 13.5C4.39543 13.5 3.5 12.6046 3.5 11.5C3.5 10.3954 4.39543 9.5 5.5 9.5C6.60457 9.5 7.5 10.3954 7.5 11.5Z"
                  fill="currentColor"
                />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5 text-muted-foreground" />
            </Button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4">
          <div className="text-sm text-muted-foreground text-center mb-4">
            Today 3:00 AM
          </div>

          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex items-start gap-2 mb-4 ${
                message.isUser ? "ml-auto flex-row-reverse" : ""
              } max-w-[85%]`}
            >
              <Image
                src="/placeholder.svg"
                alt="Profile"
                width={32}
                height={32}
                className="rounded-full mt-1"
              />
              <div
                className={`p-3 rounded-lg ${
                  message.isUser
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <p className="text-sm">{message.text}</p>
              </div>
            </div>
          ))}
        </main>

        {/* Footer */}
        <footer className="border-t">
          <form onSubmit={handleSubmit} className="p-4">
            <div className="flex items-center gap-2">
              <Input
                placeholder="Message"
                className="bg-muted"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
              />
              <Button type="submit" size="icon" variant="ghost">
                <Send className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </form>

          <div className="flex justify-between items-center px-4 py-2 text-xs text-muted-foreground">
            <div className="flex items-center gap-2">
              <Link href="#" className="hover:underline">
                friend © 2024
              </Link>
              <Link href="#" className="hover:underline">
                company →
              </Link>
            </div>
            <div className="flex items-center gap-2">
              <Link href="#" className="hover:underline">
                terms & conditions →
              </Link>
              <Link href="#" className="hover:underline">
                privacy policy →
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
