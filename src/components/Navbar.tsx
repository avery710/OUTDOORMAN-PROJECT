import Link from 'next/link'
import React from 'react'

export default function Navbar() {
    const user = null
    const username = "avery"

    return (
        <nav className='navbar'>
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo">Index</button>
                    </Link>
                </li>

                {username && (
                    <>
                        <li>
                            <Link href="/admin">
                                <button className="btn-blue">Write Posts</button>
                            </Link>
                        </li>

                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL} />
                                {/* <button>user photo</button> */}
                            </Link>
                        </li>
                    </>
                )}

                {!username && (
                    <li>
                        <Link href="/enter">
                            <button className="btn-blue">Log in</button>
                        </Link>
                    </li>
                )}
            </ul>
        </nav>
    )
}
