import * as L from "leaflet"
import { useRouter } from "next/router"
import { useEffect, useRef } from "react"
import { FeatureGroup, useMap } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import { db } from '../../lib/firebase'
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"


export default function DrawingToolBar({ drawLayerRef, isSavingRef }: any){
    
    const router = useRouter()
    const { storyId } = router.query
    const { authUser } = useAuth()


    async function handleDraw(e: L.DrawEvents.Created){

        isSavingRef.current.textContent = "Saving in story draft..."

        const layer = e.layer
        drawLayerRef.current.addLayer(layer)
        
        if (authUser && authUser.uid && storyId){
            try {
                const docRef = doc(db, "users", authUser.uid, "stories-edit", storyId as string)
                await updateDoc(docRef, {
                    "drawLayer" : JSON.stringify(drawLayerRef.current.toGeoJSON())
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
        isSavingRef.current.textContent = "Saving in story draft..."

        if (authUser && authUser.uid && storyId){
            try {
                const docRef = doc(db, "users", authUser.uid, "stories-edit", storyId as string)
                await updateDoc(docRef, {
                    "drawLayer" : JSON.stringify(drawLayerRef.current.toGeoJSON())
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
        <FeatureGroup ref={drawLayerRef}>
            <EditControl 
                position = 'topleft' 
                onCreated={e => handleDraw(e)}
                onEdited={() => handleUpdate()}
                onDeleted={() => handleUpdate()}
                draw={{ rectangle: false, circle: false, marker: false, circlemarker: false }}
            />
        </FeatureGroup> 
    )
}