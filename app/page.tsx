"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PenLine, Target, MessageSquare, User } from "lucide-react";

import GrammarCorrection from "@/components/features/GrammarCorrection";
import DailyGrowth from "@/components/features/DailyGrowth";
import WorkplacePractice from "@/components/features/WorkplacePractice";
import Profile from "@/components/features/Profile";

import "../components/styles/home.css";

export default function Home() {
  const [activeTab, setActiveTab] = useState("grammar");

  return (
    <main className="app-root">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="logo-box">
            <PenLine size={22} />
          </div>
          <div>
            <h1 className="app-title">ProWriter</h1>
            <p className="app-subtitle">Intelligent English Writing Coach</p>
          </div>
        </div>
      </header>

      {/* Content */}
      <section className="app-content">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="tabs-container">
            <TabsTrigger value="grammar" className="tab-btn">
              <PenLine size={16} />
              <span>Grammar</span>
            </TabsTrigger>

            <TabsTrigger value="daily" className="tab-btn">
              <Target size={16} />
              <span>Daily Growth</span>
            </TabsTrigger>

            <TabsTrigger value="practice" className="tab-btn">
              <MessageSquare size={16} />
              <span>Practice</span>
            </TabsTrigger>

            <TabsTrigger value="profile" className="tab-btn">
              <User size={16} />
              <span>Profile</span>
            </TabsTrigger>
          </TabsList>

          <div className="tab-content">
            <TabsContent value="grammar">
              <GrammarCorrection />
            </TabsContent>

            <TabsContent value="daily">
              <DailyGrowth />
            </TabsContent>

            <TabsContent value="practice">
              <WorkplacePractice />
            </TabsContent>

            <TabsContent value="profile">
              <Profile />
            </TabsContent>
          </div>
        </Tabs>
      </section>
    </main>
  );
}
