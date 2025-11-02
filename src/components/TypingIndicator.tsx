export const TypingIndicator = () => {
  return (
    <div className="flex items-center gap-4 px-6 py-4 bg-card rounded-3xl rounded-bl-sm shadow-elevated border-2 border-primary/20 animate-fade-in-up hover-lift-subtle">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-primary animate-typing shadow-medical" style={{ animationDelay: "0ms" }} />
        <div className="w-3 h-3 rounded-full bg-primary animate-typing shadow-medical" style={{ animationDelay: "200ms" }} />
        <div className="w-3 h-3 rounded-full bg-primary animate-typing shadow-medical" style={{ animationDelay: "400ms" }} />
      </div>
      <span className="text-sm text-muted-foreground animate-pulse font-medium">AI is analyzing...</span>
    </div>
  );
};
