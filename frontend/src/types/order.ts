export interface OrderItem {
  id: string
  productId: string
  productName?: string
  productSku?: string
  quantity: number
  unitPrice: number
  totalPrice: number
  supplierOrderItemId?: string
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  customer?: {
    id: string
    firstName: string
    lastName: string
    email: string
  }
  createdBy?: {
    id: string
    firstName: string
    lastName: string
  }
  subtotal: number
  shippingCost: number
  taxAmount: number
  totalAmount: number
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  supplierOrderId?: string
  trackingNumber?: string
  shippingCarrier?: string
  notes?: string
  items: OrderItem[]
  statusHistory?: OrderStatusHistory[]
  createdAt: string
  updatedAt: string
  itemCount?: number
  isPending?: boolean
  isProcessing?: boolean
  isShipped?: boolean
  isDelivered?: boolean
  isCancelled?: boolean
  isRefunded?: boolean
}

export interface OrderStatusHistory {
  id: string
  status: string
  notes?: string
  createdAt: string
}

export interface CreateOrderData {
  customerId: string
  items: Array<{
    productId: string
    quantity: number
    unitPrice: number
  }>
  shippingCost?: number
  taxAmount?: number
  notes?: string
}