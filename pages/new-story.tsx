import React from 'react'
import styles from '../styles/newStory.module.css'
import dynamic from 'next/dynamic'
import Editor from '../components/Editor/Editor'

type Props = {}

export default function NewStory({}: Props) {
    const BasicMap = dynamic(
        () => import('../components/Map/BasicMap'), 
        { 
            ssr: false 
        }
    )

    return (
        <div className={styles.container}>
            <div className={styles.map}>
                <BasicMap />
            </div>
            <div className={styles.editor} id="editor">
                <Editor />
            </div>
        </div>
    )
}
