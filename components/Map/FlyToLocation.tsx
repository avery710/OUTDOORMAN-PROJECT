import { useEffect } from "react"

export default function FlyToLocation({ location, map }: any){
    
    useEffect(() => {
        if (location){
            map.flyTo(location, map.getZoom())
        }
    }, [location])

    return (null)
}