'use client';

import { useEffect, useState } from 'react';
import api, { setAuthToken } from '@/lib/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

type Product = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    setAuthToken(token || undefined);
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const res = await api.get('/products');
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      alert('Failed to load products');
    }
  }

  async function createProduct() {
    try {
      const body = { name, description, price: Number(price), stock: Number(stock), supplierId: 'seed_supplier' };
      await api.post('/products', body);
      setName('');
      setDescription('');
      setPrice('');
      setStock('');
      fetchProducts();
    } catch (err) {
      console.error(err);
      alert('Failed to create product (make sure you are logged in)');
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Products</h1>

      <div className="grid grid-cols-3 gap-4">
        {products.map((p) => (
          <Card key={p.id}>
            <CardHeader>
              <CardTitle>{p.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{p.description}</p>
              <p className="text-sm mt-2">Price: ${p.price}</p>
              <p className="text-sm">Stock: {p.stock}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 w-96">
        <Card>
          <CardHeader>
            <CardTitle>Add product</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <Input placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-2" />
            <Input placeholder="Price" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-2" />
            <Input placeholder="Stock" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-2" />
            <Button onClick={createProduct} className="mt-4 w-full">Create</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
