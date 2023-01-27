import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import { LatLngExpression } from "leaflet"
import L from "leaflet";

export default function MapForPlan() {
    return (
        <MapContainer 
            center={[23.47, 120.96]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%" }}
        >
            <DrawingToolBar />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <LocationMarker />
        </MapContainer>
    )
}

function LocationMarker(){
    const [position, setPosition] = useState<LatLngExpression | null>(null)

    const map = useMap()

    // const currentDot = new L.Icon({
    //     iconUrl: './location.png',
    //     iconSize: new L.Point(38, 40),
    //     iconAnchor: [13, 41],
    //     popupAnchor:  [-3, -76]
    // })

    useEffect(() => {
        map.locate().on("locationfound", e => {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        })
    }, [map])

    return position === null ? null : (
        <Marker position={position}>
            <Popup>
                Hello Avery!
            </Popup>
        </Marker>
    )
}

function DrawingToolBar(){
    const [mapLayers, setMapLayers] = useState([])
    const map = useMap()

    map.on('draw:edited', function (e) {
        console.log(e)
    });

    map.on('draw:created', function (e) {
        console.log(e)
    });

    map.on('draw:deleted', function (e) {
        console.log(e)
    });

    return (
        <FeatureGroup>
            <EditControl 
                position = 'topright' 
                draw={{ rectangle: false, circle: false }}
            />
        </FeatureGroup>
    )
}