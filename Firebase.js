import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBSkknxx8RsR8lxUcNc4N6jSdsKSKRQh_s",
    authDomain: "todo-7cdd9.firebaseapp.com",
    projectId: "todo-7cdd9",
    storageBucket: "todo-7cdd9.appspot.com",
    messagingSenderId: "107979790312",
    appId: "1:107979790312:web:a86f6e1dd185d3a87a765d",
    measurementId: "G-8G3CRH2KK9"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
