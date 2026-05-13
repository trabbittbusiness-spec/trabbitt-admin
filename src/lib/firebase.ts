import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuración FINAL y REAL del Proyecto Trabbitt
const firebaseConfig = {
  apiKey: "AIzaSyC758qKTcAe3CBVIcg6PDY5i_-LvoE_q-k",
  authDomain: "trabbitt-42dbe.firebaseapp.com",
  projectId: "trabbitt-42dbe",
  storageBucket: "trabbitt-42dbe.appspot.com",
  messagingSenderId: "499293602938",
  appId: "1:499293602938:web:164e26783713cf0588a7c3",
  measurementId: "G-9DBQFMSWVT"
};

// Inicialización Modular (v9+)
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
