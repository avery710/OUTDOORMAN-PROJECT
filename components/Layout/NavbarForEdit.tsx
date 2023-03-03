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


export default function NavbarForEdit({ title, isSavingRef, children }: any){
    
    const router = useRouter()
    const { authUser } = useAuth()
    const [ toolbarDisplay, setToolbarDisplay ] = useState<string>("none")
    const titleRef = useRef<HTMLInputElement>(null)


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
        toolbarDisplay === "none" ? 
            setToolbarDisplay("block")
            : setToolbarDisplay("none")
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
                        <TitleInput type="text" ref={titleRef} onChange={e => handleTitleChange(e)} maxLength={15}/>
                    </Li>
                </Ul>

                <Ul>
                    <Li ref={isSavingRef} style={{fontSize: "14px", fontWeight: "500", cursor: "default"}}></Li>
                    {children}
                    {authUser && 
                        <Li>
                            <ProfileWrapper>
                                <Image 
                                    src='/profile_pic.png'
                                    alt='profile-pic' 
                                    width={30} 
                                    height={30}
                                    onClick={toggleToolbar}
                                />
                            </ProfileWrapper>
                        </Li>
                    }
                </Ul>
                </NavBar>
            </NavbarWrapper>

            <Toolbar display={toolbarDisplay} />
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

const TitleInput = styled.input`
    background-color: black;
    color: white;
    border: none;
    opacity: 1;
    font-size: 14px;
    font-weight: 500;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    height: 26px;
    width: 160px;
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
`