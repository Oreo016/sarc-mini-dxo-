import { CheckCircle, AlertCircle, Lightbulb, Download } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface DiagnosisSummaryProps {
  diagnosis: string;
  confidence: number;
  evidence: string[];
  onReset: () => void;
  onDownloadTranscript: () => void;
}

export const DiagnosisSummary = ({ diagnosis, confidence, evidence, onReset, onDownloadTranscript }: DiagnosisSummaryProps) => {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 70) return "text-medical-success";
    if (conf >= 50) return "text-medical-warning";
    return "text-destructive";
  };

  return (
    <Card className="bg-gradient-to-br from-card to-primary/5 border-4 border-primary/40 p-8 space-y-6 animate-fade-in-up shadow-elevated hover-lift group">
      <div className="flex items-start gap-4 pb-4 border-b-2 border-primary/20">
        <CheckCircle className="w-10 h-10 text-medical-success animate-pulse-glow flex-shrink-0" />
        <div className="flex-1">
          <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-2">Probable Diagnosis</h2>
          <p className="text-3xl font-bold text-primary leading-tight group-hover:scale-[1.02] transition-transform">{diagnosis}</p>
        </div>
      </div>

      <div className="flex items-center justify-between p-4 bg-background/50 rounded-2xl">
        <div className="flex items-center gap-3">
          <AlertCircle className={`w-6 h-6 ${getConfidenceColor(confidence)}`} />
          <span className="text-sm font-medium text-muted-foreground">Confidence Score</span>
        </div>
        <span className={`text-3xl font-bold ${getConfidenceColor(confidence)} animate-pulse`}>{confidence}%</span>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Lightbulb className="w-6 h-6 text-primary animate-pulse-glow" />
          <h3 className="text-base font-bold text-foreground">Key Evidence</h3>
        </div>
        <ul className="space-y-3">
          {evidence.map((item, index) => (
            <li 
              key={index} 
              className="text-base text-foreground leading-relaxed pl-4 p-3 bg-background/50 rounded-xl hover:bg-background transition-all duration-200 animate-fade-in-up hover:scale-[1.01] cursor-default"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-primary font-bold mr-2">•</span>
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="pt-4 flex flex-col gap-3">
        <Button onClick={onDownloadTranscript} variant="outline" className="w-full h-12 text-base hover-lift hover:border-primary/40 hover:bg-primary/5">
          <Download className="w-5 h-5 mr-2" />
          Download Full Transcript
        </Button>
        <Button onClick={onReset} className="w-full h-12 text-base hover-lift hover:shadow-medical">
          🔄 Start New Diagnosis
        </Button>
      </div>

      <div className="pt-4 text-xs text-muted-foreground text-center border-t-2 border-primary/10">
        <p className="italic leading-relaxed bg-background/50 p-4 rounded-xl">
          ⚠️ This is an AI simulation for educational purposes only. Always consult a qualified healthcare professional for medical advice.
        </p>
      </div>
    </Card>
  );
};
