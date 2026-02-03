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
import "../styles/Profile.css";

export default function Profile() {
  const { toast } = useToast();

  const [preferences, setPreferences] = useState<UserPreferences>(() => {
    const saved = storage.getPreferences();
    return saved ?? {
      tone: "neutral",
      domain: "general",
      level: "intermediate",
    };
  });

  const savePreferences = () => {
    storage.setPreferences(preferences);
    toast({ title: "Preferences saved ✨" });
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
    <div className="profile-root">
      <div className="profile-header">
        <h1 className="profile-title">
          <Sparkles /> Profile & Preferences
        </h1>
        <p className="profile-subtitle">
          Personalize ProWriter to match your communication style
        </p>
      </div>

      <Card className="profile-card">
        <CardHeader>
          <CardTitle className="profile-card-title">
            <User /> Your Preferences
          </CardTitle>
          <CardDescription>
            These settings guide how ProWriter responds to you
          </CardDescription>
        </CardHeader>

        <CardContent className="profile-form">
          <div className="profile-field">
            <Label>Preferred Tone</Label>
            <Select
              value={preferences.tone}
              onValueChange={(v: UserPreferences["tone"]) =>
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

          <div className="profile-field">
            <Label>Work Domain</Label>
            <Select
              value={preferences.domain}
              onValueChange={(v: UserPreferences["domain"]) =>
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

          <div className="profile-field profile-span">
            <Label>English Level</Label>
            <Select
              value={preferences.level}
              onValueChange={(v: UserPreferences["level"]) =>
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

          <div className="profile-actions">
            <Button onClick={savePreferences} size="lg">
              <Save />
              Save Preferences
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="danger-card">
        <CardHeader>
          <CardTitle className="danger-title">
            <Trash2 /> Data Management
          </CardTitle>
          <CardDescription>
            Permanently remove all locally stored data
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            variant="destructive"
            className="danger-btn"
            onClick={clearAllData}
          >
            Clear All Data
          </Button>
        </CardContent>
      </Card>

      <Card className="privacy-card">
        <CardContent className="privacy-content">
          <ShieldCheck />
          <p>
            <strong>Privacy first.</strong> All preferences, streaks, and
            practice data are stored locally in your browser. No personal
            data is saved on our servers.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
