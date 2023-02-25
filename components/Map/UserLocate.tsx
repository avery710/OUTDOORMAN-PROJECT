import L from "leaflet"
import { useEffect, useState } from "react"
import { useMap } from "react-leaflet"

export default function UserLocate(){
    const map = useMap()

    useEffect(() => {
        if (map){
            map.locate().on("locationfound", e => {
                const marker = L.marker(e.latlng).bindPopup("Your Current Location!").addTo(map)
                marker.openPopup()
                map.flyTo(e.latlng, map.getZoom())
            })
        }
    }, [map])

    return (null)
}