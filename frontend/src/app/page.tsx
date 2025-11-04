import { Suspense } from "react";

import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Button } from "@/components/ui/button";
import { SummaryGrid } from "@/components/dashboard/summary-grid";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { UserStatsCard } from "@/components/dashboard/user-stats-card";
import { ChannelPerformanceCard } from "@/components/dashboard/channel-performance";
import { TopProducts } from "@/components/dashboard/top-products";
import { RecentActivityCard } from "@/components/dashboard/recent-activity";
import { TeamFocusCard } from "@/components/dashboard/team-focus";
import { RoleDistribution } from "@/components/dashboard/role-distribution";
import { UsersTable } from "@/components/dashboard/users-table";
import { getDashboardData } from "@/lib/dashboard-data";

export default async function DashboardPage() {
  const data = await getDashboardData();

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-screen-2xl flex-col gap-6 px-4 py-6 sm:gap-7 sm:px-6 sm:py-8 lg:gap-9 lg:px-10">
      <header className="flex flex-col gap-5 rounded-3xl border border-border/60 bg-card/70 p-5 backdrop-blur sm:gap-6 sm:p-6 lg:flex-row lg:items-center lg:justify-between lg:gap-8 lg:p-7">
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground sm:text-sm">Dropshipping Control Center</p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
            Operations dashboard
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Real-time instrumentation for orders, supplier throughput, and customer engagement powered by the Nest backend APIs.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:gap-4 lg:self-auto">
          <ThemeToggle />
          <Button size="lg" className="rounded-full">
            Export snapshot
          </Button>
        </div>
      </header>

      <Suspense fallback={<div className="h-32 animate-pulse rounded-2xl bg-muted" />}> 
        <SummaryGrid summary={data.summary} />
      </Suspense>

      <div className="grid gap-6 lg:grid-cols-[2fr_1fr] lg:gap-8">
        <PerformanceChart data={data.monthlyPerformance} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1 lg:gap-6">
          <UserStatsCard stats={data.userStats} />
          <RoleDistribution stats={data.userStats} />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:gap-8 xl:grid-cols-[1.5fr_1fr]">
        <TopProducts products={data.topProducts} />
        <ChannelPerformanceCard data={data.channelPerformance} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:gap-8">
        <RecentActivityCard items={data.recentActivities} />
        <TeamFocusCard items={data.teamFocus} />
      </div>

      <UsersTable users={data.users} />
    </main>
  );
}
