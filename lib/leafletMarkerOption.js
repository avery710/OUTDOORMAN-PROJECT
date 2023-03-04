import L from "leaflet"

export const myMarkerOptions = { 
    icon: L.icon(
        {
            iconAnchor: [18, 38],
            iconSize: new L.Point(36, 36),
            popupAnchor: [0, -38],
            iconUrl: '/images/icons/pin-yellow-2.png',
            shadowUrl: '/images/map/shadow.png',
            shadowSize: [33, 14],
            shadowAnchor: [0, 16]
        }
    )
}