import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"
import L from "leaflet"
import { LatLngExpression } from "leaflet"
import { db } from "lib/firebase"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { geoPointArray, wayPointType } from 'types'

// read only gpx layer (control by gpx upload)
export default function GpxLayer({ gpxtracks, gpxWaypoints, EDITOR, layerGroupRef, map, isSavingRef, gpxtrackGeoJson }: any){

    useEffect(() => {
        if (gpxtracks && gpxWaypoints){

            const geoJsonData = []

            // add polyline
            const polyline = L.polyline(gpxtracks, {smoothFactor: 5.0 , weight: 4})
            layerGroupRef.current.addLayer(polyline)

            const lines = {
                "type": "Feature",
                "properties": null,
                "geometry": {
                    "type": "LineString",
                    "coordinates": gpxtrackGeoJson,
                }
            }
            geoJsonData.push(lines)


            // add markers
            gpxWaypoints.forEach((waypoint: wayPointType) => {
                const latlng: LatLngExpression = [waypoint.lat, waypoint.lng]
                const innerHtml = `
                    <h3>${waypoint.descript}</h3>
                    <p>位置：${waypoint.lat}, ${waypoint.lng}</p>
                    <p>高度：${waypoint.elevation}</p>
                `

                const div = document.createElement("div");
                div.innerHTML = innerHtml

                const button = document.createElement("button")
                button.innerHTML = "add to text-editor"

                button.onclick = function() {
                    const mark = EDITOR.schema.marks.GeoLink.create({ lat: waypoint.lat, lng: waypoint.lng })
                    const from = EDITOR.state.selection.from
                    const transaction = EDITOR.state.tr.insertText(waypoint.descript)
                    transaction.addMark(from, from + waypoint.descript.length, mark)
                    EDITOR.view.dispatch(transaction)
                }

                div.appendChild(button)

                const marker = L.marker(latlng).bindPopup(div)
                layerGroupRef.current.addLayer(marker)

                const point = {
                    "type": "Feature",
                    "properties": {
                        "descript": waypoint.descript,
                        "lat": waypoint.lat,
                        "lng": waypoint.lng,
                        "elevation": waypoint.elevation,
                    },
                    "geometry": {
                        "type": "Point",
                        "coordinates": [waypoint.lng, waypoint.lat]
                    }
                }
                geoJsonData.push(point)
                
            })
            
            map.fitBounds(polyline.getBounds())


            // update to db
            updateDB(geoJsonData)

        }
    }, [gpxtracks, gpxWaypoints])


    async function updateDB(geoJsonData: any){
        isSavingRef.current.textContent = "Saving"

        const geoLayer = {
            "type": "FeatureCollection",
            "features": geoJsonData
        }

        try {
            const docRef = doc(db, "playground", "write")
            await updateDoc(docRef, {
                "gpxLayer" : JSON.stringify(geoLayer)
            })
            console.log("gpx added!")
        }
        catch(error){
            console.log(error)
        }

        setTimeout(() => {
            isSavingRef.current.textContent = "Saved"
        }, 800)
    }

    return (null)
}