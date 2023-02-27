import React from 'react'
import Link from 'next/link'
import ToolbarStyles from '../../styles/Toolbar.module.css'
import { useAuth } from '../../hooks/context'
import { useRouter } from 'next/router'

interface Props {
    display: string;
}

export default function Toolbar({ display }: Props) {
    const { signOutGoogle, authUser } = useAuth()
    const router = useRouter()

    async function handleLogOut(){
        await signOutGoogle()

        if (router.pathname === "/"){
            router.reload()
        }
        else {
            router.push("/")
        }
    }

    return (
        <div 
            className={ToolbarStyles.toolbar}
            style={{ display : display}}
        >
            <ul>
                <li>
                    <Link href={`/${authUser?.uniqname}/`}>Profile</Link>
                </li>
                <li>
                    <Link href="/me/stories">Stories</Link>
                </li>
                <li>
                    <Link href="/me/plans">Plans</Link>
                </li>
                <li>
                    <button onClick={handleLogOut}>Sign out</button>
                </li>
            </ul>
        </div>
    )
}