import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase";
import type { LaundryService } from "./types/laundry";

export const getLaundryServices = async (): Promise<LaundryService[]> => {
  const snapshot = await getDocs(collection(db, "services"));

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as LaundryService[];
};
