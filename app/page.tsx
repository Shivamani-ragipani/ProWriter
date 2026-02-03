"use client";

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PenLine, Target, MessageSquare, User } from 'lucide-react';
import GrammarCorrection from '@/components/features/GrammarCorrection';
import DailyGrowth from '@/components/features/DailyGrowth';
import WorkplacePractice from '@/components/features/WorkplacePractice';
import Profile from '@/components/features/Profile';

export default function Home() {
  const [activeTab, setActiveTab] = useState('grammar');

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
              <PenLine className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">ProWriter</h1>
              <p className="text-sm text-gray-600">Intelligent English Writing Coach</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto mb-8">
            <TabsTrigger value="grammar" className="flex items-center gap-2">
              <PenLine className="w-4 h-4" />
              <span className="hidden sm:inline">Grammar</span>
            </TabsTrigger>
            <TabsTrigger value="daily" className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Daily Growth</span>
            </TabsTrigger>
            <TabsTrigger value="practice" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              <span className="hidden sm:inline">Practice</span>
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="grammar" className="mt-0">
            <GrammarCorrection />
          </TabsContent>

          <TabsContent value="daily" className="mt-0">
            <DailyGrowth />
          </TabsContent>

          <TabsContent value="practice" className="mt-0">
            <WorkplacePractice />
          </TabsContent>

          <TabsContent value="profile" className="mt-0">
            <Profile />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
