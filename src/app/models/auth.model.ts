export type UserRole = 'ROLE_ADMIN' | 'ROLE_CLIENT' | 'ROLE_WHOLESALE';

export type WholesaleStatus = 'NONE' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  address?: string;
  role: UserRole;
  wholesaleStatus?: WholesaleStatus;
  companyName?: string;
  tradeRegister?: string;
  token: string;
  type: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  address?: string;
}

export interface WholesaleRegistrationRequest {
  fullName: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  tradeRegister: string;
  businessAddress: string;
}

export interface WholesaleRequestDTO {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  companyName?: string;
  tradeRegister?: string;
  businessAddress?: string;
  wholesaleStatus: WholesaleStatus;
  role: UserRole;
  requestedAt?: string;
  approvedAt?: string;
}
