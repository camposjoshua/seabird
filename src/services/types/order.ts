import { FieldValue, Timestamp } from "firebase/firestore";

export type OrderStatus =
  | "received"
  | "processing"
  | "ready"
  | "completed"
  | "cancelled";

export type CustomerDetails = {
  name: string;
  email: string;
  phone: string;
};

export type CartItem = {
  serviceId: string;
  name: string;
  price: number;
  unit: string;
  quantity: number;
};

export type OrderItem = CartItem & {
  subtotal: number;
};

export type StatusHistoryItem = {
  status: OrderStatus;
  timestamp: string;
};

export type Order = {
  id: string;
  orderNumber: string;
  trackingToken: string;
  customer: CustomerDetails;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  statusHistory: StatusHistoryItem[];
  createdAt: Timestamp | null;
};

export type OrderFirestore = Omit<Order, "id" | "createdAt"> & {
  createdAt: FieldValue;
};

export type CreateOrderParams = {
  cart: CartItem[];
  customerDetails: CustomerDetails;
};
