'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"

interface ProductVariant {
  id: number;
  name: string;
  value: string;
  priceModifier: number;
  stock: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  supplier: { name: string };
  category: { name: string };
  variants: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);

  useEffect(() => {
    api.get('/products')
      .then(response => setProducts(response.data))
      .catch(error => console.error('Error fetching products:', error));
  }, []);

  const toggleVariants = (productId: number) => {
    setExpandedProduct(expandedProduct === productId ? null : productId);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button>Add Product</Button>
      </div>

      <div className="space-y-4">
        {products.map(p => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{p.name}</span>
                <div className="flex gap-2">
                  <Badge variant={p.stock < 10 ? "destructive" : "secondary"}>
                    Stock: {p.stock}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleVariants(p.id)}
                  >
                    {expandedProduct === p.id ? 'Hide' : 'Show'} Variants
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <strong>Description:</strong> {p.description}
                </div>
                <div>
                  <strong>Price:</strong> ${p.price}
                </div>
                <div>
                  <strong>Category:</strong> {p.category.name}
                </div>
                <div>
                  <strong>Supplier:</strong> {p.supplier.name}
                </div>
                <div>
                  <strong>Variants:</strong> {p.variants.length}
                </div>
                <div>
                  <strong>Updated:</strong> {new Date(p.updatedAt).toLocaleDateString()}
                </div>
              </div>

              {expandedProduct === p.id && p.variants.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-semibold mb-2">Product Variants:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Variant Type</TableHead>
                        <TableHead>Value</TableHead>
                        <TableHead>Price Modifier</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Final Price</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {p.variants.map(v => (
                        <TableRow key={v.id}>
                          <TableCell>{v.name}</TableCell>
                          <TableCell>{v.value}</TableCell>
                          <TableCell>${v.priceModifier}</TableCell>
                          <TableCell>
                            <Badge variant={v.stock < 5 ? "destructive" : "secondary"}>
                              {v.stock}
                            </Badge>
                          </TableCell>
                          <TableCell>${(p.price + v.priceModifier).toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}