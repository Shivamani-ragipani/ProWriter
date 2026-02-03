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
      } else {
        throw new Error(data.error);
      }
    } catch (err: any) {
      toast({
        title: "Something went wrong",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      
      {/* 🔥 HERO HEADER */}
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex justify-center items-center gap-2">
          <Sparkles className="text-primary" />
          Grammar Correction
        </h1>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Turn rough thoughts into clear, professional English in seconds.
        </p>
      </div>

      {/* INPUT CARD */}
      <Card className="shadow-lg border-muted/50">
        <CardHeader>
          <CardTitle>Your Text</CardTitle>
          <CardDescription>
            Paste your sentence or paragraph below
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          <Textarea
            placeholder="Type or paste your text here..."
            value={inputText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInputText(e.target.value)}
            className="min-h-[180px] text-base focus-visible:ring-2 focus-visible:ring-primary/50"
          />

          {/* OPTIONS */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
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
              <div className="space-y-2">
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

          {/* CTA BUTTON */}
          <Button
            onClick={handleCorrect}
            disabled={loading || !inputText.trim()}
            size="lg"
            className="w-full text-base shadow-md hover:shadow-xl transition-all"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Improving your text...
              </>
            ) : (
              "Correct My Text"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* RESULT */}
      {result && (
        <Card className="border-green-200 bg-green-50/60 animate-in fade-in slide-in-from-bottom-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <CheckCircle2 className="w-5 h-5" />
              Corrected Result
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="p-5 bg-white rounded-lg border text-base leading-relaxed">
              {result.corrected_text}
            </div>

            {result.explanation?.length > 0 && (
              <div>
                <h4 className="font-semibold flex items-center gap-2 mb-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600" />
                  What changed
                </h4>
                <ul className="list-disc ml-6 text-sm text-muted-foreground space-y-1">
                  {result.explanation.map((exp: string, i: number) => (
                    <li key={i}>{exp}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.alternatives?.length > 0 && (
              <div>
                <h4 className="font-semibold mb-2">Alternative Versions</h4>
                <div className="space-y-2">
                  {result.alternatives.map((alt: string, i: number) => (
                    <div
                      key={i}
                      className="p-3 bg-white rounded border text-sm"
                    >
                      {alt}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between text-xs text-muted-foreground border-t pt-3">
              <span>Tone: {result.tone}</span>
              <span>
                Confidence: {Math.round((result.confidence_score || 0) * 100)}%
              </span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
