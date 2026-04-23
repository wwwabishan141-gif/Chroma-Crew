import { 
  collection, 
  addDoc, 
  query, 
  where, 
  onSnapshot, 
  doc, 
  updateDoc, 
  orderBy, 
  getDocs,
  Timestamp,
  setDoc
} from "firebase/firestore";
import { db } from "./firebase";

export interface Order {
  id?: string;
  orderId: string;
  userId: string | null;
  name: string;
  phone: string;
  address: string;
  products: any[];
  total: number;
  imageUrl?: string | null;
  paymentMethod?: string;
  status: "Received" | "Processing" | "Printed" | "Shipped" | "Delivered";
  createdAt: any;
}

export const createOrder = async (orderData: Omit<Order, "id">) => {
  const ordersRef = collection(db, "orders");
  // Use setDoc with a custom ID or addDoc. The requirement says CC-XXXXXX
  // We'll use setDoc with the orderId as the document ID for easier lookup if needed, 
  // but addDoc is also fine. Let's use the CC-XXXXXX as the document ID.
  await setDoc(doc(db, "orders", orderData.orderId), orderData);
  return orderData.orderId;
};

export const subscribeToUserOrders = (userId: string, callback: (orders: Order[]) => void) => {
  const q = query(
    collection(db, "orders"), 
    where("userId", "==", userId),
    orderBy("createdAt", "desc")
  );
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
    callback(orders);
  });
};

export const subscribeToAllOrders = (callback: (orders: Order[]) => void) => {
  const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
  
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Order[];
    callback(orders);
  });
};

export const updateOrderStatus = async (orderId: string, status: string) => {
  const orderRef = doc(db, "orders", orderId);
  await updateDoc(orderRef, { status });
};

export const submitNewsletterEmail = async (email: string) => {
  const newsletterRef = collection(db, "newsletter");
  await addDoc(newsletterRef, {
    email,
    createdAt: Timestamp.now(),
  });
};
