import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { RecentActivity } from "@/lib/dashboard-data";
import { BellRing, CheckCircle2, Info, TriangleAlert } from "lucide-react";

const statusIcon: Record<RecentActivity["status"], React.ReactNode> = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-500" />,
  warning: <TriangleAlert className="h-4 w-4 text-amber-500" />,
  info: <Info className="h-4 w-4 text-sky-500" />,
};

const statusBadgeClasses: Record<RecentActivity["status"], string> = {
  success: "bg-emerald-50 text-emerald-700 border-emerald-200",
  warning: "bg-amber-50 text-amber-700 border-amber-200",
  info: "bg-sky-50 text-sky-700 border-sky-200",
};

type RecentActivityProps = {
  items: RecentActivity[];
};

export function RecentActivityCard({ items }: RecentActivityProps) {
  return (
    <Card className="border-border/60 bg-card/70 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Ops activity feed</CardTitle>
            <CardDescription>Signal-rich feed of automation and human interventions</CardDescription>
          </div>
          <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
            <BellRing className="mr-1 h-3.5 w-3.5" />
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item, index) => {
          const initials = item.title
            .split(" ")
            .map((piece) => piece[0])
            .join("")
            .slice(0, 2)
            .toUpperCase();

          return (
            <div key={`${item.title}-${index}`} className="space-y-3">
              <div className="flex items-start gap-3">
                <Avatar className="mt-1 h-8 w-8 border border-border/60 bg-muted">
                  <AvatarFallback>{initials || "EV"}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground/90">{item.title}</p>
                    <span className="text-xs text-muted-foreground">{item.timestamp}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <Badge
                  variant="outline"
                  className={`flex items-center gap-1 rounded-full border px-2 py-1 text-xs ${statusBadgeClasses[item.status]}`}
                >
                  {statusIcon[item.status]}
                  {item.status}
                </Badge>
              </div>
              {index !== items.length - 1 && <Separator className="bg-border/60" />}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
