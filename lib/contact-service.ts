import { collection, addDoc, Timestamp, query, orderBy, onSnapshot, getDocs } from "firebase/firestore"
import { db } from "./firebase"

export interface ContactMessage {
  id?: string
  name: string
  email: string
  subject: string
  message: string
  read: boolean
  createdAt: any
}

const CONTACTS_COLLECTION = "contact_messages"

export const submitContactMessage = async (
  data: Omit<ContactMessage, "id" | "read" | "createdAt">
): Promise<string> => {
  const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
    ...data,
    read: false,
    createdAt: Timestamp.now(),
  })
  return docRef.id
}

export const subscribeToContactMessages = (
  callback: (messages: ContactMessage[]) => void
) => {
  const q = query(
    collection(db, CONTACTS_COLLECTION),
    orderBy("createdAt", "desc")
  )

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as ContactMessage[]
    callback(messages)
  })
}

export const buildWhatsAppContactLink = (data: {
  name: string
  email: string
  subject: string
  message: string
}) => {
  const text = `📩 New Contact Message from ChromaCrew Website\n\nName: ${data.name}\nEmail: ${data.email}\nSubject: ${data.subject}\n\nMessage:\n${data.message}`
  return `https://wa.me/94763425409?text=${encodeURIComponent(text)}`
}
