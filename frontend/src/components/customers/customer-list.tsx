'use client'

import { useState } from 'react'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Eye, 
  Edit, 
  ShoppingCart,
  DollarSign,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'
import type { Customer } from '@/types/customer'

interface CustomerListProps {
  customers: Customer[]
  isLoading: boolean
  onRefresh: () => void
}

export function CustomerList({ customers, isLoading, onRefresh }: CustomerListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const totalPages = Math.ceil(customers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentCustomers = customers.slice(startIndex, endIndex)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="animate-pulse space-y-4 w-full">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg">
                <div className="bg-gray-200 rounded-full h-12 w-12" />
                <div className="flex-1 space-y-2">
                  <div className="bg-gray-200 rounded h-4 w-1/4" />
                  <div className="bg-gray-200 rounded h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Customers</CardTitle>
        <CardDescription>Manage your customer relationships</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentCustomers.map((customer) => (
            <div
              key={customer.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {customer.firstName} {customer.lastName}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center mt-1">
                        <Mail className="h-3 w-3 mr-1" />
                        {customer.email}
                      </p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {customer.orderCount > 0 && (
                        <Badge variant="success">
                          <ShoppingCart className="h-3 w-3 mr-1" />
                          {customer.orderCount} orders
                        </Badge>
                      )}
                      
                      {customer.company && (
                        <Badge variant="outline">
                          {customer.company}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    {customer.phone && (
                      <div className="flex items-center text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {customer.phone}
                      </div>
                    )}
                    
                    <div className="flex items-center text-gray-600">
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {customer.orderCount || 0} orders
                    </div>
                    
                    <div className="flex items-center text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      {formatCurrency(customer.totalSpent || 0)} spent
                    </div>
                  </div>
                  
                  {customer.addresses && customer.addresses.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 mb-2">Addresses:</p>
                      <div className="space-y-1">
                        {customer.addresses.slice(0, 2).map((address) => (
                          <div key={address.id} className="flex items-center text-xs text-gray-600">
                            <MapPin className="h-3 w-3 mr-2" />
                            <span>{address.type}: </span>
                            <span className="ml-1">{address.fullAddress}</span>
                            {address.isDefault && (
                              <Badge variant="outline" className="ml-2 text-xs">
                                Default
                              </Badge>
                            )}
                          </div>
                        ))}
                        {customer.addresses.length > 2 && (
                          <p className="text-xs text-gray-500 italic">
                            +{customer.addresses.length - 2} more addresses
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <Link href={`/customers/${customer.id}`}>
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Link href={`/customers/${customer.id}/edit`}>
                    <Button size="sm" variant="ghost">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        {customers.length === 0 && (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No customers found</h3>
            <p className="text-gray-500 mb-6">
              {customers.length === 0 
                ? "Get started by adding your first customer"
                : "Try adjusting your search"
              }
            </p>
            <Link href="/customers/new">
              <Button>
                <User className="h-4 w-4 mr-2" />
                Add Your First Customer
              </Button>
            </Link>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <div className="text-sm text-gray-700">
              Showing {startIndex + 1} to {Math.min(endIndex, customers.length)} of {customers.length} customers
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}