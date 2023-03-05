import { db } from '../lib/firebase'
import { doc, setDoc, getDoc } from "firebase/firestore"
import React, { useEffect, useRef, useState } from "react"
import { useAuth } from '../hooks/context'
import { useRouter } from 'next/router';
import styled from 'styled-components';

export default function AddUsername() {
    // const [ formVal, setFormVal ] = useState<string>("")
    // const [ isValid, setIsValid ] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement | null>(null)
    const { authUser, loading } = useAuth()
    const router = useRouter()

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()

        // save all user info to db and redirect to index page
        if (authUser && authUser.uid && authUser.uniqname){
            
            try {
                await setDoc(doc(db, "users", authUser.uid), {
                    photoUrl: authUser.photoUrl,
                    email: authUser.email,
                    username: inputRef.current?.value,
                    uniqname: authUser.uniqname
                })

                await setDoc(doc(db, "uniqname", authUser.uniqname), {
                    userId: authUser.uid
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
                    <OverlayBackground>
                        <OverlayContainer>
                            <FormWrapper onSubmit={e => handleSubmit(e)}>
                                <h3>set your username</h3>
                                <InputField type="text" ref={inputRef} onChange={e => handleChange(e)} minLength={1}/>
                                <SubmitButton type='submit'>submit</SubmitButton>
                            </FormWrapper>
                        </OverlayContainer>
                        
                    </OverlayBackground>
                    
                )   
            : (
                // add loading effect soon...
                <div>loading...</div>
            )
}

const OverlayBackground = styled.div`
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000; /* Sit on top */
    background-color: rgb(0,0,0); /* Black fallback color */
    background-color: rgba(0,0,0, 0.7); /* Black w/opacity */
    overflow-x: hidden; /* Disable horizontal scroll */

    display: flex;
    justify-content: center;
    align-items: center;
`

const OverlayContainer = styled.div`
    position: relative;
    height: fit-content;
    min-width: 400px;
    width: fit-content;
    padding: 44px 56px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
`

const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const SubmitButton = styled.button`
    border: 1px solid rgb(26, 137, 23);
    background-color: rgb(26, 137, 23);
    font-size: 14px;
    font-weight: 400;
    color: white;
    cursor: pointer;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    border-radius: 15px;
    padding-left: 14px;
    padding-right: 14px;
    margin-top: 30px;
`

const InputField = styled.input`
    width: 300px;
    height: 20px;
    border: none;
    font-size: 14px;
    border-bottom: 1px solid black;
    background-color: white;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    margin-top: 10px;
    text-align: center;

    &:focus {
        outline: none;
    }
`