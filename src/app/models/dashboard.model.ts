import { OrderDTO } from './order.model';

export interface DashboardStatsDTO {
  totalRevenue?: number;
  totalOrders?: number;
  totalProducts?: number;
  lowStockProducts?: number;
  recentOrders?: OrderDTO[];
  ordersByStatus?: Record<string, number>;
  topSellingProducts?: {
    id: number;
    name: string;
    salesCount: number;
    revenue: number;
  }[];
  [key: string]: unknown;
}
