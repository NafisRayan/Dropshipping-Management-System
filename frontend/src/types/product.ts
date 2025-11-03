export interface Product {
  id: string
  name: string
  description: string
  sku: string
  costPrice: number
  sellingPrice: number
  quantity: number
  reservedQuantity: number
  weight?: number
  dimensions?: string
  category?: string
  brand?: string
  supplierId?: string
  supplierProductId?: string
  images: string[]
  isActive: boolean
  createdAt: string
  updatedAt: string
  availableQuantity?: number
  profitMargin?: number
  isInStock?: boolean
  isLowStock?: boolean
  isOutOfStock?: boolean
}

export interface ProductFilter {
  search?: string
  category?: string
  brand?: string
  supplierId?: string
  isActive?: boolean
  page?: number
  limit?: number
}

export interface ProductResponse {
  data: Product[]
  total: number
}