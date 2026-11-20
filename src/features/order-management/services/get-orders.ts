import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  type DocumentData,
  type QueryDocumentSnapshot,
} from "firebase/firestore";

import { db } from "../../../services/firebase";
import type { Order } from "../../../services/types/order";

export type OrdersPage = {
  orders: Order[];
  lastVisible: QueryDocumentSnapshot<DocumentData> | null;
  hasNextPage: boolean;
};

export const getOrders = async (
  pageSize = 10,
  cursor?: QueryDocumentSnapshot<DocumentData> | null,
): Promise<OrdersPage> => {
  const ordersQuery = cursor
    ? query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        startAfter(cursor),
        limit(pageSize + 1),
      )
    : query(
        collection(db, "orders"),
        orderBy("createdAt", "desc"),
        limit(pageSize + 1),
      );

  const snapshot = await getDocs(ordersQuery);

  const hasNextPage = snapshot.docs.length > pageSize;
  const pageDocs = snapshot.docs.slice(0, pageSize);

  return {
    orders: pageDocs.map((document) => ({
      ...document.data(),
      id: document.id,
    })) as Order[],
    lastVisible: pageDocs[pageDocs.length - 1] ?? null,
    hasNextPage,
  };
};
