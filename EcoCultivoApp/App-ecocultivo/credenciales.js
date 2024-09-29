// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import  { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOHXz2YCmAbONID1cbU6ChDFKwELEScSw",
  authDomain: "ecocultivoapp.firebaseapp.com",
  projectId: "ecocultivoapp",
  storageBucket: "ecocultivoapp.appspot.com",
  messagingSenderId: "561616987319",
  appId: "1:561616987319:web:f11773d32c597456579932"
};

// Initialize Firebase
const appFirebase = initializeApp(firebaseConfig);
export default appFirebase

// Initialize Firestore
const db = getFirestore(appFirebase);

// Initialize Auth
const auth = getAuth(appFirebase);

export { db, auth }; // Exportar db y auth