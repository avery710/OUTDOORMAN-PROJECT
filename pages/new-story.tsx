import { useEffect, useState } from 'react'
import styles from '../styles/newStory.module.css'
import dynamic from 'next/dynamic'
import { geoPointArray } from 'types'
import TiptapEditor from 'components/TiptapEditor/TiptapEditor'
import L, { LatLngExpression } from "leaflet"
import OverlayPrompt from 'components/Layout/OverlayPrompt'
import GpxForm from '../components/Prompt/GpxForm'
import { wayPointArray } from 'types'


export default function NewStory() {
    const [geoPoints, setGeoPoints] = useState<geoPointArray | null>(null)
    const [location, setLocation] = useState<LatLngExpression | null>(null)
    const [gpxOverlay, setGpxOverlay] = useState<string>("none")
    const [gpxtracks, setGpxTracks] = useState<Array<LatLngExpression> | null>(null)
    const [gpxWaypoints, setGpxWaypoints] = useState<wayPointArray | null>(null)

    function handleClickGPX(){
        setGpxOverlay("flex")
    }

    const MapForWrite = dynamic(
        () => import('../components/Map/MapForWrite'), 
        { ssr: false }
    )

    return (
        <div className={styles.container}>
            <div className={styles.map}>
                <MapForWrite location={location} geoPoints={geoPoints} gpxtracks={gpxtracks} gpxWaypoints={gpxWaypoints}/>
            </div>
            <button className={styles.gpx} onClick={handleClickGPX}>
                GPX
            </button>
        
            <div className={styles.editor}>
                <TiptapEditor geoPoints={geoPoints} setGeoPoints={setGeoPoints} setLocation={setLocation}/>
            </div>

            <OverlayPrompt overlayDisplay={gpxOverlay} setOverlayDisplay={setGpxOverlay}>
                <GpxForm setOverlayDisplay={setGpxOverlay} setGpxTracks={setGpxTracks} setGpxWaypoints={setGpxWaypoints}/>
            </OverlayPrompt>
        </div>
    )
}
