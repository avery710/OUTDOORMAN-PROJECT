import React from 'react'
import Header from '../../components/Layout/Header'
import profileStyle from '../../styles/profile.module.css'

type Props = {}

export default function UserPage({}: Props) {
    return (
        <div className={profileStyle.container}>
            <Header title='Avery Lin' />
        </div>
    )
}