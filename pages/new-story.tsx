import { useEffect, useState } from 'react'
import styles from '../styles/newStory.module.css'
import dynamic from 'next/dynamic'
import Editor from '../components/Editor/Editor'
import { geoPointArray } from 'types'
import TiptapEditor from 'components/TiptapEditor/TiptapEditor'
import L, { LatLngExpression } from "leaflet"
// import MapForWrite from '../components/Map/MapForWrite'


export default function NewStory() {
    const [geoPoints, setGeoPoints] = useState<geoPointArray | null>(null)
    const [location, setLocation] = useState<LatLngExpression | null>(null)

    const MapForWrite = dynamic(
        () => import('../components/Map/MapForWrite'), 
        { 
            ssr: false 
        }
    )

    return (
        <div className={styles.container}>
            <div className={styles.map}>
                {/* <BasicMap geoPointData={geoPoints}/> */}
                <MapForWrite location={location} geoPoints={geoPoints}/>
            </div>
            <div className={styles.editor} id="editor">
                {/* <Editor {...geoPointControl}/> */}
                <TiptapEditor geoPoints={geoPoints} setGeoPoints={setGeoPoints} setLocation={setLocation}/>
            </div>
        </div>
    )
}
