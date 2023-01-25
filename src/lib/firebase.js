import firebase from "firebase/app"
import 'firebase/auth'
import 'firebase/firestore'
import 'firebase/storage'

const firebaseConfig = {
    apiKey: "AIzaSyBB0cdeDRCZyNszQa-r4OGtptXGqXlKcEA",
    authDomain: "outdoorman-project.firebaseapp.com",
    projectId: "outdoorman-project",
    storageBucket: "outdoorman-project.appspot.com",
    messagingSenderId: "79664945509",
    appId: "1:79664945509:web:f41cf26f76ee9b9bd2698c"
};

if (!firebase.apps.length){
    firebase.initializeApp(firebaseConfig)
}

export const auth = firebase.auth()
export const firestore = firebase.firestore()
export const storage = firebase.storage()