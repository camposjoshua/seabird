import { query, collection, orderBy, getDocs } from "firebase/firestore";
import { db } from "../../../services/firebase";
import type { Order } from "../../../services/types/order";

export const getOrders = async (): Promise<Order[]> => {
  const ordersQuery = query(
    collection(db, "orders"),
    orderBy("createdAt", "desc"),
  );

  const snapshot = await getDocs(ordersQuery);

  return snapshot.docs.map((document) => ({
    ...document.data(),
    id: document.id,
  })) as Order[];
};
