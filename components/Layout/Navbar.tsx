import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import navStyles from '../../styles/Navbar.module.css'
import Toolbar from './Toolbar'
import OverlayPrompt from './OverlayPrompt'
import { SignInForm, SignUpForm } from './AuthForms'
import { useAuth } from 'hooks/context'


export default function Navbar() {
    const [ overlayDisplay, setOverlayDisplay ] = useState<string>("none")
    const [ signInForm, setSignInForm ] = useState<boolean>(false)
    const [ toolbarDisplay, setToolbarDisplay ] = useState<string>("none")
    const { authUser } = useAuth()

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
                                        <Link href="/new-story">Write</Link>
                                    </li>
                                    <li>
                                        <Link href="/planner">Plan</Link>
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

            <Toolbar display={toolbarDisplay} />

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