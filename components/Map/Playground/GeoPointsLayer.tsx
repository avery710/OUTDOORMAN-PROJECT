import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"
import L from "leaflet"
import { LatLngExpression } from "leaflet"
import { db } from "lib/firebase"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { geoPointType } from "types"
import { myMarkerOptions } from '../../../lib/leafletMarkerOption'


// geo points layer (control by text-editor)
export default function GeoPointsLayer({ geoPoints, layerGroupRef }: any){

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

            // updateDB(geoJsonData)
        }

    }, [geoPoints, layerGroupRef])


    async function updateDB(geoJsonData: any){

        const geoLayer = {
            "type": "FeatureCollection",
            "features": geoJsonData
        }

        try {
            const docRef = doc(db, "playground", "write")
            await updateDoc(docRef, {
                "geoPointLayer" : JSON.stringify(geoLayer)
            })
        }
        catch(error){
            console.log(error)
        }

    }

    return (null)
}