import { MapContainer } from 'react-leaflet'
import BaseLayer from '../BaseLayerWithoutData'
import DrawingToolbar from './DrawToolForPlan'

export default function PlaygroundPlan({ geoJsonData, isSavingRef, mountains }: any){

    return (
        <MapContainer 
            center={[23.46999192, 120.9572655]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%" }}
        >
            <BaseLayer mountains={mountains} />
            <DrawingToolbar geoJsonData={geoJsonData} isSavingRef={isSavingRef} />
        </MapContainer>
    )
}