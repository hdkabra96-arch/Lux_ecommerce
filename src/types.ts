export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  image: string;
  stock: number;
}

export interface Order {
  id: string;
  items: Array<{ productId: string; quantity: number; price: number; name: string }>;
  total: number;
  userId: string;
  status: 'pending' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  customerName: string;
  customerEmail: string;
}

export interface User {
  id: string;
  email: string;
  role: 'admin' | 'customer';
  name: string;
}

export interface Stats {
  totalSales: number;
  orderCount: number;
  productCount: number;
}
