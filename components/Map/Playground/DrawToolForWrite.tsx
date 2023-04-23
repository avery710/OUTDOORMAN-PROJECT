import * as L from "leaflet"
import { MutableRefObject } from "react"
import { FeatureGroup } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"


interface Props {
    drawLayerRef: MutableRefObject<L.FeatureGroup<any>>, 
}


export default function PlaygoundWriteDraw({ drawLayerRef }: Props){

    async function handleDraw(e: L.DrawEvents.Created){
        const layer = e.layer
        drawLayerRef.current.addLayer(layer)
    }

    return (
        <FeatureGroup ref={drawLayerRef}>
            <EditControl 
                position = 'topleft' 
                onCreated={e => handleDraw(e)}
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