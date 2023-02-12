import React from 'react'
import Header from '../../components/Layout/Header'
import profileStyle from '../../styles/profile.module.css'
import Link from 'next/link'
import { db } from '../../lib/firebase'
import { collection, getDocs } from "firebase/firestore";

type Props = {}

export default function plans({}: Props) {
    return (
        <>
            <div className={profileStyle.container}>
                <Header title='Your Plans' />
                {
                    
                }
                <Link href="/[username]/plans/[plans-title]" as="/avery/plans/test">test</Link>
            </div>
        </>

    )
}