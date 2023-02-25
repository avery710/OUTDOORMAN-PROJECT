import L from "leaflet"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { FeatureGroup, useMap } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import { db } from '../../lib/firebase'
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"


export default function DrawingToolBar({ geoJsonData, isSavingRef }: any){
    const router = useRouter()
    const { planId } = router.query
    const { authUser } = useAuth()
    const myMap = useMap()
    const FeatureGroupRef = useRef<L.FeatureGroup<any>>(new L.FeatureGroup())


    useEffect(() => {
        if (geoJsonData){
            const layers = L.geoJSON(JSON.parse(geoJsonData))
            FeatureGroupRef.current.addLayer(layers)
            const bounds = layers.getBounds()

            if (bounds.isValid()){
                myMap.fitBounds(bounds)
            }
        }
        else {
            // never edited before
            myMap.locate().on("locationfound", e => {
                L.marker(e.latlng).bindPopup("Current Location").addTo(myMap)
                myMap.flyTo(e.latlng, myMap.getZoom())
            })
        }
    }, [geoJsonData])


    async function handleDraw(e: L.DrawEvents.Created){
        isSavingRef.current.textContent = "Saving"

        const layer = e.layer
        FeatureGroupRef.current.addLayer(layer)
        
        if (authUser && authUser.uid && planId){
            try {
                const docRef = doc(db, "users", authUser.uid, "plans", planId as string)
                await updateDoc(docRef, {
                    "geoJsonData" : JSON.stringify(FeatureGroupRef.current.toGeoJSON())
                })
            }
            catch(error){
                console.log(error)
            }
        }

        setTimeout(() => {
            isSavingRef.current.textContent = "Saved"
        }, 800)
    }


    async function handleUpdate(){    
        isSavingRef.current.textContent = "Saving"

        if (authUser && authUser.uid && planId){
            try {
                const docRef = doc(db, "users", authUser.uid, "plans", planId as string)
                await updateDoc(docRef, {
                    "geoJsonData" : JSON.stringify(FeatureGroupRef.current.toGeoJSON())
                })
            }
            catch(error){
                console.log(error)
            }
        }

        setTimeout(() => {
            isSavingRef.current.textContent = "Saved"
        }, 800)
    }


    return (
        <FeatureGroup ref={FeatureGroupRef}>
            <EditControl 
                position = 'topright' 
                onCreated={e => handleDraw(e)}
                onEdited={() => handleUpdate()}
                onDeleted={() => handleUpdate()}
                draw={{ rectangle: false, circle: false }}
            />
        </FeatureGroup>
    )
}