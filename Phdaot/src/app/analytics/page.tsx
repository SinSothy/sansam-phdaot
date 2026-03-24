"use client";

import React from "react";
import { KPICard } from "@/components/analytics/KPICard";
import { TaskCompletionTrend } from "@/components/analytics/TaskCompletionTrend";
import { ProjectTimeline } from "@/components/analytics/ProjectTimeline";
import { TopContributors } from "@/components/analytics/TopContributors";
import { StatusDistribution } from "@/components/analytics/StatusDistribution";
import { ActivityLog } from "@/components/analytics/ActivityLog";
import { SprintOversight } from "@/components/analytics/SprintOversight";
import { TeamWorkload } from "@/components/analytics/TeamWorkload";

import { AnalyticsHeader } from "@/components/analytics/AnalyticsHeader";

export default function AnalyticsPage() {
  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8">
      <AnalyticsHeader />

      {/* KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          icon="rocket_launch"
          iconClass="bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white"
          trendText="+12%"
          trendClass="text-emerald-600 bg-emerald-50"
          title="Total Projects"
          value="24"
          subtitle="Active this sprint"
        />
        <KPICard
          icon="check_circle"
          iconStyle={{ fontVariationSettings: "'FILL' 1" }}
          iconClass="bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white"
          trendText="+4%"
          trendClass="text-emerald-600 bg-emerald-50"
          title="Completed Projects"
          value="82%"
          progress={82}
        />
        <KPICard
          icon="pending"
          iconClass="bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white"
          trendText="Steady"
          trendClass="text-blue-600 bg-blue-50"
          title="In Progress Tasks"
          value="142"
          subtitle="12 tasks due today"
        />
        <KPICard
          icon="list_alt"
          iconClass="bg-slate-100 text-slate-600 group-hover:bg-slate-600 group-hover:text-white"
          trendText="Backlog"
          trendClass="text-slate-400 bg-slate-50"
          title="To Do Tasks"
          value="56"
          subtitle="Estimated 184 hours"
        />
      </div>

      {/* Main Data Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          <TaskCompletionTrend />
          <ProjectTimeline />
          <TopContributors />
        </div>

        {/* RHS Sidebar Stats */}
        <div className="space-y-8">
          <StatusDistribution />
          <ActivityLog />
          <SprintOversight />
        </div>
      </div>

      {/* Team Workload Section */}
      <TeamWorkload />
    </div>
  );
}
