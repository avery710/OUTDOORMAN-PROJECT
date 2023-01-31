import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBB0cdeDRCZyNszQa-r4OGtptXGqXlKcEA",
  authDomain: "outdoorman-project.firebaseapp.com",
  projectId: "outdoorman-project",
  storageBucket: "outdoorman-project.appspot.com",
  messagingSenderId: "79664945509",
  appId: "1:79664945509:web:152d68073b430e37d2698c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);