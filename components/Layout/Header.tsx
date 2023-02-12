import React from 'react'
import HeaderStyle from '../../styles/Header.module.css'

interface Props {
    title: string
}

export default function Header({title}: Props) {
    return (
        <div className={HeaderStyle.headerContainer}>
            <div className={HeaderStyle.title}>{title}</div>
        </div>
    )
}