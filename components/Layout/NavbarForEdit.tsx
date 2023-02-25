import Link from "next/link"
import Image from 'next/image'
import { ChangeEvent, useEffect, useRef, useState } from "react"
import navStyles from '../../styles/Navbar.module.css'
import Toolbar from './Toolbar'
import { db } from '../../lib/firebase'
import { doc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/router"
import { useAuth } from "hooks/context"


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
            <nav className={navStyles.nav} style={{paddingLeft: "40px", paddingRight: "40px"}}>
                <ul className={navStyles.leftSection}>
                    <li>
                        <Link href="/">Logo</Link>
                    </li>
                    <li>
                        <input type="text" ref={titleRef} onChange={e => handleTitleChange(e)} className={navStyles.titleInput}/>
                    </li>
                </ul>

                <ul className={navStyles.rightSection}>
                    <li ref={isSavingRef}></li>
                    {children}
                    <li>
                        <Image 
                            src='/profile_pic.png'
                            alt='profile-pic' 
                            width={30} 
                            height={30}
                            onClick={toggleToolbar}
                        />
                    </li>
                </ul>
            </nav>

            <Toolbar display={toolbarDisplay} />
        </>
    )
}