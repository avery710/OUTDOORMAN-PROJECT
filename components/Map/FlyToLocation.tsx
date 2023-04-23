import { LatLngExpression } from "leaflet"
import { useEffect } from "react"
import * as L from "leaflet"

interface Props {
    location: LatLngExpression | null, 
    map: L.Map,
}

export default function FlyToLocation({ location, map }: Props){
    
    useEffect(() => {
        if (location && map){
            map.flyTo(location, map.getZoom())
        }
    }, [location, map])

    return (null)
}