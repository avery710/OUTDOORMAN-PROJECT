import { MapContainer } from 'react-leaflet'
import BaseLayer from './BaseLayer'
import DrawingToolBar from './DrawToolForPlan'
import { useEffect, useState } from 'react'

export default function MapForPlan({ geoJsonData, isSavingRef }: any){
    const [map, setMap] = useState<L.Map | null>(null)

    useEffect(() => {
        console.log("map ref -> ", map)
    }, [map])

    return (
        <MapContainer 
            center={[23.46999192, 120.9572655]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%" }}
            ref={setMap}
        >
            <BaseLayer />
            <DrawingToolBar geoJsonData={geoJsonData} isSavingRef={isSavingRef}/>
        </MapContainer>
    )
}