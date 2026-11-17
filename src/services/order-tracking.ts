import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import type { OrderTracking } from "./types/order";

export const getOrderTracking = async (
  token?: string,
): Promise<OrderTracking | null> => {
  const trackingToken = token?.trim();

  if (!trackingToken) {
    return null;
  }

  const trackingRef = doc(db, "publicTracking", trackingToken);
  const trackingSnapshot = await getDoc(trackingRef);

  if (!trackingSnapshot.exists()) {
    return null;
  }

  const trackingData = trackingSnapshot.data() as OrderTracking;

  return {
    ...trackingData,
    trackingId: trackingSnapshot.id,
  };
};
