import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import navStyles from '../../styles/Navbar.module.css'
import Toolbar from './Toolbar'
import OverlayPrompt from '../Prompt/OverlayPrompt'
import { SignInForm, SignUpForm } from './AuthForms'
import { useAuth } from 'hooks/context'
import { db } from '../../lib/firebase'
import { doc, addDoc, collection } from "firebase/firestore"
import { useRouter } from 'next/router'


export default function Navbar() {
    const [ overlayDisplay, setOverlayDisplay ] = useState<string>("none")
    const [ signInForm, setSignInForm ] = useState<boolean>(false)
    const [ toolbarDisplay, setToolbarDisplay ] = useState<string>("none")
    const { authUser } = useAuth()
    const router = useRouter()


    function handleImageClick(){
        toolbarDisplay === "none" ? 
            setToolbarDisplay("block")
            : setToolbarDisplay("none")
    }


    function handleSignIn(){
        setOverlayDisplay("flex")
        setSignInForm(true)
    }


    function handleSignUp(){
        setOverlayDisplay("flex")
        setSignInForm(false)
    }


    // user signed out -> sign in / up button
    // user signed in -> write / plan


    async function handleClick(e: React.MouseEvent<HTMLButtonElement>, action: string){
        e.preventDefault()

        if (authUser && authUser.uid){
            if (action === "plan"){
                // add a new doc for plan in db
                const userDoc = doc(db, "users", authUser.uid)
    
                const planDoc = await addDoc(collection(userDoc, "plans"), {
                    geoJsonData: "",
                    title: "untitled",
                    date: "",
                    ms: 0,
                })
    
                // redirect to new page
                router.push(`/plan/${planDoc.id}`)
    
                return
            }
            else if (action === "write"){
                const userDoc = doc(db, "users", authUser.uid)
    
                const planDoc = await addDoc(collection(userDoc, "stories-edit"), {
                    drawLayer: "",
                    gpxLayer: "",
                    editorContent: null,
                    title: "untitled",
                    date: "",
                    ms: 0,
                })
    
                // redirect to new page
                router.push(`/new-story/${planDoc.id}`)
    
                return
            }
        }
    }


    return (
        <>
            <nav className={navStyles.nav}>
                <ul className={navStyles.leftSection}>
                    <li>
                        <Link href="/">Outdoorman Project</Link>
                    </li>
                    <li>
                        <input type="text" />
                    </li>
                </ul>

                    { authUser ? 
                        (
                            <>
                                <ul className={navStyles.rightSection}>
                                    <li>
                                        <button onClick={e => handleClick(e, "write")}>
                                            Write
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={e => handleClick(e, "plan")}>
                                            Plan
                                        </button>
                                    </li>
                                    <li>
                                        <Image 
                                            src='/profile_pic.png'
                                            alt='profile-pic' 
                                            width={30} 
                                            height={30}
                                            onClick={handleImageClick}
                                        />
                                    </li>
                                </ul>
                            </>
                        )
                        : (
                            <>
                                <ul className={navStyles.rightSection}>
                                    <li>
                                        <button onClick={handleSignIn}>Sign In</button>
                                    </li>
                                    <li>
                                        <button onClick={handleSignUp}>Get Started</button>
                                    </li>
                                </ul>

                                
                            </>
                        )
                    }
            </nav>

            { authUser ? 
                <Toolbar display={toolbarDisplay} />
                :
                <OverlayPrompt 
                    overlayDisplay={overlayDisplay} 
                    setOverlayDisplay={setOverlayDisplay}
                >
                    { signInForm ? 
                        <SignInForm setSignInForm={setSignInForm}/>
                        : <SignUpForm setSignInForm={setSignInForm}/> 
                    }
                </OverlayPrompt>
            }
        </>
    )
}