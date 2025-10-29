'use client'

import { useEffect, useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import api from "@/lib/api"

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin?: string;
  createdAt: string;
}

const getRoleColor = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin': return 'destructive';
    case 'seller': return 'default';
    case 'staff': return 'secondary';
    default: return 'outline';
  }
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    api.get('/users')
      .then(response => setUsers(response.data))
      .catch(error => console.error('Error fetching users:', error));
  }, []);

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button>Add User</Button>
      </div>

      <div className="space-y-4">
        {users.map(u => (
          <Card key={u.id}>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{u.username}</span>
                <div className="flex gap-2 items-center">
                  <Badge variant={getRoleColor(u.role)}>
                    {u.role}
                  </Badge>
                  <Badge variant={u.isActive ? 'default' : 'secondary'}>
                    {u.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <strong>Email:</strong> {u.email}
                </div>
                <div>
                  <strong>Last Login:</strong> {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Never'}
                </div>
                <div>
                  <strong>Joined:</strong> {new Date(u.createdAt).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}