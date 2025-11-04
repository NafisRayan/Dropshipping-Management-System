"use client";

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Line,
  LineChart,
} from "recharts";

import type { MonthlyPerformancePoint } from "@/lib/dashboard-data";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const numberFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const ordersFormatter = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

type PerformanceChartProps = {
  data: MonthlyPerformancePoint[];
};

export function PerformanceChart({ data }: PerformanceChartProps) {
  return (
    <Card className="p-5 sm:p-6 lg:p-7">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-base font-semibold sm:text-lg">Revenue & Orders</h3>
          <p className="text-sm text-muted-foreground">
            Six month trend including seasonality adjustments
          </p>
        </div>
      </div>

      <Tabs defaultValue="revenue" className="mt-5 sm:mt-6">
        <TabsList className="w-full sm:w-auto">
          <TabsTrigger value="revenue">Revenue focus</TabsTrigger>
          <TabsTrigger value="orders">Orders focus</TabsTrigger>
        </TabsList>

        <TabsContent value="revenue" className="mt-6">
          <div className="h-60 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="revenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--chart-1))" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="hsl(var(--chart-1))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => numberFormatter.format(value as number)}
                />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value) => numberFormatter.format(value as number)}
                />
                <Legend />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--chart-1))"
                  fill="url(#revenue)"
                  name="Revenue"
                />
                <Line
                  type="monotone"
                  dataKey="profitMargin"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={false}
                  name="Profit margin %"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>

        <TabsContent value="orders" className="mt-6">
          <div className="h-60 sm:h-72 lg:h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ strokeDasharray: "3 3" }}
                  formatter={(value) => ordersFormatter.format(value as number)}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="hsl(var(--chart-3))"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                  name="Orders"
                />
                <Line
                  type="monotone"
                  dataKey="newUsers"
                  stroke="hsl(var(--chart-4))"
                  strokeDasharray="5 5"
                  strokeWidth={2}
                  dot={false}
                  name="New users"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </TabsContent>
      </Tabs>

      <Separator className="my-5 sm:my-6" />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
        <div>
          Latest revenue is <span className="font-semibold text-foreground">{numberFormatter.format(data.at(-1)?.revenue ?? 0)}</span>
        </div>
        <div>
          Orders average <span className="font-semibold text-foreground">{ordersFormatter.format(Math.round((data.reduce((acc, item) => acc + item.orders, 0) / Math.max(data.length, 1))))}</span> per month
        </div>
        <div>
          Profit margin peaked at <span className="font-semibold text-foreground">{data.reduce((acc, item) => Math.max(acc, item.profitMargin), 0)}%</span>
        </div>
      </div>
    </Card>
  );
}
