import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { UserStats } from "@/lib/dashboard-data";
import { Users, UserCheck, UserCog } from "lucide-react";

const percent = (value: number, total: number) => {
  if (!total) return 0;
  return Math.round((value / total) * 100);
};

type UserStatsCardProps = {
  stats: UserStats;
};

export function UserStatsCard({ stats }: UserStatsCardProps) {
  const managerPercent = percent(stats.managerUsers, stats.totalUsers);
  const adminPercent = percent(stats.adminUsers, stats.totalUsers);
  const customerPercent = percent(stats.customerUsers, stats.totalUsers);

  return (
    <Card className="h-full border-border/60 bg-card/70 backdrop-blur">
      <CardHeader className="space-y-2 sm:space-y-1">
        <CardTitle className="text-base font-semibold sm:text-lg">Customer base health</CardTitle>
        <p className="text-sm text-muted-foreground">
          Breakdown of active relationships and onboarding momentum
        </p>
      </CardHeader>
      <CardContent className="space-y-5 sm:space-y-6">
        <div className="grid gap-3 sm:grid-cols-3">
          <MetricPill
            label="Total accounts"
            value={stats.totalUsers}
            icon={<Users className="h-4 w-4" />}
          />
          <MetricPill
            label="Active"
            value={stats.activeUsers}
            icon={<UserCheck className="h-4 w-4" />}
          />
          <MetricPill
            label="New (30d)"
            value={stats.newUsers30d}
            icon={<UserCog className="h-4 w-4" />}
          />
        </div>

        <div className="space-y-3 text-xs sm:space-y-4 sm:text-sm">
          <RoleProgress label="Managers" value={stats.managerUsers} percentage={managerPercent} />
          <RoleProgress label="Admins" value={stats.adminUsers} percentage={adminPercent} />
          <RoleProgress label="Customers" value={stats.customerUsers} percentage={customerPercent} />
        </div>
      </CardContent>
    </Card>
  );
}

type MetricPillProps = {
  label: string;
  value: number;
  icon: React.ReactNode;
};

function MetricPill({ label, value, icon }: MetricPillProps) {
  return (
    <div className="rounded-2xl border border-border/50 bg-muted/20 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          {icon}
        </span>
        <div>
          <p className="text-xs text-muted-foreground sm:text-sm">{label}</p>
          <p className="text-lg font-semibold leading-tight sm:text-xl">{value.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

type RoleProgressProps = {
  label: string;
  value: number;
  percentage: number;
};

function RoleProgress({ label, value, percentage }: RoleProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-foreground/80">{label}</span>
        <span className="text-muted-foreground">{value.toLocaleString()} • {percentage}%</span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
  );
}
