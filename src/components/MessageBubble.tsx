import { cn } from "@/lib/utils";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
}

export const MessageBubble = ({ role, content }: MessageBubbleProps) => {
  const isUser = role === "user";

  return (
    <div 
      className={cn(
        "flex w-full group",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] px-6 py-4 rounded-3xl shadow-card transition-all duration-300",
          isUser 
            ? "bg-gradient-medical text-primary-foreground rounded-br-sm hover:shadow-medical hover:scale-[1.02]" 
            : "bg-card text-card-foreground rounded-bl-sm border-2 border-primary/10 hover:border-primary/20 hover:shadow-elevated"
        )}
      >
        <p className="text-base leading-relaxed whitespace-pre-wrap">{content}</p>
      </div>
    </div>
  );
};
