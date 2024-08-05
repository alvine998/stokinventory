// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAbVgksMiCVz_03038HDkjdo64ym3ueKqo",
    authDomain: "stokinventory-86e98.firebaseapp.com",
    projectId: "stokinventory-86e98",
    storageBucket: "stokinventory-86e98.appspot.com",
    messagingSenderId: "840929857871",
    appId: "1:840929857871:web:dd1f56b7d14067aadb753a",
    measurementId: "G-SE57DD9BRX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export { storage }