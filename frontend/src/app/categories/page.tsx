'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"

interface Category {
  id: number;
  name: string;
  description?: string;
  productsCount: number;
  createdAt: string;
  updatedAt: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    api.get('/categories')
      .then(response => setCategories(response.data))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Categories</h1>
        <Button>Add Category</Button>
      </div>

      <div className="space-y-4">
        {categories.map(c => (
          <Card key={c.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{c.name}</span>
                <Badge variant="outline">
                  {c.productsCount} products
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>Description:</strong> {c.description || 'No description'}
                </div>
                <div>
                  <strong>Created:</strong> {new Date(c.createdAt).toLocaleDateString()}
                </div>
                <div>
                  <strong>Updated:</strong> {new Date(c.updatedAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}