import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA9GI8fHIsL2x6HLXR_dgCIhGtsLruqVVE",
    authDomain: "spacegunner-e9ab7.firebaseapp.com",
    projectId: "spacegunner-e9ab7",
    storageBucket: "spacegunner-e9ab7.appspot.com",
    messagingSenderId: "146530091121",
    appId: "1:146530091121:web:f2ec7215a8d71a99e25bd0",
    measurementId: "G-GNVCB7RF3X"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };