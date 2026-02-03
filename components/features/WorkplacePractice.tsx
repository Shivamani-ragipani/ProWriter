"use client";

import { useState, type ChangeEvent, type KeyboardEvent } from "react";
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
import "../styles/WorkplacePractice.css";

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
      toast({ title: "Select a scenario", variant: "destructive" });
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
    <div className="wp-root">
      {!started ? (
        <Card className="wp-start-card">
          <CardHeader className="wp-start-header">
            <CardTitle className="wp-title">
              <Sparkles /> Workplace Practice
            </CardTitle>
            <CardDescription>
              Simulate real conversations and get instant feedback
            </CardDescription>
          </CardHeader>

          <CardContent className="wp-start-content">
            <div className="wp-field">
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
              <div className="wp-scenario">
                <h4>{scenario.title}</h4>
                <p>{scenario.description}</p>
                <p>
                  <strong>Context:</strong> {scenario.context}
                </p>
              </div>
            )}

            <Button size="lg" onClick={startPractice}>
              <MessageSquare />
              Start Conversation
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="wp-chat-card">
            <CardHeader className="wp-chat-header">
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

            <CardContent className="wp-chat-content">
              <div className="wp-chat-box">
                {messages.length === 0 && (
                  <p className="wp-chat-empty">
                    Start typing to begin the conversation
                  </p>
                )}

                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`wp-msg-row ${
                      m.role === "user" ? "user" : "assistant"
                    }`}
                  >
                    <div className="wp-msg">{m.content}</div>
                  </div>
                ))}

                {loading && (
                  <div className="wp-msg-row assistant">
                    <div className="wp-msg loading">
                      <Loader2 />
                    </div>
                  </div>
                )}
              </div>

              {!feedback && (
                <div className="wp-input-area">
                  <Textarea
                    value={userInput}
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setUserInput(e.target.value)}
                    placeholder="Type your response…"
                    onKeyDown={(e: KeyboardEvent<HTMLTextAreaElement>) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                  />

                  <div className="wp-actions">
                    <Button
                      onClick={sendMessage}
                      disabled={loading || !userInput.trim()}
                    >
                      <Send /> Send
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
            <Card className="wp-feedback-card">
              <CardHeader>
                <CardTitle className="wp-feedback-title">
                  <BarChart3 /> Performance Review
                </CardTitle>
              </CardHeader>

              <CardContent className="wp-feedback-content">
                <p>{feedback.feedback}</p>

                {feedback.scores && (
                  <div className="wp-scores">
                    {Object.entries(feedback.scores).map(([k, v]) => (
                      <div key={k} className="wp-score">
                        <div>
                          <span>{k}</span>
                          <span>{v}/100</span>
                        </div>
                        <div className="wp-bar">
                          <div
                            className="wp-bar-fill"
                            style={{ width: `${v}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <div className="wp-feedback-actions">
                  <Button variant="outline" onClick={copyFinalMessage}>
                    <Copy /> Copy Message
                  </Button>
                  <Button onClick={reset}>Try Another</Button>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
