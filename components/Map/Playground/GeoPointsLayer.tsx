import L from "leaflet"
import { LatLngExpression } from "leaflet"
import { MutableRefObject, useEffect } from "react"
import { geoPointArray, geoPointType } from "types"
import { myMarkerOptions } from '../../../lib/leafletMarkerOption'


interface Props {
    geoPoints: geoPointArray | null, 
    layerGroupRef: MutableRefObject<L.LayerGroup<any>>,
}


// geo points layer (control by text-editor)
export default function GeoPointsLayer({ geoPoints, layerGroupRef }: Props){

    useEffect(() => {
        if (geoPoints){

            const geoJsonData: any = []

            layerGroupRef.current.clearLayers()

            geoPoints.forEach((geoPoint: geoPointType) => {
                const latlng: LatLngExpression = [geoPoint.lat, geoPoint.lng]
                const descrip = `
                    <h3>${geoPoint.descript}</h3>
                    <p>位置：${geoPoint.lat}, ${geoPoint.lng}</p>
                `

                const marker = L.marker(latlng, myMarkerOptions).bindPopup(descrip)
                layerGroupRef.current.addLayer(marker) 

                const point = {
                    "type": "Feature",
                    "properties": {
                        "descript": geoPoint.descript,
                        "lat": geoPoint.lat,
                        "lng": geoPoint.lng,
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [geoPoint.lng, geoPoint.lat]
                    }
                }
                geoJsonData.push(point)
            })
        }

    }, [geoPoints, layerGroupRef])

    return (null)
}