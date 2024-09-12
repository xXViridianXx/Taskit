import { initializeApp } from 'firebase/app';
// import * as firebase from 'firebase'
import { getAuth, getReactNativePersistence, initializeAuth} from 'firebase/auth'
import { getFirestore, doc, setDoc, getDoc, addDoc} from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {REACT_APP_FIREBASEKEY} from '@env'
// Optionally import the services that you want to use
// import {...} from "firebase/auth";
// import {...} from "firebase/database";
// import {...} from "firebase/firestore";
// import {...} from "firebase/functions";
// import {...} from "firebase/storage";

// Initialize Firebase
console.log(REACT_APP_FIREBASEKEY)
const firebaseConfig = {
  apiKey: REACT_APP_FIREBASEKEY,
  authDomain: "sidequest-c97a6.firebaseapp.com",
  projectId: "sidequest-c97a6",
  storageBucket: "sidequest-c97a6.appspot.com",
  messagingSenderId: "593425807002",
  appId: "1:593425807002:web:884c8b0937d80612549123",
  measurementId: "G-KEQEYNRBN0"
};


const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
// const auth = getAuth(app);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage), // Use AsyncStorage for persistence
});

// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage)
// });
const database = getFirestore(app)
// const database = firestore()
export {
  firebaseConfig,
  app,
  auth,
  database,
  doc,
  setDoc,
  addDoc,
  getDoc
}

// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase
