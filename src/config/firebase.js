import { initializeApp } from "firebase/app";
import { getFirestore, getDoc, doc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDO8eDl6JSAxFiB7Mg28bseHiGs7g6m-LI",
  authDomain: "knight-vs-ghost.firebaseapp.com",
  projectId: "knight-vs-ghost",
  storageBucket: "knight-vs-ghost.firebasestorage.app",
  messagingSenderId: "61881845235",
  appId: "1:61881845235:web:9475b715553cfc96df7e86",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export async function getDocument(collectionName, documentId) {
  try {
    const docRef = doc(db, collectionName, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return JSON.parse(docSnap.data().JSON_string);
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
    return null;
  }
}
