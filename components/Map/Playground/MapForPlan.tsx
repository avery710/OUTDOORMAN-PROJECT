import L from 'leaflet'
import { Key, useEffect, useRef, useState } from 'react'
import { MapContainer } from 'react-leaflet'
import BaseLayer from '../BaseLayerWithoutData'
import DrawingToolbar from './DrawToolForPlan'

export default function PlaygroundPlan({ geoJsonData, isSavingRef, mountains }: any){

    const [ key, setKey ] = useState<Key | null>("none")
    const [ layers, setLayers ] = useState<any>(null)
    const FeatureGroupRef = useRef<L.FeatureGroup<any>>(new L.FeatureGroup())

    useEffect(() => {
        if (layers){
            setKey("added")
            FeatureGroupRef.current.addLayer(layers)
        }
    }, [layers])
    
    return (
        <MapContainer 
            center={[23.46999192, 120.9572655]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%" }}
            attributionControl={false}
            key={key}
        >
            <BaseLayer mountains={mountains} />
            <DrawingToolbar 
                geoJsonData={geoJsonData} 
                isSavingRef={isSavingRef} 
                setLayers={setLayers} 
                FeatureGroupRef={FeatureGroupRef}
            />
        </MapContainer>
    )
}