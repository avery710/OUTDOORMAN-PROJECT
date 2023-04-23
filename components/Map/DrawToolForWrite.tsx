import * as L from "leaflet"
import { useRouter } from "next/router"
import { MutableRefObject, RefObject } from "react"
import { FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import { db } from '../../lib/firebase'
import { doc, updateDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"


interface Props {
    drawLayerRef: MutableRefObject<L.FeatureGroup<any>>, 
    isSavingRef: RefObject<HTMLLIElement>,
}


export default function DrawingToolBar({ drawLayerRef, isSavingRef }: Props){
    
    const router = useRouter()
    const { storyId } = router.query
    const { authUser } = useAuth()


    async function handleDraw(e: L.DrawEvents.Created){

        if (isSavingRef.current){
            isSavingRef.current.textContent = "Saving in story draft..."
        }
        
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
            if (isSavingRef.current){
                isSavingRef.current.textContent = "Saved"
            }
        }, 800)
    }


    async function handleUpdate(){    
        if (isSavingRef.current){
            isSavingRef.current.textContent = "Saving in story draft..."
        }

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
            if (isSavingRef.current){
                isSavingRef.current.textContent = "Saved"
            }
        }, 800)
    }


    return (
        <FeatureGroup ref={drawLayerRef}>
            <EditControl 
                position = 'topleft' 
                onCreated={e => handleDraw(e)}
                onEdited={() => handleUpdate()}
                onDeleted={() => handleUpdate()}
                draw={{ 
                    rectangle: false, 
                    circle: false, 
                    marker: false, 
                    circlemarker: false,
                    polyline: {
                        shapeOptions: {
                            color: '#ffff00',
                            weight: 4,
                            opacity: 0.7,
                        }
                    },
                    polygon: {
                        allowIntersection: false, 
                        drawError: {
                            color: '#FE5852', 
                            message: '<strong>Uh oh!<strong> you can\'t draw that!' 
                        },
                        shapeOptions: {
                            color: '#ffff00',
                            weight: 4,
                            opacity: 0.7,
                        }
                    },
                }}
            />
        </FeatureGroup> 
    )
}