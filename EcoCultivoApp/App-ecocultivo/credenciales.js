import { initializeApp, getApps, getApp } from "firebase/app"; // Import getApp and getApps to check if already initialized
import { getFirestore } from "firebase/firestore";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
// export default appFirebase

// Initialize Firestore
const db = getFirestore(appFirebase);

// Initialize Auth with AsyncStorage
//const auth = initializeAuth(appFirebase, {
//  persistence: getReactNativePersistence(AsyncStorage)
//});

// Inicializamos auth SIN persistencia
const auth = getAuth(appFirebase);

// Inicializar Storage
const storage = getStorage(appFirebase);

export { db, auth, storage}; // Exportar db - auth - storage
