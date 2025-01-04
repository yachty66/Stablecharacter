"use client";

import Image from "next/image";
import Link from "next/link";
import { RefreshCcw, Settings, Send, Share2, Check } from "lucide-react";
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

    // If chat exists, return the existing chat without updating
    if (existingChat) {
      setMessages(existingChat.messages);
      return existingChat;
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
    if (inputValue.trim()) {
      if (messages.length >= 4 && !user) {
        setShowSettings(true);
        return;
      }

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
      } finally {
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
    // Focus input on mobile when component mounts
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

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

  return (
    <div className="flex h-screen bg-background">
      {user && (
        <ChatList
          supabase={supabase}
          userEmail={user.email}
          characterGroups={characterGroups}
          onChatSelect={handleCharacterChange}
          selectedCharacter={selectedCharacter}
          refreshTrigger={chatListRefresh}
        />
      )}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-3xl">
          <div className="h-full flex flex-col">
            {/* Existing header, main content, and footer */}
            <header className="flex items-center justify-between px-4 py-2 border-b">
              {selectedCharacter && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={async () => {
                      const newCharacter = getRandomCharacter();
                      await handleCharacterChange(newCharacter);
                    }}
                  >
                    <RefreshCcw className="h-4 w-4" />
                  </Button>

                  {/* Make select more mobile-friendly */}
                  <div className="flex items-center gap-4">
                    <Select
                      value={selectedCharacter}
                      onValueChange={handleCharacterChange}
                    >
                      <SelectTrigger className="w-[180px] sm:w-[200px]">
                        <SelectValue>
                          {selectedCharacter && (
                            <span className="truncate">
                              {
                                characterGroups[
                                  getCharacterGroup(selectedCharacter)
                                ].characters[selectedCharacter].name
                              }{" "}
                              ({selectedCharacter.split("_")[0].toUpperCase()})
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
                    {getCurrentCharacter(selectedCharacter)?.avatar && (
                      <div className="w-10 h-10 rounded-full overflow-hidden">
                        <Image
                          src={getCurrentCharacter(selectedCharacter).avatar}
                          alt={getCurrentCharacter(selectedCharacter).name}
                          width={40}
                          height={40}
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleShare}
                      className="relative"
                    >
                      <span className="sr-only">Share</span>
                      {showCopied ? (
                        <Check className="h-5 w-5 text-green-500" />
                      ) : (
                        <Share2 className="h-5 w-5 text-muted-foreground" />
                      )}
                      {showCopied && (
                        <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-xs bg-popover px-2 py-1 rounded shadow-sm whitespace-nowrap">
                          Copied to clipboard!
                        </span>
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        if (
                          confirm(
                            "Would you like to join our Discord community?"
                          )
                        ) {
                          window.open("https://discord.gg/QtwWZ34A", "_blank");
                        }
                      }}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 -28.5 256 256"
                        className="h-5 w-5 text-muted-foreground hover:text-[#5865F2]"
                        fill="currentColor"
                      >
                        <path d="M216.856339,16.5966031 C200.285002,8.84328665 182.566144,3.2084988 164.041564,0 C161.766523,4.11318106 159.108624,9.64549908 157.276099,14.0464379 C137.583995,11.0849896 118.072967,11.0849896 98.7430163,14.0464379 C96.9108417,9.64549908 94.1925838,4.11318106 91.8971895,0 C73.3526068,3.2084988 55.6133949,8.86399117 39.0420583,16.6376612 C5.61752293,67.146514 -3.4433191,116.400813 1.08711069,164.955721 C23.2560196,181.510915 44.7403634,191.567697 65.8621325,198.148576 C71.0772151,190.971126 75.7283628,183.341335 79.7352139,175.300261 C72.104019,172.400575 64.7949724,168.822202 57.8887866,164.667963 C59.7209612,163.310589 61.5131304,161.891452 63.2445898,160.431257 C105.36741,180.133187 151.134928,180.133187 192.754523,160.431257 C194.506336,161.891452 196.298154,163.310589 198.110326,164.667963 C191.183787,168.842556 183.854737,172.420929 176.223542,175.320965 C180.230393,183.341335 184.861538,190.991831 190.096624,198.16893 C211.238746,191.588051 232.743023,181.531619 254.911949,164.955721 C260.227747,108.668201 245.831087,59.8662432 216.856339,16.5966031 Z M85.4738752,135.09489 C72.8290281,135.09489 62.4592217,123.290155 62.4592217,108.914901 C62.4592217,94.5396472 72.607595,82.7145587 85.4738752,82.7145587 C98.3405064,82.7145587 108.709962,94.5189427 108.488529,108.914901 C108.508531,123.290155 98.3405064,135.09489 85.4738752,135.09489 Z M170.525237,135.09489 C157.88039,135.09489 147.510584,123.290155 147.510584,108.914901 C147.510584,94.5396472 157.658606,82.7145587 170.525237,82.7145587 C183.391518,82.7145587 193.761324,94.5189427 193.539891,108.914901 C193.539891,123.290155 183.391518,135.09489 170.525237,135.09489 Z" />
                      </svg>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                </>
              )}
            </header>

            {/* Add padding-top to main content to account for fixed header */}
            <main className="flex-1 overflow-y-auto p-4">
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
                  <>
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
                  </>
                )}
              </div>
            </main>

            {/* Update footer with ref */}
            <footer className="border-t">
              <form onSubmit={handleSubmit} className="p-4">
                <div className="flex items-center gap-2">
                  <Input
                    ref={inputRef}
                    placeholder="Type your message..."
                    className="bg-muted h-12 text-base"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-12 w-12"
                    onClick={(e) => {
                      if (messages.length >= 4 && !user) {
                        e.preventDefault();
                        setShowSettings(true);
                        return;
                      }
                    }}
                  >
                    <Send className="h-5 w-5" />
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
            <DialogTitle>Settings</DialogTitle>
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
    </div>
  );
}
