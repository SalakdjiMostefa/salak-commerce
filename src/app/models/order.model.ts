export type OrderStatus =
  | 'EN_ATTENTE'
  | 'PAYEE'
  | 'EXPEDIEE'
  | 'LIVREE'
  | 'ANNULEE'
  | 'PAYE'
  | 'EXPEDIE'
  | 'LIVRE'
  | 'ANNULE';

export interface OrderItemDTO {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  image?: string;
}

export type PaymentMethod = 'CASH_ON_DELIVERY' | 'BARIDIMOB';

export interface OrderDTO {
  id: number;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItemDTO[];
  total: number;
  status: OrderStatus;
  createdAt: string | Date;
  paymentMethod?: string;
}

export interface CreateOrderDTO {
  customerName: string;
  email: string;
  phone: string;
  address: string;
  items: OrderItemDTO[];
  total: number;
  status?: OrderStatus;
  paymentMethod?: string;
}

