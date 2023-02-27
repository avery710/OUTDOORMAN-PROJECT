import * as L from "leaflet"
import { FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import { db } from '../../../lib/firebase'
import { doc, updateDoc } from "firebase/firestore"


export default function PlaygoundWriteDraw({ drawLayerRef, isSavingRef }: any){

    async function handleDraw(e: L.DrawEvents.Created){
        isSavingRef.current.textContent = "Saving"

        const layer = e.layer
        drawLayerRef.current.addLayer(layer)
        
        try {
            const docRef = doc(db, "playground", "write")
            await updateDoc(docRef, {
                "drawLayer" : JSON.stringify(drawLayerRef.current.toGeoJSON())
            })
        }
        catch(error){
            console.log(error)
        }

        setTimeout(() => {
            isSavingRef.current.textContent = "Saved"
        }, 800)
    }


    async function handleUpdate(){    
        isSavingRef.current.textContent = "Saving"

        try {
            const docRef = doc(db, "playground", "write")
            await updateDoc(docRef, {
                "drawLayer" : JSON.stringify(drawLayerRef.current.toGeoJSON())
            })
        }
        catch(error){
            console.log(error)
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