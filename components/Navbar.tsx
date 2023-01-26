import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import navStyles from '../styles/Navbar.module.css'
import Toolbar from './Toolbar'

export default function Navbar() {
    const [toolbarDisplay, setToolbarDisplay] = useState<string>("none")

    function handleImageClick(){
        if (toolbarDisplay === "none"){
            setToolbarDisplay("block")
        }
        else {
            setToolbarDisplay("none")
        }
    }

    return (
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

            <Toolbar display={toolbarDisplay} />
        </nav>
    )
}
