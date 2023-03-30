import Link from "next/link"
import Image from 'next/image'
import { ChangeEvent, useEffect, useRef, useState } from "react"
import navStyles from '../../styles/Navbar.module.css'
import Toolbar from './Toolbar'
import { db } from '../../lib/firebase'
import { doc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import { useAuth } from "hooks/context"
import styled from "styled-components"
import Logo from "./Logo"
import { SignInForm, SignUpForm } from "../Common/Form/AuthForms"
import OverlayPrompt from "components/Common/OverlayPrompt/OverlayPrompt"


export default function NavbarForEdit({ title, isSavingRef, children }: any){
    
    const router = useRouter()
    const { authUser } = useAuth()
    const titleRef = useRef<HTMLInputElement>(null)
    const [ toolbarVisibility, setToolbarVisibility ] = useState<string>("hidden")
    const [ overlayDisplay, setOverlayDisplay ] = useState<string>("none")
    const [ signInForm, setSignInForm ] = useState<boolean>(false)
    const toolbarRef = useRef<HTMLDivElement>(null)


    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (!toolbarRef.current?.contains(e.target as Node)){
                setToolbarVisibility("hidden")
            }
        })
    }, [])


    // fetch the original title and show on navbar
    useEffect(() => {
        if (titleRef.current){
            titleRef.current.value = title
        }
    }, [title])

    
    async function handleTitleChange(e: ChangeEvent<HTMLInputElement>){
        if (router.pathname === "/new-story/[storyId]"){
            const { storyId } = router.query

            if (authUser && authUser.uid && storyId){
                const docRef = doc(db, "users", authUser.uid, "stories-edit", storyId as string)
                await updateDoc(docRef, {
                    "title": e.target.value
                })
            }  
        }
        else if (router.pathname === "/plan/[planId]"){
            const { planId } = router.query

            if (authUser && authUser.uid && planId){
                const docRef = doc(db, "users", authUser.uid, "plans", planId as string)
                await updateDoc(docRef, {
                    "title": e.target.value
                })
            }  
        }
    }


    function toggleToolbar(){
        toolbarVisibility === "hidden" ? 
            setToolbarVisibility("visible")
            : setToolbarVisibility("hidden")
    }

    function handleSignUp(){
        setOverlayDisplay("flex")
        setSignInForm(false)
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
                    <Li>
                        <TitleInput type="text" ref={titleRef} onChange={e => handleTitleChange(e)} maxLength={24}/>
                    </Li>
                </Ul>

                <Ul>
                    <Li ref={isSavingRef} style={{fontSize: "14px", fontWeight: "500", cursor: "default"}}></Li>
                    { children }
                    { authUser ?
                        <Li>
                            <ProfileWrapper ref={toolbarRef}>
                                { authUser.photoUrl && 
                                    <Image 
                                        src={authUser.photoUrl}
                                        alt='profile-pic' 
                                        fill
                                        style={{objectFit: "cover", objectPosition: "center"}}
                                        onClick={toggleToolbar}
                                    />
                                }
                            </ProfileWrapper>
                        </Li>
                        :
                        <Li>
                            <GetStarted onClick={handleSignUp}>
                                Get Started
                            </GetStarted>
                        </Li>
                    }
                </Ul>
                </NavBar>
            </NavbarWrapper>

            { authUser ? 
                <Toolbar 
                    visibility={toolbarVisibility} 
                    setToolbarVisibility={setToolbarVisibility} 
                />
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

const TitleInput = styled.input`
    background-color: black;
    color: white;
    border: none;
    opacity: 1;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    height: 26px;
    width: 200px;
    margin-left: 30px;

    &:hover {
        opacity: 0.9;
        border-bottom: 1px solid white;
        transition: all .1s ease-in-out;
    }

    &:focus {
        opacity: 1;
        border-bottom: 1px solid white;
        outline: none;
        transition: all .1s ease-in-out;
    }
`

const ProfileWrapper = styled.div`
    width: 30px;
    height: 30px;
    position: relative;
    margin-left: 10px;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
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