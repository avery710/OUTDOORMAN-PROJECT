import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
// import navStyles from '../../styles/Navbar.module.css'
import Toolbar from './Toolbar'
import OverlayPrompt from '../Prompt/OverlayPrompt'
import { SignInForm, SignUpForm } from './AuthForms'
import { useAuth } from 'hooks/context'
import { db } from '../../lib/firebase'
import { doc, addDoc, collection } from "firebase/firestore"
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Logo from './Logo'


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


    // user signed out -> write-playground / plan-playground / get-started
    // user signed in -> write / plan / profile


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
                    geoPointLayer: "",
                    editorContent: null,
                    editorTextContent: "",
                    title: "",
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
            <NavbarWrapper>
                <NavBar>                
                    <Ul>
                        <Li>
                            <Link href="/">
                                <Logo/>
                            </Link>
                        </Li>
                    </Ul>

                    { authUser ? 
                        (
                            <>
                                <Ul>
                                    <Li>
                                        <WriteButton onClick={e => handleClick(e, "write")}>
                                            <WriteIcon/>Write
                                        </WriteButton>
                                    </Li>
                                    <Li>
                                        <PlanButton onClick={e => handleClick(e, "plan")}>
                                            <PlanIcon/>Plan
                                        </PlanButton>
                                    </Li>
                                    <Li>
                                        <ProfileWrapper>
                                            <Image 
                                                src='/profile_pic.png'
                                                alt='profile-pic' 
                                                fill
                                                style={{objectFit: "cover", objectPosition: "center"}}
                                                onClick={handleImageClick}
                                            />
                                        </ProfileWrapper>
                                        
                                    </Li>
                                </Ul>
                            </>
                        )
                        : (
                            <>
                                <Ul>
                                    <Li>
                                        <Playground>
                                            <Link href={'/new-story/playground'}>
                                                Write
                                            </Link>
                                        </Playground>
                                        
                                    </Li>
                                    <Li>
                                        <Playground>
                                            <Link href={'/plan/playground'} style={{fontSize: "14px", marginRight: "10px"}}>
                                                Plan
                                            </Link>
                                        </Playground>
                                    </Li>
                                    <Li>
                                        <GetStarted onClick={handleSignUp}>
                                            Get Started
                                        </GetStarted>
                                    </Li>
                                </Ul> 
                            </>
                        )
                    }
                </NavBar>
            </NavbarWrapper>

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

const NavbarWrapper = styled.nav`
    height: 65px;
    padding: 10px;
    background-color: rgb(0, 0, 0);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 50;
    width: 100vw;
`

const NavBar = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1400px;
    width: 95%;
`

const Ul = styled.ul`
    display: flex;
    justify-content: center;
    align-items: center;
    list-style: none;
    padding-inline-start: 0;
`

const Li = styled.li`
    margin: 5px 6px;
    cursor: pointer;
`

const Playground = styled.div`
    font-size: 14px;
    margin-right: 14px;
    opacity: 0.9;
    width: fit-content;

    &:hover {
        opacity: 1;
        transition: all .1s ease-in-out;
    }
`

const GetStarted = styled.button`
    border: none;
    background-color: #80ff80;
    color: black;
    width: 100px;
    height: 36px;
    border-radius: 18px;
    font-weight: 400;
    font-size: 14px;
    cursor: pointer;
    font-family: 'Montserrat';
    opacity: 0.9;

    &:hover {
        opacity: 1;
        transition: all .1s ease-in-out;
    }
`

const WriteButton = styled.button`
    border: none;
    background-color: transparent;
    color: white;
    font-size: 14px;
    font-family: 'Montserrat';
    cursor: pointer;
    width: fit-content;
    height: 36px;
    display: flex;
    align-items: center;
    margin-right: 6px;
    opacity: 0.85;

    &:hover {
        opacity: 1;
        transition: all .1s ease-in-out;
    }
`

const PlanButton = styled.button`
    border: none;
    background-color: transparent;
    color: white;
    font-size: 14px;
    font-family: 'Montserrat';
    cursor: pointer;
    width: fit-content;
    height: 36px;
    display: flex;
    align-items: center;
    margin-right: 6px;
    opacity: 0.85;

    &:hover {
        opacity: 1;
        transition: all .1s ease-in-out;
    }
`

const WriteIcon = styled.i`
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
    height: 18px;
    width: 18px;
    margin-right: 6px;
    background-image: url(/images/icons/papers.svg);
`

const PlanIcon = styled.i`
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
    height: 16px;
    width: 16px;
    margin-right: 6px;
    background-image: url(/images/icons/plan-flower.svg);
`



const ProfileWrapper = styled.div`
    width: 30px;
    height: 30px;
    position: relative;
    margin-left: 10px;
`