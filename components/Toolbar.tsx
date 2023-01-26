import React from 'react'
import Link from 'next/link'
import ToolbarStyles from '../styles/Toolbar.module.css'

interface Props {
    display: string;
}

export default function Toolbar({ display }: Props) {
    return (
        <div 
            className={ToolbarStyles.toolbar}
            style={{ display : display}}
        >
            <ul>
                <li>
                    <Link href="/[username]/" as='/avery/'>Profile</Link>
                </li>
                <li>
                    <Link href="/me/stories">Stories</Link>
                </li>
                <li>
                    <Link href="/me/plans">Plans</Link>
                </li>
                <li>
                    <Link href="/me/saved">Saved</Link>
                </li>
            </ul>
        </div>
    )
}