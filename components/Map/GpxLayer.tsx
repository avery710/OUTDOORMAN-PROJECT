import { Editor } from "@tiptap/react"
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"
import L from "leaflet"
import { LatLngExpression } from "leaflet"
import { db } from "lib/firebase"
import { myMarkerOptions } from "lib/leafletMarkerOption"
import { useRouter } from "next/router"
import { MutableRefObject, RefObject, useEffect } from "react"
import { wayPointArray, wayPointType } from 'types'


interface Props {
    gpxtracks: LatLngExpression[] | null, 
    gpxWaypoints: wayPointArray | null, 
    EDITOR: Editor | null, 
    layerGroupRef: MutableRefObject<L.LayerGroup<any>>, 
    map: L.Map, 
    isSavingRef: RefObject<HTMLLIElement>, 
    gpxtrackGeoJson: LatLngExpression[] | null,
}


// read only gpx layer (control by gpx upload)
export default function GpxLayer({ 
    gpxtracks, 
    gpxWaypoints, 
    EDITOR, 
    layerGroupRef, 
    map, 
    isSavingRef, 
    gpxtrackGeoJson }: Props){

    const router = useRouter()
    const { storyId } = router.query
    const { authUser } = useAuth()


    useEffect(() => {
        if (gpxtracks && gpxWaypoints){

            const geoJsonData = []

            // add polyline
            const polyline = L.polyline(gpxtracks, { smoothFactor: 5.0 , weight: 4, color: '#ffff00', opacity: 0.7 })
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
                button.className = "addTextButton"
                button.innerHTML = "Add to text-editor"

                button.onclick = function() {
                    if (EDITOR){
                        const mark = EDITOR.schema.marks.GeoLink.create({ lat: waypoint.lat, lng: waypoint.lng })
                        const from = EDITOR.state.selection.from
                        const transaction = EDITOR.state.tr.insertText(waypoint.descript)
                        transaction.addMark(from, from + waypoint.descript.length, mark)
                        EDITOR.view.dispatch(transaction)
                    }
                }

                div.appendChild(button)

                const marker = L.marker(latlng, myMarkerOptions).bindPopup(div)
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

        if (isSavingRef.current){
            isSavingRef.current.textContent = "Saving"
        }
        
        const geoLayer = {
            "type": "FeatureCollection",
            "features": geoJsonData
        }

        if (authUser && authUser.uid && storyId){
            try {
                const docRef = doc(db, "users", authUser.uid, "stories-edit", storyId as string)
                await updateDoc(docRef, {
                    "gpxLayer" : JSON.stringify(geoLayer)
                })
            }
            catch(error){
                console.log(error)
            }
        }

        setTimeout(() => {
            if (isSavingRef.current){
                isSavingRef.current.textContent = "Saved"
            }
        }, 800)
    }

    return (null)
}