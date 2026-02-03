"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  User,
  Save,
  Trash2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { storage, UserPreferences } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

export default function Profile() {
  const { toast } = useToast();

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = storage.getPreferences();
    return saved ?? { tone: "neutral", domain: "general", level: "intermediate" };
  });

  const savePreferences = () => {
    storage.setPreferences(preferences);
    toast({
      title: "Preferences saved ✨",
    });
  };

  const clearAllData = () => {
    if (
      confirm(
        "This will remove all preferences, streaks, and tasks. Continue?"
      )
    ) {
      storage.clearAll();
      setPreferences({
        tone: "neutral",
        domain: "general",
        level: "intermediate",
      });
      toast({
        title: "All data cleared",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="text-primary" />
          Profile & Preferences
        </h1>
        <p className="text-muted-foreground">
          Personalize ProWriter to match your communication style
        </p>
      </div>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Your Preferences
          </CardTitle>
          <CardDescription>
            These settings guide how ProWriter responds to you
          </CardDescription>
        </CardHeader>

        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Preferred Tone</Label>
            <Select
              value={preferences.tone}
              onValueChange={(v: import("@/lib/storage").UserPreferences["tone"]) =>
                setPreferences({ ...preferences, tone: v })
              }
            >
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

          <div className="space-y-2">
            <Label>Work Domain</Label>
            <Select
              value={preferences.domain}
              onValueChange={(v: import("@/lib/storage").UserPreferences["domain"]) =>
                setPreferences({ ...preferences, domain: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="general">General</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="product">Product</SelectItem>
                <SelectItem value="sales">Sales</SelectItem>
                <SelectItem value="support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>English Level</Label>
            <Select
              value={preferences.level}
              onValueChange={(v: import("@/lib/storage").UserPreferences["level"]) =>
                setPreferences({ ...preferences, level: v })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="md:col-span-2 pt-4">
            <Button
              onClick={savePreferences}
              size="lg"
              className="w-full"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200 bg-red-50/40">
        <CardHeader>
          <CardTitle className="text-red-700 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Data Management
          </CardTitle>
          <CardDescription>
            Permanently remove all locally stored data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="w-full"
            onClick={clearAllData}
          >
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6 flex gap-3">
          <ShieldCheck className="w-5 h-5 text-blue-700 mt-0.5" />
          <p className="text-sm text-blue-900 leading-relaxed">
            <strong>Privacy first.</strong> All preferences, streaks, and
            practice data are stored locally in your browser. No personal
            data is saved on our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
