import * as L from "leaflet"
import { FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"


export default function PlaygoundWriteDraw({ drawLayerRef, isSavingRef }: any){

    async function handleDraw(e: L.DrawEvents.Created){
        isSavingRef.current.textContent = "Saving"

        const layer = e.layer
        drawLayerRef.current.addLayer(layer)

        setTimeout(() => {
            isSavingRef.current.textContent = "Saved"
        }, 800)
    }


    async function handleUpdate(){    
        isSavingRef.current.textContent = "Saving"

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