"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  MessageSquare,
  Send,
  Copy,
  BarChart3,
  Sparkles,
} from "lucide-react";
import { WORKPLACE_SCENARIOS } from "@/lib/scenarios";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface Feedback {
  feedback: string;
  scores?: Record<string, number>;
}

export default function WorkplacePractice() {
  const [selectedScenario, setSelectedScenario] = useState("");
  const [started, setStarted] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const { toast } = useToast();

  const scenario = WORKPLACE_SCENARIOS.find(
    (s) => s.id === selectedScenario
  );

  const startPractice = () => {
    if (!selectedScenario) {
      toast({
        title: "Select a scenario",
        variant: "destructive",
      });
      return;
    }
    setStarted(true);
    setMessages([]);
    setFeedback(null);
  };

  const sendMessage = async () => {
    if (!userInput.trim() || !scenario) return;

    const userMsg: Message = { role: "user", content: userInput };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setUserInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: scenario.context,
          userMessage: userMsg.content,
          conversationHistory: updated,
          isEnd: false,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.data.response },
        ]);
      }
    } finally {
      setLoading(false);
    }
  };

  const endConversation = async () => {
    if (!scenario || messages.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scenario: scenario.context,
          conversationHistory: messages,
          isEnd: true,
        }),
      });
      const data = await res.json();
      if (data.success) setFeedback(data.data);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStarted(false);
    setMessages([]);
    setFeedback(null);
    setSelectedScenario("");
  };

  const copyFinalMessage = () => {
    const last = messages.filter((m) => m.role === "user").pop();
    if (last) navigator.clipboard.writeText(last.content);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {!started ? (
        <Card className="shadow-lg">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl flex items-center justify-center gap-2">
              <Sparkles className="text-primary" />
              Workplace Practice
            </CardTitle>
            <CardDescription>
              Simulate real conversations and get instant feedback
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Select Scenario</Label>
              <Select
                value={selectedScenario}
                onValueChange={setSelectedScenario}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Choose a workplace scenario" />
                </SelectTrigger>
                <SelectContent>
                  {WORKPLACE_SCENARIOS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {scenario && (
              <div className="rounded-xl border bg-muted p-4 space-y-2">
                <h4 className="font-semibold">{scenario.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {scenario.description}
                </p>
                <p className="text-sm">
                  <strong>Context:</strong> {scenario.context}
                </p>
              </div>
            )}

            <Button
              size="lg"
              className="w-full"
              onClick={startPractice}
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Start Conversation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="shadow-lg">
            <CardHeader className="flex-row items-center justify-between">
              <div>
                <CardTitle>{scenario?.title}</CardTitle>
                <CardDescription>
                  Role: {scenario?.roleplayAs}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={reset}>
                Reset
              </Button>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="h-[420px] overflow-y-auto rounded-xl bg-muted p-4 space-y-4">
                {messages.length === 0 && (
                  <p className="text-center text-muted-foreground mt-20">
                    Start typing to begin the conversation
                  </p>
                )}

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.role === "user"
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm leading-relaxed ${
                        m.role === "user"
                          ? "bg-primary text-white"
                          : "bg-white border"
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}

                {loading && (
                  <div className="flex justify-start">
                    <div className="bg-white border rounded-xl px-3 py-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>

              {!feedback && (
                <div className="space-y-3">
                  <Textarea
                    value={userInput}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setUserInput(e.target.value)}
                    placeholder="Type your response…"
                    className="min-h-[90px]"
                    onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={sendMessage}
                      disabled={loading || !userInput.trim()}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      Send
                    </Button>
                    <Button
                      variant="outline"
                      onClick={endConversation}
                      disabled={loading || messages.length === 0}
                    >
                      End & Review
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {feedback && (
            <Card className="border-purple-200 bg-purple-50/60 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="text-purple-600" />
                  Performance Review
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-6">
                <p>{feedback.feedback}</p>

                {feedback.scores && (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {Object.entries(feedback.scores as Record<string, number>).map(
                      ([k, v]: [string, number]) => (
                        <div key={k} className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{k}</span>
                            <span>{v}/100</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full">
                            <div
                              className="h-2 rounded-full bg-purple-600"
                              style={{ width: `${v}%` }}
                            />
                          </div>
                        </div>
                      )
                    )}
                  </div>
                )}

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={copyFinalMessage}
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy Message
                  </Button>
                  <Button className="flex-1" onClick={reset}>
                    Try Another
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
