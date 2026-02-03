"use client";

import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Trophy,
  CheckCircle2,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { storage } from "@/lib/storage";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  type: "rewrite" | "choice" | "fill";
  instruction: string;
  content: string;
  options?: string[];
  answer: string;
  userAnswer?: string;
  completed?: boolean;
}

export default function DailyGrowth() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [streak, setStreak] = useState(0);
  const [completedToday, setCompletedToday] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    loadDailyTasks();
    loadProgress();
  }, []);

  const loadDailyTasks = () => {
    const saved = storage.getDailyTasks();
    const today = new Date().toDateString();
    if (saved && saved.date === today) {
      setTasks(saved.tasks);
    } else {
      generateTasks();
    }
  };

  const loadProgress = () => {
    const progress = storage.getDailyProgress();
    if (!progress) return;
    setStreak(progress.streak || 0);
    if (progress.date === new Date().toDateString()) {
      setCompletedToday(progress.completed || 0);
    }
  };

  const generateTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userPreferences: storage.getPreferences() }),
      });
      const data = await res.json();
      if (data.success) {
        const fresh = data.data.tasks.map((t: Task) => ({
          ...t,
          userAnswer: "",
          completed: false,
        }));
        setTasks(fresh);
        storage.setDailyTasks({
          date: new Date().toDateString(),
          tasks: fresh,
        });
        toast({ title: "New challenge ready ✨" });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (id: string, value: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, userAnswer: value } : t))
    );
  };

  const checkAnswer = (id: string) => {
    const task = tasks.find((t) => t.id === id);
    if (!task || !task.userAnswer) return;

    const correct =
      task.userAnswer.trim().toLowerCase() ===
      task.answer.trim().toLowerCase();

    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: true } : t))
    );

    if (correct) {
      const today = new Date().toDateString();
      const progress = storage.getDailyProgress();
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      const newStreak =
        progress?.lastCompletedDate === yesterday
          ? progress.streak + 1
          : 1;

      const newCompleted = completedToday + 1;
      setCompletedToday(newCompleted);
      setStreak(newStreak);

      storage.setDailyProgress({
        date: today,
        completed: newCompleted,
        total: tasks.length,
        streak: newStreak,
        lastCompletedDate: today,
      });

      toast({ title: "Correct 🎉" });
    } else {
      toast({
        title: "Incorrect",
        description: `Answer: ${task.answer}`,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl md:text-4xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="text-primary" />
          Daily Growth
        </h1>
        <p className="text-muted-foreground">
          Short daily exercises to sharpen your English
        </p>
      </div>

      <Card className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <CardContent className="py-6 flex items-center justify-between">
          <div>
            <p className="text-sm opacity-90">Current Streak</p>
            <p className="text-3xl font-bold">{streak} 🔥</p>
          </div>
          <Trophy className="w-10 h-10 opacity-90" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="pt-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Today’s Progress</span>
            <span>
              {completedToday} / {tasks.length}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-2 bg-gradient-to-r from-primary to-purple-500 transition-all"
              style={{
                width: `${
                  tasks.length
                    ? (completedToday / tasks.length) * 100
                    : 0
                }%`,
              }}
            />
          </div>
        </CardContent>
      </Card>

      {loading ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">
              Preparing today’s challenges…
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-5">
          {tasks.map((task, i) => (
            <Card
              key={task.id}
              className={`transition-all ${
                task.completed
                  ? "border-green-300 bg-green-50/50"
                  : "hover:shadow-md"
              }`}
            >
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>
                    Task {i + 1} · {task.instruction}
                  </span>
                  {task.completed && (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="p-4 rounded-lg bg-muted text-sm leading-relaxed">
                  {task.content}
                </div>

                {task.type === "choice" && task.options && (
                  <div className="grid sm:grid-cols-2 gap-2">
                    {task.options.map((opt) => (
                      <Button
                        key={opt}
                        variant={
                          task.userAnswer === opt ? "default" : "outline"
                        }
                        disabled={task.completed}
                        onClick={() =>
                          handleAnswerChange(task.id, opt)
                        }
                      >
                        {opt}
                      </Button>
                    ))}
                  </div>
                )}

                {(task.type === "rewrite" || task.type === "fill") && (
                  <Input
                    value={task.userAnswer || ""}
                    disabled={task.completed}
                    placeholder="Type your answer..."
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      handleAnswerChange(task.id, e.target.value)
                    }
                  />
                )}

                {!task.completed && (
                  <Button
                    className="w-full"
                    disabled={!task.userAnswer}
                    onClick={() => checkAnswer(task.id)}
                  >
                    Check Answer
                  </Button>
                )}

                {task.completed && (
                  <p className="text-sm text-muted-foreground">
                    Answer: <strong>{task.answer}</strong>
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {tasks.length > 0 && (
        <Button
          variant="outline"
          className="w-full"
          onClick={generateTasks}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Generate New Tasks
        </Button>
      )}
    </div>
  );
}
