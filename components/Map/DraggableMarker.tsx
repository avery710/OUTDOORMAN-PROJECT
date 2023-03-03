import L, { LatLngExpression } from "leaflet"
import { MutableRefObject, useEffect } from "react"

interface Props {
    map: L.Map,
    dragLayerRef: MutableRefObject<L.LayerGroup<any>>
}


export default function DraggableMarker({ map, dragLayerRef}: Props) {
    useEffect(() => {
        if (map){
            map.on('dblclick', (e) => {

                if (dragLayerRef.current){
                    dragLayerRef.current.eachLayer(layer => {
                        layer.remove()
                    })
                }

                const lat = e.latlng.lat.toFixed(5)
                const lng = e.latlng.lng.toFixed(5)
                const currentLocation: LatLngExpression = [Number(lat), Number(lng)]

                const popupContent = `
                    <h3>Marker Latlng</h3>
                    <p>${lat}, ${lng}</p>
                    <p>(Drag to get other location)</p>
                `
                const marker = new L.Marker(currentLocation, { draggable: true }).bindPopup(popupContent)
                marker.on('add', (e) => {e.target.openPopup()})

                marker.on('dragend', () => {
                    const lat = marker.getLatLng().lat.toFixed(5)
                    const lng = marker.getLatLng().lng.toFixed(5)
                    marker.setPopupContent(`<h4>Marker Latlng</h4><p>${lat}, ${lng}</p>`)
                    marker.openPopup()
                })
                dragLayerRef.current.addLayer(marker)

            })
        }
    }, [map])

    return (null)
}