import { initializeApp } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-auth.js";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, query, where, deleteDoc } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/9.23.0/firebase-storage.js";
//--------------------------FIREBASE CONFIG APNA USE KRO---------------------------------//

const firebaseConfig = {
    apiKey: "AIzaSyDy0DBhbfPgJ3X0Gl3GGcuruxywWorAuxQ",
    authDomain: "social-media-app-3000.firebaseapp.com",
    projectId: "social-media-app-3000",
    storageBucket: "social-media-app-3000.appspot.com",
    messagingSenderId: "521872056341",
    appId: "1:521872056341:web:8cdacf616b38650f12ee1c"
};

//--------------------------FIREBASE CONFIG APNA USE KRO---------------------------------//

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export {app, auth, db, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, getFirestore, collection, addDoc, doc, setDoc, getDoc, getDocs, onAuthStateChanged, signOut, query, where, storage, ref, uploadBytesResumable, getDownloadURL, deleteDoc}