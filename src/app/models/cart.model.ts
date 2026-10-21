import { ProductDTO } from './product.model';

export interface CartItem {
  product: ProductDTO;
  quantity: number;
}
