import { Brain, BookOpen, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface ReasoningCardProps {
  reasoning: string;
  reference?: {
    source: string;
    snippet: string;
  };
}

export const ReasoningCard = ({ reasoning, reference }: ReasoningCardProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="border-l-4 border-l-primary bg-gradient-to-br from-secondary/50 to-secondary/30 shadow-elevated overflow-hidden group">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-colors duration-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-primary/15 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Brain className="w-6 h-6 text-primary animate-pulse-glow" />
            </div>
            <p className="text-sm font-bold text-primary uppercase tracking-wider">AI Reasoning & References</p>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="bg-card/50 backdrop-blur-sm z-50">
          <div className="p-6 space-y-4 animate-fade-in-up">
            <div className="flex items-start gap-4">
              <div className="flex-1 space-y-2">
                <p className="text-xs font-bold text-primary uppercase tracking-wider">Reasoning</p>
                <p className="text-base text-foreground leading-relaxed">{reasoning}</p>
              </div>
            </div>

            {reference && (
              <div className="flex items-start gap-4 pt-4 border-t-2 border-primary/10 animate-fade-in-up">
                <div className="mt-1 p-3 bg-accent/15 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <BookOpen className="w-6 h-6 text-medical-info" />
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-xs font-bold text-medical-info uppercase tracking-wider">
                    Reference: {reference.source}
                  </p>
                  <p className="text-sm text-muted-foreground leading-relaxed italic bg-background/50 p-3 rounded-lg">"{reference.snippet}"</p>
                </div>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
