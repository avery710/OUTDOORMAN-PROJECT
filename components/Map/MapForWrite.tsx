import { useRef, useEffect, useState, Dispatch, SetStateAction, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup, LayersControl, GeoJSON, Polyline, LayerGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import { LatLngExpression } from "leaflet"
import L from "leaflet"
import { Feature, Point, Geometry } from 'geojson'
import { db } from '../../lib/firebase'
import { doc, setDoc, getDoc } from "firebase/firestore"; 
import { geoPointType, wayPointType, insertContentType } from 'types'
import BaseLayer from './BaseLayer'
import DrawingToolBar from './DrawingToolbar'
import GpxLayer from './GpxLayer'


export default function MapForWrite({ 
    geoJsonData,
    isSavingRef,
    location, 
    geoPoints, 
    gpxtracks, 
    gpxWaypoints, 
    EDITOR }: any){

    const [map, setMap] = useState<L.Map | null>(null)
    const layerGroupRef = useRef<L.LayerGroup<any>>(new L.LayerGroup())

    useEffect(() => {
        console.log("map -> ", map)
    }, [map])

    // const mapForWrite = useMemo(() => {
    //     return (
    //         <MapContainer 
    //             center={[23.46999192, 120.9572655]} 
    //             zoom={13} 
    //             scrollWheelZoom={true} 
    //             style={{ height: "100%", width: "100%" }}
    //             ref={setMap}
    //         >
    //             <BaseLayer />
    //             <DrawingToolBar geoJsonData={geoJsonData} isSavingRef={isSavingRef}/>
    //             <LayerGroup ref={layerGroupRef}/>
    //         </MapContainer>
    //     )
    // }, [geoJsonData, isSavingRef])


    const mapForWrite = useMemo(() => {
        return (
            <MapContainer 
                center={[23.46999192, 120.9572655]} 
                zoom={13} 
                scrollWheelZoom={true} 
                style={{ height: "100%", width: "100%" }}
                ref={setMap}
            >
                <BaseLayer />
                <LayerGroup ref={layerGroupRef}/>
            </MapContainer>
        )
    }, [])


    return (
        <>
            {/* {map ? 
                <GpxLayer 
                    gpxtracks={gpxtracks} 
                    gpxWaypoints={gpxWaypoints}
                    EDITOR={EDITOR}
                    layerGroupRef={layerGroupRef}
                    map={map}
                />
                : 
                null
            } */}
            {mapForWrite}
        </>
    )
}



// function SetViewCenter({ setCurrView, currView }: any){
//     const map = useMap()

//     useEffect(() => {
//         map.on("moveend", () => {
//             setCurrView(map.getCenter())
//         })
//     }, [])
//     return (null)
// }