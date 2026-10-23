import { CategoryDTO } from './category.model';

export type ProductStatus = 'EN_STOCK' | 'RUPTURE' | 'NOUVEAU';

export interface ProductImageDTO {
  id?: number;
  originalName: string;
  storedFileName: string;
  displayOrder: number;
}

export interface ProductDTO {
  id: number;
  name: string;
  brand: string;
  description: string;
  price: number;
  wholesalePrice?: number | null;
  wholesaleMinQty?: number | null;
  stock: number;
  category: CategoryDTO | number | string;
  images: ProductImageDTO[];
  rating: number;
  status: ProductStatus;
}

export interface CreateProductDTO {
  name: string;
  brand: string;
  description: string;
  price: number;
  wholesalePrice?: number | null;
  wholesaleMinQty?: number | null;
  stock: number;
  category: number | string;
  images?: ProductImageDTO[];
  rating?: number;
  status: ProductStatus;
}
