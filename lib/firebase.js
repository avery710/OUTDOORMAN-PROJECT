import firebase from 'firebase/compat/app'
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

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
export const googleAuthProvider = new firebase.auth.GoogleAuthProvider()

export const firestore = firebase.firestore()
export const storage = firebase.storage()