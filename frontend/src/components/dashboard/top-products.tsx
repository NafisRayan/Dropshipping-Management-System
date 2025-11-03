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
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Top performing SKUs</CardTitle>
            <CardDescription>High-volume listings across the network</CardDescription>
          </div>
          <Badge variant="outline" className="rounded-full border-primary/30 text-xs text-primary">
            Catalogue momentum
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
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
      </CardContent>
    </Card>
  );
}
