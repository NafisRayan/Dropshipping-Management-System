'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  products: { name: string }[];
}

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  useEffect(() => {
    fetch('http://localhost:3001/suppliers')
      .then(res => res.json())
      .then(setSuppliers);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Suppliers</h1>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Products Count</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {suppliers.map(s => (
            <TableRow key={s.id}>
              <TableCell>{s.name}</TableCell>
              <TableCell>{s.contact}</TableCell>
              <TableCell>{s.email}</TableCell>
              <TableCell>{s.products.length}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}