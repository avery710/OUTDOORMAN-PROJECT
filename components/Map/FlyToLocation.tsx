import { useEffect } from "react"

export default function FlyToLocation({ location, map }: any){
    
    useEffect(() => {
        if (location && map){
            map.flyTo(location, map.getZoom())
        }
    }, [location, map])

    return (null)
}