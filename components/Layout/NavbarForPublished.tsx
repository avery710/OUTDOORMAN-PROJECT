import Link from 'next/link'
import Image from 'next/image'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import Toolbar from './Toolbar'
import { useAuth } from 'hooks/context'
import { db } from '../../lib/firebase'
import { doc, addDoc, collection } from "firebase/firestore"
import { useRouter } from 'next/router'
import styled from 'styled-components'
import Logo from './Logo'

interface Props {
    setOverlayDisplay: Dispatch<SetStateAction<string>>, 
    setSignInForm: Dispatch<SetStateAction<boolean>>,
}


export default function Navbar({ setOverlayDisplay, setSignInForm }: Props){

    const { authUser } = useAuth()
    const router = useRouter()
    const [ toolbarVisibility, setToolbarVisibility ] = useState<string>("hidden")
    const toolbarRef = useRef<HTMLDivElement>(null)


    function toggleToolbar(){
        toolbarVisibility === "hidden" ? 
            setToolbarVisibility("visible")
            : setToolbarVisibility("hidden")
    }


    function handleSignUp(){
        setOverlayDisplay("flex")
        setSignInForm(false)
    }
    

    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (!toolbarRef.current?.contains(e.target as Node)){
                setToolbarVisibility("hidden")
            }
        })
    }, [])


    async function handleClick(e: React.MouseEvent<HTMLButtonElement>, action: string){
        e.preventDefault()

        if (authUser && authUser.uid){

            if (action === "plan"){
                // add a new doc for plan in db
                const userDoc = doc(db, "users", authUser.uid)
    
                const planDoc = await addDoc(collection(userDoc, "plans"), {
                    geoJsonData: "",
                    title: "Untitled",
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
                    title: "Untitled",
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
                                    <LoginLi>
                                        <WriteButton onClick={e => handleClick(e, "write")}>
                                            <WriteIcon/>Write
                                        </WriteButton>
                                    </LoginLi>
                                    <LoginLi>
                                        <PlanButton onClick={e => handleClick(e, "plan")}>
                                            <PlanIcon/>Plan
                                        </PlanButton>
                                    </LoginLi>
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
                                </Ul>
                                <Toolbar visibility={toolbarVisibility} />
                            </>
                        )
                        : (
                            <>
                                <Ul>
                                    <PlaygroundLi>
                                        <Playground>
                                            <Link href={'/new-story/playground'} style={{display: "flex", alignItems:" center"}}>
                                                <WriteIcon/>Write
                                            </Link>
                                        </Playground>
                                        
                                    </PlaygroundLi>
                                    <PlaygroundLi>
                                        <Playground>
                                            <Link href={'/plan/playground'} style={{display: "flex", alignItems:" center"}}>
                                                <PlanIcon/>Plan
                                            </Link>
                                        </Playground>
                                    </PlaygroundLi>
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

    @media (min-width: 800px) and (max-width: 2000px) {
        display: inline-block;
    }
`

const PlaygroundLi = styled(Li)`
    @media (min-width: 300px) and (max-width: 800px) {
        display: none;
    }
`

const LoginLi = styled(Li)`
    @media (min-width: 300px) and (max-width: 800px) {
        display: none;
    }
`

const Playground = styled.div`
    font-size: 14px;
    margin-right: 14px;
    opacity: 0.9;
    width: fit-content;
    margin-right: 16px;

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
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.1);
    border-radius: 15px;
`