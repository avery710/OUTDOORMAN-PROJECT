import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getStorage, ref } from "firebase/storage";


const firebaseConfig = {
    apiKey: "AIzaSyDTwzBVdltzylrXVM2fjYPOw2CHOR8Yl8w",
    authDomain: "new-outdoorman-project.firebaseapp.com",
    projectId: "new-outdoorman-project",
    storageBucket: "new-outdoorman-project.appspot.com",
    messagingSenderId: "473729154571",
    appId: "1:473729154571:web:5722e496312022ef6e110e"
}


// Initialize Firebase
const app = initializeApp(firebaseConfig)
export const db = getFirestore(app)
export const auth = getAuth(app)
export const provider = new GoogleAuthProvider()
export const storage = getStorage(app)