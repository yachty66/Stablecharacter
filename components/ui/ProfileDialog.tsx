import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { MessageSquare, Users2 } from "lucide-react";

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
  character: {
    name: string;
    avatar: string;
    occupation: string;
    description?: string;
    mbti_type?: string;
  } | null;
  onStartChat?: () => void;
  onViewSimilarTypes?: () => void;
}

export default function ProfileDialog({
  isOpen,
  onClose,
  character,
  onStartChat,
  onViewSimilarTypes,
}: ProfileDialogProps) {
  if (!character) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-black text-white">
        <DialogHeader>
          <DialogTitle>Profile</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center gap-6 py-4">
          {/* Profile Image */}
          <div className="w-32 h-32 relative rounded-full overflow-hidden">
            <Image
              src={character.avatar}
              alt={character.name}
              fill
              className="object-cover"
            />
          </div>

          {/* Profile Info */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <h2 className="text-xl font-bold">{character.name}</h2>
              <span className="px-2 py-1 bg-white/10 rounded-full text-sm">
                {character.mbti_type}
              </span>
            </div>
            <p className="text-gray-400">{character.occupation}</p>
            {character.description && (
              <p className="text-sm text-gray-300 mt-4">
                {character.description}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 w-full mt-4">
            <Button
              className="flex-1 bg-white text-black hover:bg-white/90"
              onClick={onStartChat}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Chat
            </Button>
            <Button
              variant="outline"
              className="flex-1 border-white/20 hover:bg-white/10"
              onClick={onViewSimilarTypes}
            >
              <Users2 className="w-4 h-4 mr-2" />
              Similar Types
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
