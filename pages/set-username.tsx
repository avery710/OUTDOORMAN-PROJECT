import { db } from '../lib/firebase'
import { doc, setDoc, getDoc } from "firebase/firestore"
import React, { useEffect, useRef, useState } from "react"
import { useAuth } from '../hooks/context'
import { useRouter } from 'next/router';

export default function AddUsername() {
    // const [ formVal, setFormVal ] = useState<string>("")
    // const [ isValid, setIsValid ] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { authUser, loading } = useAuth()
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()

        // save all user info to db and redirect to index page
        if (authUser && authUser.uid){
            try {
                await setDoc(doc(db, "users", authUser.uid), {
                    photoUrl: authUser.photoUrl,
                    email: authUser.email,
                    username: inputRef.current?.value
                })

                router.reload()
            }
            catch(error){
                console.log(error)
            }
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        // regular expression
        const val = e.target.value

        // if (val.length < 3) {
        //     setIsValid(false)

        // }
        // else {
        //     setIsValid(true)
        // }
    }

    useEffect(() => {
        if (!loading && authUser && authUser.username || !loading && !authUser){
            //go back to index page
            router.push("/")
        }
    }, [authUser, loading])


    return loading ? 
        (
            // add loading effect soon...
            <div>loading...</div>
        )
        : authUser ?
            authUser.username ?
                (
                    // add loading effect soon...
                    <div>loading...</div>
                )
                : (
                    // if no username -> fill in the form
                    <form onSubmit={e => handleSubmit(e)}>
                        <label>
                            set your username
                            <input type="text" ref={inputRef} onChange={e => handleChange(e)}/>
                        </label>
                        <button type='submit'>submit</button>
                    </form>
                )   
            : (
                // add loading effect soon...
                <div>loading...</div>
            )
}