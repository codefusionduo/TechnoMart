export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: 'phone' | 'earbud' | 'tablet' | 'accessory' | string;
}

export interface User {
  id: string;
  _id?: string;
  name: string;
  email: string;
  isVerified?: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  error?: string;
}
