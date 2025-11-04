import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { TopProduct } from "@/lib/dashboard-data";
import { ArrowUpRight } from "lucide-react";

type TopProductsProps = {
  products: TopProduct[];
};

export function TopProducts({ products }: TopProductsProps) {
  return (
    <Card className="border-border/60 bg-card/70 backdrop-blur">
      <CardHeader className="pb-4 sm:pb-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-base font-semibold sm:text-lg">Top performing SKUs</CardTitle>
            <CardDescription className="text-sm">High-volume listings across the network</CardDescription>
          </div>
          <Badge variant="outline" className="w-fit rounded-full border-primary/30 px-3 text-xs text-primary">
            Catalogue momentum
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 px-4 pb-5 sm:px-6 sm:pb-6">
        <div className="hidden min-w-full overflow-x-auto lg:block">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead className="text-right">Orders</TableHead>
                <TableHead className="text-right">Revenue</TableHead>
                <TableHead className="text-right">Conversion</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.name}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <ArrowUpRight className="h-4 w-4 text-primary" />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{product.orders.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    {Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(product.revenue)}
                  </TableCell>
                  <TableCell className="text-right">{product.conversionRate}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:hidden">
          {products.map((product) => (
            <div key={`${product.name}-card`} className="rounded-2xl border border-border/40 bg-muted/10 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium text-foreground/90">
                  <ArrowUpRight className="h-4 w-4 text-primary" />
                  <span>{product.name}</span>
                </div>
                <Badge variant="secondary" className="rounded-full bg-primary/10 text-xs text-primary">
                  {product.conversionRate}%
                </Badge>
              </div>
              <dl className="mt-3 grid grid-cols-2 gap-3 text-xs text-muted-foreground sm:text-sm">
                <div className="space-y-1">
                  <dt>Orders</dt>
                  <dd className="text-sm font-semibold text-foreground sm:text-base">{product.orders.toLocaleString()}</dd>
                </div>
                <div className="space-y-1">
                  <dt>Revenue</dt>
                  <dd className="text-sm font-semibold text-foreground sm:text-base">
                    {Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(product.revenue)}
                  </dd>
                </div>
              </dl>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
