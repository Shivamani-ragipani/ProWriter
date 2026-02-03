"use client";

import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardContent,
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
import "../styles/daily-growth.css";

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
    <div className="daily-root">
      <div className="daily-header">
        <h1 className="daily-title">
          <Sparkles /> Daily Growth
        </h1>
        <p className="daily-subtitle">
          Short daily exercises to sharpen your English
        </p>
      </div>

      <Card className="streak-card">
        <CardContent className="streak-content">
          <div>
            <p className="streak-label">Current Streak</p>
            <p className="streak-value">{streak} 🔥</p>
          </div>
          <Trophy />
        </CardContent>
      </Card>

      <Card className="progress-card">
        <CardContent>
          <div className="progress-header">
            <span>Today’s Progress</span>
            <span>
              {completedToday} / {tasks.length}
            </span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
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
        <Card className="loading-card">
          <CardContent>
            <Loader2 className="spin" />
            <p>Preparing today’s challenges…</p>
          </CardContent>
        </Card>
      ) : (
        <div className="tasks-wrapper">
          {tasks.map((task, i) => (
            <Card
              key={task.id}
              className={`task-card ${
                task.completed ? "task-complete" : ""
              }`}
            >
              <CardHeader>
                <CardTitle className="task-title">
                  <span>
                    Task {i + 1} · {task.instruction}
                  </span>
                  {task.completed && <CheckCircle2 />}
                </CardTitle>
              </CardHeader>

              <CardContent className="task-body">
                <div className="task-content">{task.content}</div>

                {task.type === "choice" && task.options && (
                  <div className="choices-grid">
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
                    className="submit-btn"
                    disabled={!task.userAnswer}
                    onClick={() => checkAnswer(task.id)}
                  >
                    Check Answer
                  </Button>
                )}

                {task.completed && (
                  <p className="answer-text">
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
          className="refresh-btn"
          onClick={generateTasks}
          disabled={loading}
        >
          <RefreshCw />
          Generate New Tasks
        </Button>
      )}
    </div>
  );
}
