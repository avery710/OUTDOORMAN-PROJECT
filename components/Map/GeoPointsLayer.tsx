import L from "leaflet"
import { LatLngExpression } from "leaflet"
import { useEffect } from "react"
import { geoPointType } from "types"


// geo points layer (control by text-editor)
export default function GeoPointsLayer({ geoPoints, layerGroupRef }: any){

    useEffect(() => {
        if (geoPoints){
            layerGroupRef.current.clearLayers()

            geoPoints.forEach((geoPoint: geoPointType) => {
                const latlng: LatLngExpression = [geoPoint.lat, geoPoint.lng]
                const descrip = `
                    <h3>${geoPoint.descript}</h3>
                    <p>位置：${geoPoint.lat}, ${geoPoint.lng}</p>
                `

                const marker = L.marker(latlng).bindPopup(descrip)
                layerGroupRef.current.addLayer(marker) 
            })
        }

    }, [geoPoints, layerGroupRef])

    return (null)
}