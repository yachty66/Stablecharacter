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

export default function PremiumModal({
  open,
  onOpenChange,
}: PremiumModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Upgrade to Premium
          </DialogTitle>
        </DialogHeader>

        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-4">
          <p className="text-yellow-500 font-medium">
            You've reached the free message limit!
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Free users are limited to 20 messages. Upgrade to Premium for
            unlimited messaging.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl">
            Unlock the full potential of your MBTI characters
          </h3>

          <p className="text-muted-foreground">
            Get access to premium features and enhance your chat experience
          </p>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium">Unlimited messages</h4>
                <p className="text-sm text-muted-foreground">
                  Chat as much as you want with your character
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium">Memory</h4>
                <p className="text-sm text-muted-foreground">
                  The character will have memory of the entire chat history
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium">Priority access</h4>
                <p className="text-sm text-muted-foreground">
                  Priority access to all future feature releases (support for
                  character image generation)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Check className="h-5 w-5 text-purple-500 mt-1" />
              <div>
                <h4 className="font-medium">& more!</h4>
                <p className="text-sm text-muted-foreground">
                  New features added regularly
                </p>
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-purple-500 hover:bg-purple-600 text-white py-6 text-lg"
            onClick={() => {
              window.open(
                "https://buy.stripe.com/test_28o29Z7Mj0Xt6pG4gg",
                "_blank"
              );
            }}
          >
            Upgrade Now - $9.99/month
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
