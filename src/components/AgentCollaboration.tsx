import { Activity, Search, Brain, ChevronDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

interface Agent {
  name: string;
  status: string;
  icon: "symptom" | "research" | "diagnosis";
}

interface AgentCollaborationProps {
  agents: Agent[];
  confidence?: number;
}

const iconMap = {
  symptom: Activity,
  research: Search,
  diagnosis: Brain,
};

export const AgentCollaboration = ({ agents, confidence }: AgentCollaborationProps) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-2 border-primary/20 shadow-elevated group">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="w-full p-6 flex items-center justify-between hover:bg-primary/5 transition-colors duration-200">
          <div className="flex items-center gap-3">
            <Brain className="w-6 h-6 text-primary animate-pulse-glow group-hover:scale-110 transition-transform" />
            <h3 className="text-base font-bold text-primary">AI Agents Collaborating</h3>
          </div>
          <ChevronDown 
            className={`w-5 h-5 text-primary transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          />
        </CollapsibleTrigger>

        <CollapsibleContent className="bg-card/50 backdrop-blur-sm z-50">
          <div className="p-6 space-y-3 animate-fade-in-up">
            {agents.map((agent, index) => {
              const Icon = iconMap[agent.icon];
              return (
                <div 
                  key={index} 
                  className="flex items-center gap-4 text-sm p-3 rounded-xl bg-card hover:shadow-card transition-all duration-200 cursor-pointer animate-fade-in-up hover:scale-[1.02]"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="p-2.5 bg-primary/15 rounded-xl">
                    <Icon className="w-5 h-5 text-primary flex-shrink-0" />
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold text-foreground block">{agent.name}</span>
                    <span className="text-muted-foreground text-xs">{agent.status}</span>
                  </div>
                </div>
              );
            })}

            {confidence !== undefined && (
              <div className="pt-4 border-t-2 border-primary/10 space-y-3 animate-fade-in-up">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground font-medium">Diagnosis Confidence</span>
                  <span className="font-bold text-primary text-lg animate-pulse">{confidence}%</span>
                </div>
                <Progress value={confidence} className="h-3 transition-all duration-500" />
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
