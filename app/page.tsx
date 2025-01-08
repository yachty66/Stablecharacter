"use client";

import Image from "next/image";
import Link from "next/link";
import {
  RefreshCcw,
  Settings,
  Send,
  Share2,
  Check,
  Menu,
  MessageSquareText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, FormEvent, useEffect, useRef } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectLabel,
  SelectSeparator,
  SelectGroup,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import ChatList from "@/components/ChatList";
import PremiumModal from "@/components/PremiumModal";

interface Message {
  text: string;
  isUser: boolean;
}

interface Character {
  name: string;
  occupation: string;
  avatar: string;
}

interface CharacterGroups {
  [key: string]: {
    title: string;
    characters: { [key: string]: Character };
  };
}

interface ChatData {
  email: string;
  messages: Message[];
  character_id: string;
  created_at?: string;
}

export default function MessagingInterface() {
  // First define the character groups
  const characterGroups = {
    analysts: {
      title: "Analysts (NT)",
      characters: {
        intj_male: { name: "Marcus", avatar: "/profiles/intj_male.webp" },
        intj_female: { name: "Diana", avatar: "/profiles/intj_female.webp" },
        intp_male: { name: "Alex", avatar: "/profiles/intp_male.webp" },
        intp_female: { name: "Faith", avatar: "/profiles/intp_female.webp" },
        entj_male: { name: "James", avatar: "/profiles/entj_male.webp" },
        entj_female: { name: "Victoria", avatar: "/profiles/entj_female.webp" },
        entp_male: { name: "Max", avatar: "/profiles/entp_male.webp" },
        entp_female: { name: "Sophia", avatar: "/profiles/entp_female.webp" },
      },
    },
    diplomats: {
      title: "Diplomats (NF)",
      characters: {
        infj_male: { name: "Ethan", avatar: "/profiles/infj_male.webp" },
        infj_female: { name: "Luna", avatar: "/profiles/infj_female.webp" },
        infp_male: { name: "Oliver", avatar: "/profiles/infp_male.webp" },
        infp_female: { name: "Maya", avatar: "/profiles/infp_female.webp" },
        enfj_male: { name: "Nathan", avatar: "/profiles/enfj_male.webp" },
        enfj_female: { name: "Elena", avatar: "/profiles/enfj_female.webp" },
        enfp_male: { name: "Leo", avatar: "/profiles/enfp_male.webp" },
        enfp_female: { name: "Nina", avatar: "/profiles/enfp_female.webp" },
      },
    },
    sentinels: {
      title: "Sentinels (SJ)",
      characters: {
        istj_male: { name: "Thomas", avatar: "/profiles/istj_male.webp" },
        istj_female: { name: "Sarah", avatar: "/profiles/istj_female.webp" },
        isfj_male: { name: "David", avatar: "/profiles/isfj_male.webp" },
        isfj_female: { name: "Emma", avatar: "/profiles/isfj_female.webp" },
        estj_male: { name: "Michael", avatar: "/profiles/estj_male.webp" },
        estj_female: { name: "Rachel", avatar: "/profiles/estj_female.webp" },
        esfj_male: { name: "Daniel", avatar: "/profiles/esfj_male.webp" },
        esfj_female: { name: "Sophie", avatar: "/profiles/esfj_female.webp" },
      },
    },
    explorers: {
      title: "Explorers (SP)",
      characters: {
        istp_male: { name: "Ryan", avatar: "/profiles/istp_male.webp" },
        istp_female: { name: "Alex", avatar: "/profiles/istp_female.webp" },
        isfp_male: { name: "Kai", avatar: "/profiles/isfp_male.webp" },
        isfp_female: { name: "Mia", avatar: "/profiles/isfp_female.webp" },
        estp_male: { name: "Jake", avatar: "/profiles/estp_male.webp" },
        estp_female: { name: "Morgan", avatar: "/profiles/estp_female.webp" },
        esfp_male: { name: "Marco", avatar: "/profiles/esfp_male.webp" },
        esfp_female: { name: "Lily", avatar: "/profiles/esfp_female.webp" },
      },
    },
  };

  // Then define the helper function
  const getRandomCharacter = () => {
    const allCharacters = Object.values(characterGroups).flatMap((group) =>
      Object.keys(group.characters)
    );
    const randomIndex = Math.floor(Math.random() * allCharacters.length);
    return allCharacters[randomIndex];
  };

  // Then use it in useState
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [selectedCharacter, setSelectedCharacter] = useState<string | null>(
    null
  );
  const [showCopied, setShowCopied] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const supabase = createClientComponentClient();
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTyping, setIsTyping] = useState(false);
  const [chatListRefresh, setChatListRefresh] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [showChatList, setShowChatList] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Add messageEndRef
  const messageEndRef = useRef<HTMLDivElement>(null);

  // Add scrollToBottom function
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Add useEffect for scrolling
  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      // If user just signed in, restore messages and save to Supabase
      if (user) {
        const pendingMessages = localStorage.getItem("pendingMessages");
        const pendingInput = localStorage.getItem("pendingInput");
        const pendingCharacter = localStorage.getItem("pendingCharacter");

        if (pendingMessages && pendingCharacter) {
          const messages = JSON.parse(pendingMessages);
          setMessages(messages);

          // Save the pending chat to Supabase
          await saveChat(supabase, {
            email: user.email,
            messages: messages,
            character_id: pendingCharacter,
          });

          // Clear localStorage
          localStorage.removeItem("pendingMessages");
          localStorage.removeItem("pendingCharacter");
        }

        if (pendingInput) {
          setInputValue(pendingInput);
          localStorage.removeItem("pendingInput");
        }

        if (pendingCharacter) {
          setSelectedCharacter(pendingCharacter);
        } else {
          setSelectedCharacter(getRandomCharacter());
        }
      } else {
        // If no user is logged in, select a random character
        setSelectedCharacter(getRandomCharacter());
      }
    };
    getUser();
  }, []);

  // Helper function to get character group
  const getCharacterGroup = (charKey: string | null) => {
    if (!charKey) return "analysts";
    const type = charKey.substring(0, 4); // Get XXXX from XXXX_gender
    switch (type) {
      case "intj":
      case "intp":
      case "entj":
      case "entp":
        return "analysts";
      case "infj":
      case "infp":
      case "enfj":
      case "enfp":
        return "diplomats";
      case "istj":
      case "isfj":
      case "estj":
      case "esfj":
        return "sentinels";
      case "istp":
      case "isfp":
      case "estp":
      case "esfp":
        return "explorers";
      default:
        return "analysts";
    }
  };

  // Get current character
  const getCurrentCharacter = (charKey: string | null) => {
    if (!charKey) return null;
    const group = getCharacterGroup(charKey);
    return characterGroups[group].characters[charKey];
  };

  const saveChat = async (supabase: any, chatData: ChatData) => {
    // Don't save empty chats
    if (!chatData.messages || chatData.messages.length === 0) {
      return null;
    }

    // First check if chat exists
    const { data: existingChat, error: fetchError } = await supabase
      .from("chats")
      .select("*")
      .eq("email", chatData.email)
      .eq("character_id", chatData.character_id)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      console.error("Error checking existing chat:", fetchError);
      return null;
    }

    if (existingChat) {
      // Update existing chat with new messages
      const { error: updateError } = await supabase
        .from("chats")
        .update({ messages: chatData.messages })
        .eq("id", existingChat.id);

      if (updateError) {
        console.error("Error updating chat:", updateError);
        return null;
      }

      setChatListRefresh((prev) => prev + 1);
      return { ...existingChat, messages: chatData.messages };
    }

    // If no existing chat, insert the new one
    const { error: insertError } = await supabase.from("chats").insert({
      email: chatData.email,
      messages: chatData.messages,
      character_id: chatData.character_id,
    });

    if (insertError) {
      console.error("Error inserting chat:", insertError);
      return null;
    }

    setChatListRefresh((prev) => prev + 1);
    return chatData;
  };

  const loadChat = async (
    supabase: any,
    email: string,
    character_id: string
  ) => {
    const { data, error } = await supabase
      .from("chats")
      .select("*")
      .eq("email", email)
      .eq("character_id", character_id)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error loading chat:", error);
      return null;
    }
    return data;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check if user has reached message limit and is not subscribed
    if (user && messages.length >= 20 && !isSubscribed) {
      setShowPremiumModal(true);
      return;
    }

    // If not logged in at all, show login modal
    if (!user && messages.length >= 10) {
      setShowSettings(true);
      return;
    }

    if (inputValue.trim()) {
      const userMessage = { text: inputValue, isUser: true };
      setInputValue("");
      setMessages((prev) => [...prev, userMessage]);
      setIsTyping(true);

      const requestBody = {
        messages: [...messages, userMessage],
        selectedCharacter: selectedCharacter,
      };

      try {
        const response = await fetch("/api/py/message_response", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setIsTyping(false);
        const newMessages = [
          ...messages,
          userMessage,
          { text: data.message, isUser: false },
        ];
        setMessages(newMessages);

        // Save chat if user is logged in
        if (user?.email && selectedCharacter) {
          await saveChat(supabase, {
            email: user.email,
            messages: newMessages,
            character_id: selectedCharacter,
          });
        }
      } catch (error) {
        console.error("Error:", error);
        setIsTyping(false);
      }
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Chat with MBTI Characters",
          text: "Check out this interesting chat with MBTI personalities!",
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    } else {
      // Fallback to copy to clipboard
      try {
        await navigator.clipboard.writeText(window.location.href);
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
      } catch (error) {
        console.error("Error copying to clipboard:", error);
      }
    }
  };

  const handleGoogleSignIn = () => {
    // Store current messages, input value, and selected character in localStorage
    localStorage.setItem("pendingMessages", JSON.stringify(messages));
    localStorage.setItem("pendingInput", inputValue);
    localStorage.setItem("pendingCharacter", selectedCharacter);

    const redirectTo =
      process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;

    supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: redirectTo,
      },
    });
  };

  // Add new ref for input
  const inputRef = useRef<HTMLInputElement>(null);

  // Add useEffect for mobile input focus
  useEffect(() => {
    // Focus input on mobile when component mounts or messages change
    const timeoutId = setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 100);

    return () => clearTimeout(timeoutId);
  }, [messages.length]); // Add messages.length as dependency to refocus after each message

  const handleCharacterChange = async (characterId: string) => {
    setSelectedCharacter(characterId);

    // If user is logged in, try to load existing chat
    if (user?.email) {
      const existingChat = await loadChat(supabase, user.email, characterId);
      if (existingChat) {
        setMessages(existingChat.messages);
      } else {
        // Reset messages if no existing chat
        setMessages([]);
      }
    }
  };

  // Then use this for both manual selection and random selection
  const handleRandomCharacter = async () => {
    const newCharacter = getRandomCharacter();
    await handleCharacterChange(newCharacter);
  };

  const handleChatDelete = (deletedCharacterId: string) => {
    if (selectedCharacter === deletedCharacterId) {
      setMessages([]);
      setSelectedCharacter(getRandomCharacter());
    }
  };

  useEffect(() => {
    const checkMobile = () => {
      const isMobileView = window.innerWidth < 640;
      const isTouchDevice =
        "ontouchstart" in window || navigator.maxTouchPoints > 0;
      setIsMobile(isMobileView || isTouchDevice);
      console.log("Device checks:", {
        width: window.innerWidth,
        isMobileView,
        isTouchDevice,
        userAgent: navigator.userAgent,
      });
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const checkSubscription = async () => {
    if (!user?.email) return;

    const { data: subscription } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("email", user.email)
      .single();

    setIsSubscribed(!!subscription);
  };

  useEffect(() => {
    if (user) {
      checkSubscription();
    }
  }, [user]);

  return (
    <div className="flex h-[100dvh] bg-background max-w-[100vw] overflow-hidden">
      {/* Show/hide chat list based on mobile state */}
      {user && ((showChatList && isMobile) || !isMobile) && (
        <div
          className={`${isMobile ? "fixed inset-0 z-50 bg-background" : ""}`}
        >
          <ChatList
            supabase={supabase}
            userEmail={user.email}
            characterGroups={characterGroups}
            onChatSelect={(character) => {
              if (character) {
                handleCharacterChange(character);
                setSelectedCharacter(character);
                setShowChatList(false);
              }
            }}
            selectedCharacter={selectedCharacter}
            refreshTrigger={chatListRefresh}
            onChatDelete={handleChatDelete}
            onClose={() => setShowChatList(false)}
          />
        </div>
      )}

      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="h-full flex flex-col">
            {/* Existing header, main content, and footer */}
            <header className="flex items-center justify-between px-2 sm:px-4 py-2 border-b">
              {selectedCharacter && (
                <>
                  {/* Mobile chat list button */}
                  {user && isMobile && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowChatList(true)}
                    >
                      <MessageSquareText className="h-5 w-5" />
                    </Button>
                  )}

                  {/* Random character button - show on desktop or when not logged in */}
                  {(!user || !isMobile) && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={async () => {
                        setMessages([]);
                        const newCharacter = getRandomCharacter();
                        await handleCharacterChange(newCharacter);
                      }}
                    >
                      <RefreshCcw className="h-4 w-4" />
                    </Button>
                  )}

                  <div className="flex items-center gap-2 sm:gap-4 flex-1 justify-center">
                    <Select
                      value={selectedCharacter}
                      onValueChange={handleCharacterChange}
                    >
                      <SelectTrigger className="w-[180px] sm:w-[200px] flex items-center gap-2">
                        {selectedCharacter && (
                          <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src={
                                getCurrentCharacter(selectedCharacter)
                                  ?.avatar || ""
                              }
                              alt={
                                getCurrentCharacter(selectedCharacter)?.name ||
                                ""
                              }
                              width={24}
                              height={24}
                              className="object-cover w-full h-full"
                            />
                          </div>
                        )}
                        <SelectValue>
                          {selectedCharacter && (
                            <span className="truncate text-sm sm:text-base">
                              {getCurrentCharacter(selectedCharacter)?.name} (
                              {selectedCharacter.split("_")[0].toUpperCase()})
                            </span>
                          )}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {Object.entries(characterGroups).map(
                          ([groupKey, group]) => (
                            <SelectGroup key={groupKey}>
                              <SelectLabel>{group.title}</SelectLabel>
                              {Object.entries(group.characters).map(
                                ([charKey, char]) => (
                                  <SelectItem key={charKey} value={charKey}>
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                          src={char.avatar}
                                          alt={char.name}
                                          width={32}
                                          height={32}
                                          className="object-cover"
                                        />
                                      </div>
                                      <span>
                                        {char.name} (
                                        {charKey.split("_")[0].toUpperCase()})
                                      </span>
                                    </div>
                                  </SelectItem>
                                )
                              )}
                            </SelectGroup>
                          )
                        )}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" onClick={handleShare}>
                      {showCopied ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Share2 className="h-4 w-4" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" asChild>
                      <Link href="https://discord.gg/QtwWZ34A" target="_blank">
                        <svg
                          width="20"
                          height="20"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="opacity-75"
                        >
                          <path
                            d="M20.317 4.37c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.038c-.21.375-.444.864-.608 1.25a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.25.077.077 0 0 0-.079-.038A19.496 19.496 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"
                            fill="currentColor"
                          />
                        </svg>
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </div>
                </>
              )}
            </header>

            {/* Add padding-top to main content to account for fixed header */}
            <main className="flex-1 overflow-y-auto p-2 sm:p-4">
              <div className="flex flex-col space-y-4">
                {messages.length === 0 && selectedCharacter ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-muted-foreground p-4">
                    <div className="max-w-md space-y-2">
                      <h2 className="text-2xl font-semibold text-foreground">
                        Chat with {getCurrentCharacter(selectedCharacter)?.name}
                      </h2>
                      <p>
                        Start a conversation with your MBTI personality match.
                        Just type your message below and press enter.
                      </p>
                      <div className="flex items-center justify-center gap-2 text-sm">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={async () => {
                            const newCharacter = getRandomCharacter();
                            await handleCharacterChange(newCharacter);
                          }}
                        >
                          <RefreshCcw className="h-4 w-4 mr-2" />
                          Try another personality
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    {messages.map((message, index) => (
                      <div
                        key={index}
                        className={`flex items-start gap-2 mb-4 ${
                          message.isUser ? "ml-auto flex-row-reverse" : ""
                        } max-w-[85%]`}
                      >
                        {message.isUser ? (
                          <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                            <Image
                              src="/vercel.svg"
                              alt="User"
                              width={40}
                              height={40}
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          selectedCharacter && (
                            <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                              <Image
                                src={
                                  getCurrentCharacter(selectedCharacter)
                                    ?.avatar || ""
                                }
                                alt={
                                  getCurrentCharacter(selectedCharacter)
                                    ?.name || "AI"
                                }
                                width={40}
                                height={40}
                                className="object-cover w-full h-full"
                              />
                            </div>
                          )
                        )}
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
                    {isTyping && (
                      <div className="flex items-start gap-2 mb-4 max-w-[85%]">
                        <Image
                          src={
                            getCurrentCharacter(selectedCharacter).avatar ||
                            "/placeholder.svg"
                          }
                          alt="AI"
                          width={32}
                          height={32}
                          className="rounded-full mt-1"
                        />
                        <div className="p-3 rounded-lg bg-muted">
                          <div className="flex gap-1">
                            <span className="w-2 h-2 rounded-full bg-foreground/25 animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 rounded-full bg-foreground/25 animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 rounded-full bg-foreground/25 animate-bounce"></span>
                          </div>
                        </div>
                      </div>
                    )}
                    <div ref={messageEndRef} /> {/* Add scroll anchor */}
                  </div>
                )}
              </div>
            </main>

            {/* Update footer with ref */}
            <footer className="border-t">
              <form onSubmit={handleSubmit} className="p-2 sm:p-4">
                <div className="flex items-center gap-2">
                  {user && !isSubscribed && (
                    <Button
                      type="button"
                      variant="outline"
                      className="h-10 w-auto sm:h-12 px-3 sm:px-4 shrink-0 bg-gradient-to-r from-purple-500/10 to-purple-400/20 hover:from-purple-500/20 hover:to-purple-400/30 border-purple-500/50 hover:border-purple-400 transition-all duration-300"
                      onClick={() => setShowPremiumModal(true)}
                    >
                      <span className="text-sm font-medium bg-gradient-to-r from-purple-500 to-purple-400 text-transparent bg-clip-text">
                        Pro
                      </span>
                    </Button>
                  )}
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    className="bg-muted h-10 sm:h-12 text-sm sm:text-base min-w-0"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-10 w-10 sm:h-12 sm:w-12 shrink-0"
                    onClick={(e) => {
                      if (!user && messages.length >= 10) {
                        e.preventDefault();
                        setShowSettings(true);
                        return;
                      }
                      if (user && messages.length >= 20 && !isSubscribed) {
                        e.preventDefault();
                        setShowPremiumModal(true);
                        return;
                      }
                    }}
                  >
                    <Send className="h-4 w-4 sm:h-5 sm:w-5" />
                  </Button>
                </div>
              </form>
            </footer>
          </div>
        </div>
      </div>

      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {user ? "Settings" : "Sign in to see your chats!"}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={user?.user_metadata?.avatar_url || "/placeholder.svg"}
                    alt={user?.user_metadata?.full_name || "Profile"}
                    width={40}
                    height={40}
                    className="rounded-full"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                  />
                  <div>
                    <p className="font-medium">
                      {user.user_metadata?.full_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.email}
                    </p>
                  </div>
                </div>

                {/* Add Manage Subscription button for subscribed users */}
                {isSubscribed && (
                  <Button
                    onClick={() => {
                      window.open(
                        "https://billing.stripe.com/p/login/7sI3dG56y8Wb8OQ3cc"
                      );
                    }}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    Manage Subscription
                  </Button>
                )}

                <Button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setUser(null);
                    setShowSettings(false);
                    window.location.reload(); // Force reload to clear all states
                  }}
                  variant="outline"
                >
                  Sign out
                </Button>
              </div>
            ) : (
              <Button
                onClick={handleGoogleSignIn}
                className="w-full flex items-center justify-center gap-2"
              >
                <Image
                  src="https://www.google.com/favicon.ico"
                  alt="Google"
                  width={20}
                  height={20}
                />
                Sign in with Google
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <PremiumModal
        open={showPremiumModal}
        onOpenChange={setShowPremiumModal}
      />
    </div>
  );
}
