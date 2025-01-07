import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";

interface PremiumModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PremiumModal({ open, onOpenChange }: PremiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium text-lg">
                Unlock the full potential of your MBTI characters
              </h3>
              <p className="text-sm text-muted-foreground">
                Get access to premium features and enhance your chat experience
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Unlimited messages</p>
                  <p className="text-sm text-muted-foreground">
                    Chat as much as you want with your character
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Memory</p>
                  <p className="text-sm text-muted-foreground">
                    The character will have memory of the entire chat history
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">Priority access</p>
                  <p className="text-sm text-muted-foreground">
                    Priority access to all future feature releases (support for
                    character image generation)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Check className="h-5 w-5 text-purple-500 mt-0.5" />
                <div>
                  <p className="font-medium">& more!</p>
                  <p className="text-sm text-muted-foreground">
                    New features added regularly
                  </p>
                </div>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-purple-500 to-purple-400 hover:from-purple-600 hover:to-purple-500"
            onClick={() => {
              console.log("Subscribe clicked!");
            }}
          >
            Upgrade Now - $9.99/month
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}