import { useState, useRef, useEffect } from "react";
import { Send, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageBubble } from "@/components/MessageBubble";
import { TypingIndicator } from "@/components/TypingIndicator";
import { ReasoningCard } from "@/components/ReasoningCard";
import { AgentCollaboration } from "@/components/AgentCollaboration";
import { DiagnosisSummary } from "@/components/DiagnosisSummary";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  reasoning?: string;
  reference?: { source: string; snippet: string };
  agents?: Array<{ name: string; status: string; icon: "symptom" | "research" | "diagnosis" }>;
  confidence?: number;
}

interface AIResponse {
  message: string;
  reasoning?: string;
  reference?: { source: string; snippet: string };
  agents?: Array<{ name: string; status: string; icon: "symptom" | "research" | "diagnosis" }>;
  confidence?: number;
  isDiagnosisComplete?: boolean;
  finalDiagnosis?: {
    diagnosis: string;
    confidence: number;
    evidence: string[];
  };
}

const Index = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<AIResponse | null>(null);
  const [diagnosisComplete, setDiagnosisComplete] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, currentResponse, isLoading]);

  useEffect(() => {
    // Initial greeting
    if (messages.length === 0) {
      setMessages([
        {
          role: "assistant",
          content: "Hello! I'm MiniDxO, your AI diagnostic assistant. I'll help analyze your symptoms through a structured conversation. What symptoms are you experiencing today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const generateTranscript = () => {
    const transcript: string[] = [];
    const sessionStart = messages[0]?.timestamp || new Date();
    const sessionEnd = messages[messages.length - 1]?.timestamp || new Date();
    const duration = Math.round((sessionEnd.getTime() - sessionStart.getTime()) / 1000 / 60);
    const userMessageCount = messages.filter(m => m.role === "user").length;
    
    // Header with session metadata
    transcript.push("=".repeat(80));
    transcript.push("                    MiniDxO - AI DIAGNOSTIC SESSION TRANSCRIPT");
    transcript.push("=".repeat(80));
    transcript.push("");
    transcript.push("SESSION INFORMATION:");
    transcript.push(`  Generated On:        ${new Date().toLocaleString()}`);
    transcript.push(`  Session Started:     ${sessionStart.toLocaleString()}`);
    transcript.push(`  Session Ended:       ${sessionEnd.toLocaleString()}`);
    transcript.push(`  Duration:            ${duration} minute(s)`);
    transcript.push(`  Total Interactions:  ${userMessageCount} question(s)`);
    transcript.push(`  Status:              ${diagnosisComplete ? 'Diagnosis Complete' : 'In Progress'}`);
    transcript.push("");
    transcript.push("=".repeat(80));
    transcript.push("");

    // Detailed conversation log
    transcript.push("DIAGNOSTIC CONVERSATION LOG:");
    transcript.push("─".repeat(80));
    transcript.push("");

    // Group messages into Q&A pairs
    for (let i = 1; i < messages.length; i += 2) {
      if (messages[i - 1]?.role === "user" && messages[i]?.role === "assistant") {
        const questionNum = Math.floor(i / 2) + 1;
        const userMsg = messages[i - 1];
        const aiMsg = messages[i];
        const userTime = userMsg.timestamp?.toLocaleTimeString() || '';
        const aiTime = aiMsg.timestamp?.toLocaleTimeString() || '';

        transcript.push(`\n╔${"═".repeat(78)}╗`);
        transcript.push(`║ INTERACTION #${questionNum.toString().padEnd(66)} ║`);
        transcript.push(`╚${"═".repeat(78)}╝`);
        transcript.push("");
        
        transcript.push(`┌─ PATIENT INPUT [${userTime}]`);
        transcript.push(`│`);
        userMsg.content.split('\n').forEach(line => {
          transcript.push(`│  ${line}`);
        });
        transcript.push(`└${"─".repeat(78)}`);
        transcript.push("");
        
        transcript.push(`┌─ AI RESPONSE [${aiTime}]`);
        transcript.push(`│`);
        aiMsg.content.split('\n').forEach(line => {
          transcript.push(`│  ${line}`);
        });
        transcript.push(`└${"─".repeat(78)}`);
        transcript.push("");
        
        // Agent Analysis Details
        if (aiMsg.agents && aiMsg.agents.length > 0) {
          transcript.push(`┌─ AGENT ANALYSIS`);
          transcript.push(`│`);
          aiMsg.agents.forEach(agent => {
            transcript.push(`│  [${agent.icon.toUpperCase()}] ${agent.name}: ${agent.status}`);
          });
          if (aiMsg.confidence !== undefined) {
            transcript.push(`│  Overall Confidence: ${aiMsg.confidence}%`);
          }
          transcript.push(`└${"─".repeat(78)}`);
          transcript.push("");
        }
        
        // Clinical Reasoning
        if (aiMsg.reasoning) {
          transcript.push(`┌─ CLINICAL REASONING`);
          transcript.push(`│`);
          aiMsg.reasoning.split('\n').forEach(line => {
            transcript.push(`│  ${line}`);
          });
          transcript.push(`└${"─".repeat(78)}`);
          transcript.push("");
        }

        // Medical References
        if (aiMsg.reference) {
          transcript.push(`┌─ MEDICAL REFERENCE`);
          transcript.push(`│`);
          transcript.push(`│  Source: ${aiMsg.reference.source}`);
          transcript.push(`│`);
          aiMsg.reference.snippet.split('\n').forEach(line => {
            transcript.push(`│  ${line}`);
          });
          transcript.push(`└${"─".repeat(78)}`);
          transcript.push("");
        }
        
        transcript.push("");
      }
    }

    // Final Diagnosis Summary
    if (diagnosisComplete && currentResponse?.finalDiagnosis) {
      transcript.push(`\n${"═".repeat(80)}`);
      transcript.push("                         FINAL DIAGNOSIS SUMMARY");
      transcript.push(`${"═".repeat(80)}`);
      transcript.push("");
      transcript.push(`DIAGNOSIS:`);
      transcript.push(`  ${currentResponse.finalDiagnosis.diagnosis}`);
      transcript.push("");
      transcript.push(`CONFIDENCE LEVEL:`);
      transcript.push(`  ${currentResponse.finalDiagnosis.confidence}% - ${
        currentResponse.finalDiagnosis.confidence >= 70 ? 'High Confidence' :
        currentResponse.finalDiagnosis.confidence >= 50 ? 'Moderate Confidence' :
        'Low Confidence'
      }`);
      transcript.push("");
      transcript.push(`SUPPORTING EVIDENCE:`);
      currentResponse.finalDiagnosis.evidence.forEach((item, idx) => {
        transcript.push(`  ${idx + 1}. ${item}`);
      });
      transcript.push("");
      transcript.push(`${"═".repeat(80)}`);
      transcript.push("");
    }

    // Statistics Summary
    transcript.push(`\n${"═".repeat(80)}`);
    transcript.push("                           SESSION STATISTICS");
    transcript.push(`${"═".repeat(80)}`);
    transcript.push("");
    transcript.push(`  Total Messages Exchanged:         ${messages.length}`);
    transcript.push(`  Patient Questions:                ${userMessageCount}`);
    transcript.push(`  AI Responses:                     ${messages.filter(m => m.role === "assistant").length}`);
    transcript.push(`  Responses with Reasoning:         ${messages.filter(m => m.reasoning).length}`);
    transcript.push(`  Medical References Cited:         ${messages.filter(m => m.reference).length}`);
    transcript.push(`  Average Confidence Score:         ${
      messages.filter(m => m.confidence).length > 0 
        ? Math.round(messages.filter(m => m.confidence).reduce((sum, m) => sum + (m.confidence || 0), 0) / messages.filter(m => m.confidence).length) + '%'
        : 'N/A'
    }`);
    transcript.push("");
    transcript.push(`${"═".repeat(80)}`);
    transcript.push("");

    // Disclaimer
    transcript.push(`\n${"═".repeat(80)}`);
    transcript.push("                            IMPORTANT DISCLAIMER");
    transcript.push(`${"═".repeat(80)}`);
    transcript.push("");
    transcript.push("⚠️  EDUCATIONAL SIMULATION ONLY");
    transcript.push("");
    transcript.push("This transcript is generated by an AI system designed for educational and");
    transcript.push("demonstration purposes only. It does NOT constitute professional medical advice,");
    transcript.push("diagnosis, or treatment.");
    transcript.push("");
    transcript.push("ALWAYS consult with qualified healthcare professionals for:");
    transcript.push("  • Actual medical diagnosis");
    transcript.push("  • Treatment decisions");
    transcript.push("  • Medical emergencies");
    transcript.push("  • Any health-related concerns");
    transcript.push("");
    transcript.push("Do NOT use this information as a substitute for professional medical care.");
    transcript.push("");
    transcript.push(`${"═".repeat(80)}`);
    transcript.push("");
    transcript.push(`MiniDxO v1.0 - The Transparent AI Diagnostician`);
    transcript.push(`End of Transcript`);
    transcript.push(`${"═".repeat(80)}`);

    return transcript.join("\n");
  };

  const downloadTranscript = () => {
    const transcriptText = generateTranscript();
    const blob = new Blob([transcriptText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `MiniDxO-Transcript-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input, timestamp: new Date() };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setIsLoading(true);
    setCurrentResponse(null);

    try {
      // Strip extra fields that AI API doesn't accept (only send role and content)
      const cleanMessages = updatedMessages.map(({ role, content }) => ({ role, content }));
      
      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({ messages: cleanMessages }),
      });

      if (!response.ok) {
        if (response.status === 429) {
          toast({
            title: "Rate Limit Reached",
            description: "Please wait a moment before sending another message.",
            variant: "destructive",
          });
          return;
        }
        if (response.status === 402) {
          toast({
            title: "Usage Limit Reached",
            description: "AI credits exhausted. Please top up and try again.",
            variant: "destructive",
          });
          return;
        }
        throw new Error("Failed to get response");
      }

      const data = await response.json();

      // Robustly extract JSON from the AI response (handles fences and pre/post text)
      const raw = String(data.response ?? "");
      let responseText = raw;

      // If there's a fenced code block, prefer its inner content
      const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
      if (fenceMatch) {
        responseText = fenceMatch[1];
      }

      let aiResponse: AIResponse;
      try {
        aiResponse = JSON.parse(responseText);
      } catch {
        // Try to salvage by extracting the first JSON object in the string
        const braceMatch = raw.match(/{[\s\S]*}/);
        if (braceMatch) {
          try {
            aiResponse = JSON.parse(braceMatch[0]);
          } catch {
            aiResponse = { message: raw } as AIResponse;
          }
        } else {
          // Fall back to plain message to avoid hard failure on follow-ups
          aiResponse = { message: raw } as AIResponse;
        }
      }

      setCurrentResponse(aiResponse);
      const assistantMessage: Message = {
        role: "assistant",
        content: aiResponse.message,
        timestamp: new Date(),
        reasoning: aiResponse.reasoning,
        reference: aiResponse.reference,
        agents: aiResponse.agents,
        confidence: aiResponse.confidence,
      };
      setMessages([...updatedMessages, assistantMessage]);

      if (aiResponse.isDiagnosisComplete) {
        setDiagnosisComplete(true);
      }
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! I'm MiniDxO, your AI diagnostic assistant. I'll help analyze your symptoms through a structured conversation. What symptoms are you experiencing today?",
        timestamp: new Date(),
      },
    ]);
    setCurrentResponse(null);
    setDiagnosisComplete(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle flex flex-col">
      {/* Header */}
      <header className="bg-card/80 border-b border-primary/10 shadow-card sticky top-0 z-10 backdrop-blur-md">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-medical rounded-2xl hover-glow transition-all duration-300 cursor-pointer hover:scale-105 shadow-medical">
              <Stethoscope className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-medical bg-clip-text text-transparent">MiniDxO</h1>
              <p className="text-sm text-muted-foreground mt-0.5">The Transparent AI Diagnostician</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-6 py-8 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
          {/* Chat Area */}
          <div className="lg:col-span-2 flex flex-col bg-card rounded-3xl shadow-elevated border border-primary/10 overflow-hidden hover-lift-subtle">
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
              {messages.map((message, index) => (
                <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <MessageBubble role={message.role} content={message.content} />
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-fade-in-up">
                  <TypingIndicator />
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="border-t border-primary/10 p-6 bg-gradient-to-t from-secondary/30 to-transparent backdrop-blur-sm">
              <div className="flex gap-3">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Describe your symptoms in detail..."
                  disabled={isLoading || diagnosisComplete}
                  className="flex-1 bg-background/80 border-primary/20 h-12 text-base px-5 transition-all duration-200 focus:shadow-medical focus:border-primary/40 focus:scale-[1.01]"
                />
                <Button
                  onClick={handleSend}
                  disabled={isLoading || !input.trim() || diagnosisComplete}
                  className="px-8 h-12 hover-lift hover:shadow-medical transition-all duration-200"
                >
                  <Send className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
                </Button>
              </div>
            </div>
          </div>

          {/* Reasoning Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {currentResponse?.agents && (
              <div className="animate-fade-in-up">
                <AgentCollaboration 
                  agents={currentResponse.agents} 
                  confidence={currentResponse.confidence}
                />
              </div>
            )}

            {currentResponse?.reasoning && (
              <div className="animate-fade-in-up" style={{ animationDelay: "100ms" }}>
                <ReasoningCard 
                  reasoning={currentResponse.reasoning}
                  reference={currentResponse.reference}
                />
              </div>
            )}

            {diagnosisComplete && currentResponse?.finalDiagnosis && (
              <div className="animate-fade-in-up" style={{ animationDelay: "200ms" }}>
                <DiagnosisSummary
                  diagnosis={currentResponse.finalDiagnosis.diagnosis}
                  confidence={currentResponse.finalDiagnosis.confidence}
                  evidence={currentResponse.finalDiagnosis.evidence}
                  onReset={handleReset}
                  onDownloadTranscript={downloadTranscript}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-card/50 border-t border-primary/10 py-6 backdrop-blur-sm mt-8">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground leading-relaxed">
            ⚕️ Educational simulation only • Not for medical diagnosis • Consult healthcare professionals
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
