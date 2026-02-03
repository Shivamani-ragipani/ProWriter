"use client";

import { useState, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import {
  Loader2,
  CheckCircle2,
  Lightbulb,
  Sparkles,
} from "lucide-react";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";
import "../styles/GrammarCorrection.css";

export default function GrammarCorrection() {
  const [inputText, setInputText] = useState("");
  const [mode, setMode] = useState("grammar");
  const [tone, setTone] = useState("formal");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const { toast } = useToast();

  const handleCorrect = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Missing text",
        description: "Please enter some text to correct.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const userPreferences = storage.getPreferences();
      const response = await fetch("/api/correct", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: inputText,
          mode,
          tone: mode === "professional" ? tone : undefined,
          userPreferences,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        toast({
          title: "Done!",
          description: "Your text has been improved ✨",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gc-container">
      <div className="gc-hero">
        <h1 className="gc-title">
          <Sparkles /> Grammar Correction
        </h1>
        <p className="gc-subtitle">
          Turn rough thoughts into clear, professional English in seconds.
        </p>
      </div>

      <Card className="gc-card">
        <CardHeader>
          <CardTitle>Your Text</CardTitle>
          <CardDescription>
            Paste your sentence or paragraph below
          </CardDescription>
        </CardHeader>

        <CardContent className="gc-content">
          <Textarea
            value={inputText}
            placeholder="Type or paste your text here..."
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
              setInputText(e.target.value)
            }
            className="gc-textarea"
          />

          <div className="gc-options">
            <div>
              <Label>Correction Mode</Label>
              <Select value={mode} onValueChange={setMode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="grammar">Just Grammar</SelectItem>
                  <SelectItem value="professional">
                    Rewrite Professionally
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "professional" && (
              <div>
                <Label>Tone</Label>
                <Select value={tone} onValueChange={setTone}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="neutral">Neutral</SelectItem>
                    <SelectItem value="friendly">Friendly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <Button
            onClick={handleCorrect}
            disabled={loading || !inputText.trim()}
            className="gc-button"
          >
            {loading ? (
              <>
                <Loader2 className="spin" /> Improving your text...
              </>
            ) : (
              "Correct My Text"
            )}
          </Button>
        </CardContent>
      </Card>

      {result && (
        <Card className="gc-result">
          <CardHeader>
            <CardTitle className="gc-result-title">
              <CheckCircle2 /> Corrected Result
            </CardTitle>
          </CardHeader>

          <CardContent className="gc-result-content">
            <div className="gc-output">{result.corrected_text}</div>

            {result.explanation?.length > 0 && (
              <div>
                <h4 className="gc-section-title">
                  <Lightbulb /> What changed
                </h4>
                <ul>
                  {result.explanation.map((e: string, i: number) => (
                    <li key={i}>{e}</li>
                  ))}
                </ul>
              </div>
            )}

            <div className="gc-meta">
              <span>Tone: {result.tone}</span>
              <span>
                Confidence:{" "}
                {Math.round((result.confidence_score || 0) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
