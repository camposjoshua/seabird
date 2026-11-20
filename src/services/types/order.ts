import { FieldValue, Timestamp } from "firebase/firestore";

export type OrderStatus =
  | "received"
  | "preparing"
  | "ready"
  | "completed"
  | "cancelled";

export type OrderTracking = {
  trackingId: string;
  orderNumber: string;
  status: OrderStatus;
  statusHistory: StatusHistoryItem[];
};

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
  branchId: string;
  downPayment: number;
  total: number;
  status: OrderStatus;
  statusHistory: StatusHistoryItem[];
  createdAt: Timestamp | null;
  trackingLink?: string;
};

export type OrderFirestore = Omit<Order, "id" | "createdAt"> & {
  createdAt: FieldValue;
};

export type CreateOrderParams = {
  cart: CartItem[];
  customerDetails: CustomerDetails;
  branchId: string;
  downPayment: number;
};
