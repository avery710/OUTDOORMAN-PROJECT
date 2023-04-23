import L, { LatLngExpression } from "leaflet"
import { MutableRefObject, useEffect } from "react"

interface Props {
    map: L.Map,
    dragLayerRef: MutableRefObject<L.LayerGroup<any>>
}

export default function DraggableMarker({ map, dragLayerRef }: Props) {
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
                    <p>( Drag the marker! )</p>
                `
                const marker = new L.Marker(currentLocation, { 
                    draggable: true, 
                    icon: L.icon({
                        iconAnchor: [18, 38],
                        iconSize: new L.Point(36, 36),
                        popupAnchor: [0, -38],
                        iconUrl: '/images/icons/pin-yellow-2.png',
                        shadowUrl: '/images/map/shadow.png',
                        shadowSize: [33, 14],
                        shadowAnchor: [0, 16],
                    }) 
                }).bindPopup(popupContent)

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