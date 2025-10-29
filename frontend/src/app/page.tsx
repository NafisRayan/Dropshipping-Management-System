import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dropshipping Management System</h1>
        <p className="text-muted-foreground">Manage your products, orders, suppliers, and customers efficiently</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>Manage your product catalog and variants</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/products">
              <Button className="w-full">View Products</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders</CardTitle>
            <CardDescription>Track and manage customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/orders">
              <Button className="w-full">View Orders</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Suppliers</CardTitle>
            <CardDescription>Manage suppliers and API integrations</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/suppliers">
              <Button className="w-full">View Suppliers</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customers</CardTitle>
            <CardDescription>View customer information and history</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/customers">
              <Button className="w-full">View Customers</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Users</CardTitle>
            <CardDescription>Manage system users and roles</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/users">
              <Button className="w-full">View Users</Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>Organize products by categories</CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/categories">
              <Button className="w-full">View Categories</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
