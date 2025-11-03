export interface Address {
  id: string
  type: 'shipping' | 'billing'
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault: boolean
  fullAddress?: string
}

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
  addresses: Address[]
  orders?: Order[]
  createdAt: string
  updatedAt: string
  fullName?: string
  orderCount?: number
  totalSpent?: number
}

export interface CreateCustomerData {
  firstName: string
  lastName: string
  email: string
  phone?: string
  company?: string
}

export interface CreateAddressData {
  type: 'shipping' | 'billing'
  street: string
  city: string
  state: string
  postalCode: string
  country: string
  isDefault?: boolean
}