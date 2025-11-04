import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeamFocus } from "@/lib/dashboard-data";
import { BarChart3 } from "lucide-react";

type TeamFocusProps = {
  items: TeamFocus[];
};

export function TeamFocusCard({ items }: TeamFocusProps) {
  return (
    <Card className="border-border/60 bg-card/70 backdrop-blur">
      <CardHeader className="pb-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold sm:text-lg">Team focus</CardTitle>
            <CardDescription>Where squads are investing effort this week</CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full border-primary/30 text-xs text-primary self-start sm:self-auto">
            <BarChart3 className="mr-1 h-3.5 w-3.5" />
            Priority pods
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.name} className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/10 p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border border-border/50">
                <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
                  {item.avatarFallback}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium text-foreground/90">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-foreground/90">{item.metric}</p>
              <p className="text-xs text-muted-foreground">↑ {item.trend}% week-over-week</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
