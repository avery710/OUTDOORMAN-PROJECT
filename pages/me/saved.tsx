import React from 'react'
import Header from '../../components/Layout/Header'
import profileStyle from '../../styles/profile.module.css'

type Props = {}

export default function saved({}: Props) {
    return (
        <div className={profileStyle.container}>
            <Header title='Your Lists' />
        </div>
    )
}