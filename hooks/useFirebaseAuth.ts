import { useState, useEffect } from 'react'
import { getAuth, onAuthStateChanged, signInWithRedirect, GoogleAuthProvider, signOut, Auth, User } from "firebase/auth"
import { provider } from '../lib/firebase'
import { db } from '../lib/firebase'
import { doc, setDoc, getDoc } from "firebase/firestore"
import { userType } from 'types'


export default function useFirebaseAuth(){
    const [ authUser, setAuthUser ] = useState<userType | null>(null)
    const [ loading, setLoading ] = useState<boolean>(true)
    // const [ username, setUsername ] = useState<string>("")

    async function handleAuthChange(user: User | null){
        if (!user){
            setLoading(false)
            return
        }

        setLoading(true)

        // fetch username from db
        const docRef = doc(db, "users", user.uid)
        const docSnap = await getDoc(docRef)
        let username = ""
        if (docSnap.exists()) {
            username = docSnap.data().username
        }

        // get uniqName from email
        const email = user.email
        let uniqname = ""
        if (email){
            const subEmail = email.substring(0, email.indexOf("@"))
            const char = "@"
            uniqname = char.concat(subEmail)
        }
        
        const formattedUser: userType = {
            uid: user.uid,
            photoUrl: user.photoURL,
            email: user.email,
            username: username, // get username from db
            uniqname: uniqname,
        }

        console.log(formattedUser)
        setAuthUser(formattedUser)
        setLoading(false)
    }

    function signInWithGoogle(){
        const auth = getAuth()
        signInWithRedirect(auth, provider)
    }

    async function signOutGoogle(){
        const auth = getAuth()
        await signOut(auth)

        setAuthUser(null)
        setLoading(true) // init state
    }

    // listen for Firebase state change
    useEffect(() => {
        const auth = getAuth()
        const unsubscribe = onAuthStateChanged(auth, user => handleAuthChange(user))
        return () => unsubscribe()
    }, [])

    return {
        authUser,
        loading,
        signInWithGoogle,
        signOutGoogle,
    }
}