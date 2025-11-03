import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { DashboardSummary } from "@/lib/dashboard-data";
import { ArrowDownRight, ArrowUpRight, BarChart3, LineChart, Repeat, TrendingUp } from "lucide-react";

const metrics = [
  {
    key: "revenue" as const,
    label: "Monthly revenue",
    icon: TrendingUp,
    prefix: "$",
  },
  {
    key: "orders" as const,
    label: "Orders fulfilled",
    icon: BarChart3,
  },
  {
    key: "averageOrderValue" as const,
    label: "Average order value",
    icon: LineChart,
    prefix: "$",
  },
  {
    key: "retentionRate" as const,
    label: "Customer retention",
    icon: Repeat,
    suffix: "%",
  },
];

const numberFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

const currencyFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

type SummaryGridProps = {
  summary: DashboardSummary;
};

export function SummaryGrid({ summary }: SummaryGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        const value = summary[metric.key];
        const change = summary[`${metric.key}Change` as const] as number;
        const isPositive = change >= 0;

        const formattedValue = metric.prefix
          ? metric.prefix === "$"
            ? currencyFormatter.format(value)
            : `${metric.prefix}${numberFormatter.format(value)}`
          : metric.suffix === "%"
          ? `${value}${metric.suffix}`
          : numberFormatter.format(value);

        return (
          <Card key={metric.key} className="border-border/60 bg-card/80 shadow-lg backdrop-blur">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-3">
                <CardTitle className="text-base font-semibold text-foreground/90">
                  {metric.label}
                </CardTitle>
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </Badge>
              </div>
              <CardDescription className="text-xs text-muted-foreground">
                Compared to last month
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold tracking-tight">{formattedValue}</div>
              <Separator className="bg-border/60" />
              <div className="flex items-center gap-2 text-sm">
                <Badge
                  className={`rounded-full px-2 py-1 font-medium ${
                    isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
                  }`}
                >
                  {isPositive ? <ArrowUpRight className="mr-1 h-3.5 w-3.5" /> : <ArrowDownRight className="mr-1 h-3.5 w-3.5" />}
                  {Math.abs(change)}%
                </Badge>
                <span className="text-muted-foreground">vs previous period</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
