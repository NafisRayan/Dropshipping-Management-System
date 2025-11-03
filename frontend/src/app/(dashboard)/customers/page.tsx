'use client'

import { useState } from 'react'
import { useQuery } from 'react-query'
import { Plus, Search, Users, ShoppingCart, DollarSign } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoadingSpinner } from '@/components/common/loading-spinner'
import { CustomerList } from '@/components/customers/customer-list'
import { customersApi } from '@/lib/api'
import Link from 'next/link'

export default function CustomersPage() {
  const [searchTerm, setSearchTerm] = useState('')

  const { data: customers, isLoading, refetch } = useQuery(
    ['customers', searchTerm],
    () => customersApi.getAll(),
    {
      staleTime: 5 * 60 * 1000, // 5 minutes
    }
  )

  // Filter customers based on search
  const filteredCustomers = customers?.data?.filter((customer: any) => {
    if (!searchTerm) return true
    
    const searchLower = searchTerm.toLowerCase()
    return (
      customer.firstName.toLowerCase().includes(searchLower) ||
      customer.lastName.toLowerCase().includes(searchLower) ||
      customer.email.toLowerCase().includes(searchLower) ||
      customer.company?.toLowerCase().includes(searchLower) ||
      customer.phone?.toLowerCase().includes(searchLower)
    )
  }) || []

  const handleSearch = (value: string) => {
    setSearchTerm(value)
  }

  // Customer statistics
  const totalCustomers = customers?.data?.length || 0
  const customersWithOrders = filteredCustomers.filter(c => c.orderCount > 0).length
  const totalRevenue = filteredCustomers.reduce((sum: number, c: any) => sum + (c.totalSpent || 0), 0)

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <LoadingSpinner size="large" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Customers</h1>
          <p className="text-gray-600 mt-1">
            Manage your customer relationships ({totalCustomers} total)
          </p>
        </div>
        <Link href="/customers/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* Customer Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalCustomers}</p>
                <p className="text-sm text-gray-500">Total Customers</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-full">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">{customersWithOrders}</p>
                <p className="text-sm text-gray-500">Active Customers</p>
              </div>
              <div className="p-3 bg-green-50 rounded-full">
                <ShoppingCart className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-gray-900">
                  {totalRevenue.toLocaleString('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })}
                </p>
                <p className="text-sm text-gray-500">Total Customer Value</p>
              </div>
              <div className="p-3 bg-purple-50 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search customers..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Button
              variant="outline"
              onClick={() => setSearchTerm('')}
            >
              Clear Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Customer List */}
      <CustomerList 
        customers={filteredCustomers} 
        isLoading={isLoading}
        onRefresh={refetch}
      />
    </div>
  )
}