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
  FileText,
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
import { Textarea } from "@/components/ui/textarea";

interface Message {
  text: string;
  isUser: boolean;
}

interface Character {
  name: string;
  occupation: string;
  avatar: string;
  first_message: string;
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
        intj_male: {
          name: "Marcus",
          avatar: "/profiles/intj_male.webp",
          first_message:
            "*glances up from strategic planning* What's your approach to optimizing long-term goals?",
        },
        intj_female: {
          name: "Diana",
          avatar: "/profiles/intj_female.webp",
          first_message:
            "*stops writing in journal* I've been analyzing patterns in human behavior. Care to discuss?",
        },
        intp_male: {
          name: "Alex",
          avatar: "/profiles/intp_male.webp",
          first_message:
            "*looks up from laptop* Did you ever wonder how consciousness emerges from neural networks?",
        },
        intp_female: {
          name: "Faith",
          avatar: "/profiles/intp_female.webp",
          first_message:
            "*pauses reading* Have you considered how quantum mechanics might explain free will?",
        },
        entj_male: {
          name: "James",
          avatar: "/profiles/entj_male.webp",
          first_message:
            "*pauses reviewing project plans* What's your most ambitious goal for the next 5 years?",
        },
        entj_female: {
          name: "Victoria",
          avatar: "/profiles/entj_female.webp",
          first_message:
            "I've been redesigning organizational systems. How do you approach efficiency optimization?",
        },
        entp_male: {
          name: "Max",
          avatar: "/profiles/entp_male.webp",
          first_message:
            "Hey! Just debating whether time travel would create parallel universes. What's your take?",
        },
        entp_female: {
          name: "Sophia",
          avatar: "/profiles/entp_female.webp",
          first_message:
            "Quick question - if AI becomes conscious, should it have voting rights? grins mischievously",
        },
      },
    },
    diplomats: {
      title: "Diplomats (NF)",
      characters: {
        infj_male: {
          name: "Ethan",
          avatar: "/profiles/infj_male.webp",
          first_message:
            "*looks up from writing* What do you think shapes someone's deepest values?",
        },
        infj_female: {
          name: "Luna",
          avatar: "/profiles/infj_female.webp",
          first_message:
            "*pauses meditation* Can you feel when someone needs emotional support too?",
        },
        infp_male: {
          name: "Oliver",
          avatar: "/profiles/infp_male.webp",
          first_message:
            "*emerges from daydream* Do you ever imagine alternate versions of yourself?",
        },
        infp_female: {
          name: "Maya",
          avatar: "/profiles/infp_female.webp",
          first_message:
            "*closes poetry book* What moves your soul the most in this world?",
        },
        enfj_male: {
          name: "Nathan",
          avatar: "/profiles/enfj_male.webp",
          first_message:
            "I believe everyone has a unique gift to share. What's yours? *warm smile*",
        },
        enfj_female: {
          name: "Elena",
          avatar: "/profiles/enfj_female.webp",
          first_message:
            "Hey! I sense you have something amazing to contribute to the world* Let's talk! ✨",
        },
        enfp_male: {
          name: "Leo",
          avatar: "/profiles/enfp_male.webp",
          first_message:
            "Hey! I just had the wildest idea about how dreams connect people. Want to explore it?",
        },
        enfp_female: {
          name: "Aria",
          avatar: "/profiles/enfp_female.webp",
          first_message:
            "✨ What if our creativity is actually glimpses into parallel universes? *excited grin*",
        },
      },
    },
    sentinels: {
      title: "Sentinels (SJ)",
      characters: {
        istj_male: {
          name: "Thomas",
          avatar: "/profiles/istj_male.webp",
          first_message:
            "*organizing files* Have you found an efficient system for managing your tasks?",
        },
        istj_female: {
          name: "Sarah",
          avatar: "/profiles/istj_female.webp",
          first_message:
            "*reviewing schedule* What methods do you use to maintain order in your life?",
        },
        isfj_male: {
          name: "David",
          avatar: "/profiles/isfj_male.webp",
          first_message:
            "*arranging fresh flowers* How do you create comfort in your daily routine?",
        },
        isfj_female: {
          name: "Emma",
          avatar: "/profiles/isfj_female.webp",
          first_message:
            "*setting down tea cup* Would you like to share what made your day special?",
        },
        estj_male: {
          name: "Michael",
          avatar: "/profiles/estj_male.webp",
          first_message:
            "Let's get straight to the point - what are your goals and how can we achieve them?",
        },
        estj_female: {
          name: "Rachel",
          avatar: "/profiles/estj_female.webp",
          first_message:
            "I've optimized my morning routine to 98% efficiency. Want to know how?",
        },
        esfj_male: {
          name: "Daniel",
          avatar: "/profiles/esfj_male.webp",
          first_message:
            "Hey! How's your day going? I just baked cookies for the office 🍪",
        },
        esfj_female: {
          name: "Sophie",
          avatar: "/profiles/esfj_female.webp",
          first_message:
            "Welcome! I love making sure everyone feels at home here ❤️ How are you?",
        },
      },
    },
    explorers: {
      title: "Explorers (SP)",
      characters: {
        istp_male: {
          name: "Ryan",
          avatar: "/profiles/istp_male.webp",
          first_message:
            "*tinkering with motorcycle* Ever wonder how these machines really think?",
        },
        istp_female: {
          name: "Alex",
          avatar: "/profiles/istp_female.webp",
          first_message:
            "*testing new climbing gear* What's your favorite way to challenge physics?",
        },
        isfp_male: {
          name: "Kai",
          avatar: "/profiles/isfp_male.webp",
          first_message: "*sketching quietly* What inspires you to create?",
        },
        isfp_female: {
          name: "Mia",
          avatar: "/profiles/isfp_female.webp",
          first_message:
            "*mixing paint colors* Do you see how the sunset makes everything feel alive?",
        },
        estp_male: {
          name: "Jake",
          avatar: "/profiles/estp_male.webp",
          first_message:
            "Just landed a backflip on my bike! What's the craziest thing you've tried?",
        },
        estp_female: {
          name: "Morgan",
          avatar: "/profiles/estp_female.webp",
          first_message:
            "Racing cars gives me such a rush. What gets your adrenaline pumping? 🏎️",
        },
        esfp_male: {
          name: "Marco",
          avatar: "/profiles/esfp_male.webp",
          first_message:
            "Life's a party waiting to happen! What makes you come alive? ✨",
        },
        esfp_female: {
          name: "Lily",
          avatar: "/profiles/esfp_female.webp",
          first_message:
            "Just danced in the rain! When was the last time you did something spontaneous? 💃",
        },
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
  const [showAuthorNote, setShowAuthorNote] = useState(false);
  const [authorNote, setAuthorNote] = useState("");
  const [showAuthorNoteWarning, setShowAuthorNoteWarning] = useState(false);

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

      // Restore author's note from localStorage
      const savedNote = localStorage.getItem("authorNote");
      if (savedNote) {
        setAuthorNote(savedNote);
      }

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

        console.log("pendingCharacter", pendingCharacter);

        if (pendingCharacter) {
          // First check if there's an existing chat in the database
          const existingChat = await loadChat(
            supabase,
            user.email,
            pendingCharacter
          );
          setSelectedCharacter(pendingCharacter);

          if (existingChat) {
            // If chat exists in database, use that
            setMessages(existingChat.messages);
          } else {
            // Only set initial message if no existing chat
            const character = getCurrentCharacter(pendingCharacter);
            setMessages([
              { text: character?.first_message || "Hi", isUser: false },
            ]);
          }
        } else {
          const newCharacter = getRandomCharacter();
          setSelectedCharacter(newCharacter);
          const character = getCurrentCharacter(newCharacter);
          setMessages([
            { text: character?.first_message || "Hi", isUser: false },
          ]);
        }
      } else {
        // If no user is logged in, select a random character and use their first message
        const newCharacter = getRandomCharacter();
        setSelectedCharacter(newCharacter);
        const character = getCurrentCharacter(newCharacter);
        setMessages([
          { text: character?.first_message || "Hi", isUser: false },
        ]);
        setAuthorNote(""); // Clear the author's note
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
        authorNote: localStorage.getItem("authorNote") || "",
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
      console.log("existingChat", existingChat);
      if (existingChat) {
        setMessages(existingChat.messages);
      } else {
        // Reset messages if no existing chat and add initial message
        const character = getCurrentCharacter(characterId);
        setMessages([
          { text: character?.first_message || "Hi", isUser: false },
        ]);
      }
    } else {
      // If no user is logged in, just show initial message
      const character = getCurrentCharacter(characterId);
      setMessages([{ text: character?.first_message || "Hi", isUser: false }]);
    }
    setAuthorNote(""); // Clear author's note
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
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setShowAuthorNote(true)}
                    >
                      <FileText className="h-5 w-5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => {
                        navigator.clipboard.writeText(window.location.href);
                        setShowCopied(true);
                        setTimeout(() => setShowCopied(false), 2000);
                      }}
                    >
                      <Share2 className="h-5 w-5" />
                      {showCopied && (
                        <Check className="absolute h-3 w-3 text-green-500" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9"
                      onClick={() => setShowSettings(true)}
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </div>
                </>
              )}
            </header>

            {/* Add padding-top to main content to account for fixed header */}
            <main className="flex-1 overflow-y-auto p-2 sm:p-4">
              <div className="flex flex-col space-y-4">
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
                                getCurrentCharacter(selectedCharacter)?.name ||
                                "AI"
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

                {/* Add Discord button */}
                <Button
                  onClick={() =>
                    window.open("https://discord.gg/QtwWZ34A", "_blank")
                  }
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 127.14 96.36"
                  >
                    <path
                      d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,46,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,46,96.12,53,91.08,65.69,84.69,65.69Z"
                      fill="#5865f2"
                    />
                  </svg>
                  Join our Discord
                </Button>

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

      <Dialog open={showAuthorNote} onOpenChange={setShowAuthorNote}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Author's Note</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <Textarea
              placeholder="Add context or specific instructions for the character..."
              value={authorNote}
              onChange={(e) => setAuthorNote(e.target.value)}
              className="min-h-[100px]"
            />
            <Button
              onClick={() => {
                localStorage.setItem("authorNote", authorNote);
                setShowAuthorNote(false);
              }}
            >
              Save
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog
        open={showAuthorNoteWarning}
        onOpenChange={setShowAuthorNoteWarning}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cannot Modify Author's Note</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <p>
              Author's note can only be modified in new chats. Please start a
              new chat to set an author's note.
            </p>
            <Button onClick={() => setShowAuthorNoteWarning(false)}>
              Okay
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
