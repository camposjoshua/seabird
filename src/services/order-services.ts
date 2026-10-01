import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";
import type { CreateOrderParams, Order, OrderFirestore } from "./types/order";

const generateOrderNumber = () => {
  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `LAU-${randomNumber}`;
};

const generateTrackingToken = () => {
  const randomValues = crypto.getRandomValues(new Uint8Array(16));

  return Array.from(randomValues)
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
};

export const createOrder = async ({
  cart,
  customerDetails,
}: CreateOrderParams): Promise<Order> => {
  const orderNumber = generateOrderNumber();
  const trackingToken = generateTrackingToken();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order: OrderFirestore = {
    orderNumber,

    trackingToken,

    customer: {
      name: customerDetails.name,
      email: customerDetails.email,
      phone: customerDetails.phone,
    },

    items: cart.map((item) => ({
      serviceId: item.serviceId,
      name: item.name,
      price: item.price,
      unit: item.unit,
      quantity: item.quantity,
      subtotal: item.price * item.quantity,
    })),

    total,

    status: "received",

    statusHistory: [
      {
        status: "received",
        timestamp: new Date().toISOString(),
      },
    ],

    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, "orders"), order);

  return {
    id: docRef.id,
    ...order,
    createdAt: null,
  };
};
