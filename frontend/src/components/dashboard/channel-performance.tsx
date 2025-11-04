import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { ChannelPerformance } from "@/lib/dashboard-data";
import { Globe, Store, UsersRound, Zap } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  "Direct Store": <Store className="h-4 w-4" />,
  Marketplaces: <Globe className="h-4 w-4" />,
  "Affiliate Partners": <UsersRound className="h-4 w-4" />,
  "Paid Social": <Zap className="h-4 w-4" />,
};

type ChannelPerformanceProps = {
  data: ChannelPerformance[];
};

export function ChannelPerformanceCard({ data }: ChannelPerformanceProps) {
  const total = data.reduce((acc, channel) => acc + channel.revenue, 0);

  return (
    <Card className="h-full border-border/60 bg-card/70 backdrop-blur">
      <CardHeader className="pb-4 sm:pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold sm:text-lg">Channel performance</CardTitle>
            <CardDescription className="text-sm">Revenue distribution across primary sales engines</CardDescription>
          </div>
          <Badge variant="outline" className="w-fit rounded-full border-primary/30 px-3 text-xs text-primary">
            {Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(total)} total
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 sm:space-y-4 px-4 pb-5 sm:px-6 sm:pb-6">
        {data.map((channel) => (
          <div key={channel.channel} className="space-y-2 rounded-2xl border border-border/40 bg-muted/10 p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  {iconMap[channel.channel] ?? <Store className="h-4 w-4" />}
                </span>
                <div>
                  <p className="text-sm font-medium text-foreground/90">{channel.channel}</p>
                  <p className="text-xs text-muted-foreground">{channel.percentage}% contribution</p>
                </div>
              </div>
              <span className="text-sm font-semibold">
                {Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(channel.revenue)}
              </span>
            </div>
            <Progress value={channel.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
