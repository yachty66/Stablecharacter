import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface ChatListProps {
  supabase: any;
  userEmail: string;
  characterGroups: any;
  onChatSelect: (character_id: string) => void;
  selectedCharacter: string | null;
}

export default function ChatList({
  supabase,
  userEmail,
  characterGroups,
  onChatSelect,
  selectedCharacter,
}: ChatListProps) {
  const [chats, setChats] = useState<any[]>([]);

  useEffect(() => {
    const loadChats = async () => {
      const { data, error } = await supabase
        .from("chats")
        .select("*")
        .eq("email", userEmail)
        .order("created_at", { ascending: false });

      if (!error && data) {
        setChats(data);
      }
    };

    loadChats();
  }, [supabase, userEmail]);

  const getCharacterInfo = (character_id: string) => {
    for (const group of Object.values(characterGroups)) {
      if (character_id in group.characters) {
        return group.characters[character_id];
      }
    }
    return null;
  };

  return (
    <div className="w-80 border-r h-full flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-semibold">Your Conversations</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => {
          const character = getCharacterInfo(chat.character_id);
          if (!character) return null;

          return (
            <Button
              key={chat.character_id}
              variant="ghost"
              className={`w-full justify-start px-4 py-3 h-auto ${
                selectedCharacter === chat.character_id ? "bg-muted" : ""
              }`}
              onClick={() => onChatSelect(chat.character_id)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                  <Image
                    src={character.avatar}
                    alt={character.name}
                    width={40}
                    height={40}
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col items-start">
                  <span className="font-medium">{character.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {chat.character_id.split("_")[0].toUpperCase()}
                  </span>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </div>
  );
}
