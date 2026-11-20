import {
  collection,
  doc,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";
import { db } from "./firebase";
import type {
  CreateOrderParams,
  Order,
  OrderFirestore,
  StatusHistoryItem,
} from "./types/order";

export const generateOrderNumber = () => {
  const now = new Date();

  const dateTime = [
    String(now.getMonth() + 1).padStart(2, "0"),
    String(now.getDate()).padStart(2, "0"),
    String(now.getHours()).padStart(2, "0"),
    String(now.getMinutes()).padStart(2, "0"),
  ].join("");

  const randomNumber = Math.floor(1000 + Math.random() * 9000);

  return `LAU-${dateTime}-${randomNumber}`;
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
  branchId,
  downPayment,
}: CreateOrderParams): Promise<Order> => {
  const orderNumber = generateOrderNumber();
  const trackingToken = generateTrackingToken();

  const trackingLink = `${window.location.origin}${import.meta.env.BASE_URL}track/${trackingToken}`;

  console.log("BASE URL:", import.meta.env.BASE_URL);
  console.log("TRACKING LINK:", trackingLink);
  console.log(branchId);

  const orderRef = doc(collection(db, "orders"));
  const trackingRef = doc(db, "publicTracking", trackingToken);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const appliedDownPayment = Math.min(Math.max(0, downPayment || 0), subtotal);

  const total = subtotal - appliedDownPayment;

  const statusHistory: StatusHistoryItem[] = [
    {
      status: "received",
      timestamp: new Date().toISOString(),
    },
  ];

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

    branchId,
    downPayment: appliedDownPayment,
    total,
    status: "received",
    statusHistory,
    createdAt: serverTimestamp(),
  };

  const tracking = {
    orderId: orderRef.id,
    orderNumber,
    status: "received",
    statusHistory,
  };

  const batch = writeBatch(db);

  batch.set(orderRef, order);
  batch.set(trackingRef, tracking);

  await batch.commit();

  return {
    id: orderRef.id,
    ...order,
    trackingLink,
    createdAt: null,
  };
};
