import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-8">Dropshipping Management System</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/products">
          <Button className="w-full h-20 text-lg">Products</Button>
        </Link>
        <Link href="/suppliers">
          <Button className="w-full h-20 text-lg">Suppliers</Button>
        </Link>
        <Link href="/orders">
          <Button className="w-full h-20 text-lg">Orders</Button>
        </Link>
        <Link href="/inventory">
          <Button className="w-full h-20 text-lg">Inventory</Button>
        </Link>
      </div>
    </div>
  );
}
