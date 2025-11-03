"use client";

import { Pie, PieChart, ResponsiveContainer, Cell, Tooltip } from "recharts";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserStats } from "@/lib/dashboard-data";

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))"];

type RoleDistributionProps = {
  stats: UserStats;
};

export function RoleDistribution({ stats }: RoleDistributionProps) {
  const data = [
    { name: "Admins", value: stats.adminUsers },
    { name: "Managers", value: stats.managerUsers },
    { name: "Customers", value: stats.customerUsers },
  ].filter((item) => item.value > 0);

  return (
    <Card className="border-border/60 bg-card/70 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Role mix</CardTitle>
            <CardDescription>Identity split across the user base</CardDescription>
          </div>
          <Badge variant="secondary" className="rounded-full bg-primary/10 text-xs text-primary">
            {stats.totalUsers.toLocaleString()} users
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="grid gap-6 md:grid-cols-[1fr_200px]">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} dataKey="value" nameKey="name" innerRadius={70} outerRadius={105} paddingAngle={6}>
                {data.map((entry, index) => (
                  <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number) => `${value.toLocaleString()} users`}
                contentStyle={{ borderRadius: 12, borderColor: "hsl(var(--border))" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">Active</p>
            <p className="text-2xl font-semibold text-foreground">{stats.activeUsers.toLocaleString()}</p>
          </div>
        </div>
        <div className="space-y-3">
          {data.map((item, index) => (
            <div key={item.name} className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 px-4 py-3 text-sm">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="font-medium text-foreground/90">{item.name}</span>
              </div>
              <span className="text-muted-foreground">
                {item.value.toLocaleString()} · {Math.round((item.value / Math.max(stats.totalUsers, 1)) * 100)}%
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
