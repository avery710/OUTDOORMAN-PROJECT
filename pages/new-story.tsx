import { useState } from 'react'
import styles from '../styles/newStory.module.css'
import dynamic from 'next/dynamic'
import Editor from '../components/Editor/Editor'
import { geoPointType } from 'types'


export default function NewStory() {
    const [geoPointData, setGeoPointData] = useState<geoPointType | null>(null)
    const geoPointControl = {
        geoPointData: geoPointData, 
        setGeoPointData: setGeoPointData,
    }

    const BasicMap = dynamic(
        () => import('../components/Map/BasicMap'), 
        { 
            ssr: false 
        }
    )

    return (
        <div className={styles.container}>
            <div className={styles.map}>
                <BasicMap geoPointData={geoPointData}/>
            </div>
            <div className={styles.editor} id="editor">
                <Editor {...geoPointControl}/>
            </div>
        </div>
    )
}
