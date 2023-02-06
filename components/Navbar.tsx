import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import navStyles from '../styles/Navbar.module.css'
import Toolbar from './Toolbar'
import { provider } from '../lib/firebase'
import { getAuth, signInWithRedirect } from "firebase/auth";
import OverlayPrompt from './OverlayPrompt'
import { SignInForm, SignUpForm } from './AuthForms'

export default function Navbar() {
    const [ overlayDisplay, setOverlayDisplay ] = useState<string>("none")
    const [ signInForm, setSignInForm ] = useState<boolean>(false)


    const [toolbarDisplay, setToolbarDisplay] = useState<string>("none")

    function handleImageClick(){
        if (toolbarDisplay === "none"){
            setToolbarDisplay("block")
        }
        else {
            setToolbarDisplay("none")
        }
    }

    const user = null
    const username = null
    // user signed out -> sign in / up button
    // user signed in -> write / plan

    function handleSignIn(){
        setOverlayDisplay("flex")
        setSignInForm(true)
    }

    function handleSignUp(){
        setOverlayDisplay("flex")
        setSignInForm(false)
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

                <ul className={navStyles.rightSection}>
                    <li>
                        <button onClick={handleSignIn}>Sign In</button>
                    </li>
                    <li>
                        <button onClick={handleSignUp}>Get Started</button>
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

                <Toolbar display={toolbarDisplay} />
            </nav>

            <OverlayPrompt 
                overlayDisplay={overlayDisplay} 
                setOverlayDisplay={setOverlayDisplay}
            >
                { signInForm ? 
                    <SignInForm setSignInForm={setSignInForm}/>
                    : <SignUpForm setSignInForm={setSignInForm}/> 
                }
            </OverlayPrompt>
        </>
    )
}