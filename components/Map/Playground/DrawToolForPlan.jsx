import L from "leaflet"
import { useEffect } from "react"
import { FeatureGroup, useMap } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import { db } from '../../../lib/firebase'
import { doc, updateDoc } from "firebase/firestore"
import { v4 } from "uuid"
import { myMarkerOptions } from "lib/leafletMarkerOption"


export default function DrawingToolBar({ geoJsonData, isSavingRef, setLayers, FeatureGroupRef }){

    const myMap = useMap()
    const MyMarker = L.Icon.extend({
        options: {
            shadowUrl: null,
            iconAnchor: [18, 38],
            iconSize: new L.Point(36, 36),
            popupAnchor: [0, -38],
            iconUrl: '/images/icons/pin-yellow-2.png',
            shadowUrl: '/images/map/shadow.png',
            shadowSize: [33, 14],
            shadowAnchor: [0, 16],
        }
    })


    // init load of geojson data
    useEffect(() => {

        if (geoJsonData && myMap){

            const layers = L.geoJSON(JSON.parse(geoJsonData), {

                onEachFeature(feature, layer) {

                    const div = document.createElement("div")
                    const popupInput = document.createElement("textarea")
                    popupInput.className = "popupInput"
                    popupInput.maxLength = 15
                    popupInput.wrap = "hard"
                    popupInput.placeholder = "click & edit"
                    popupInput.dataset.uuid = feature.properties.uuid
                    if (feature.properties.descript){
                        popupInput.value = feature.properties.descript
                    }
                    div.appendChild(popupInput)
                    layer.bindPopup(div)

                    layer.feature = {}
                    layer.feature.type = "Feature"
                    layer.feature.properties = {
                        descript: feature.properties.descript,
                        uuid: feature.properties.uuid,
                    }

                    layer.on('add', (e) => {
                        e.target.openPopup()
                    })


                    popupInput.addEventListener('change', async (e) => {

                        // update the changes to featureObject and save to db
                        myMap.eachLayer(curLayer => {
                            if (curLayer.feature &&  curLayer.feature.properties && curLayer.feature.properties.uuid === e.target.dataset.uuid){
                                curLayer.feature.properties.descript = e.target.value
                            }
                        })

                        // updatedb()
                    })
                },

                style: {
                    "color": '#ffff00',
                    "weight": 4,
                    "opacity": 0.7,
                },

                pointToLayer: function (feature, latlng) {
                    return L.marker(latlng,myMarkerOptions)
                },
            })
            
            setLayers(layers)

            const bounds = layers.getBounds()

            if (bounds.isValid()){
                myMap.fitBounds(bounds)
            }
        }
        
    }, [geoJsonData, myMap])


    async function handleCreate(e){
        
        if (isSavingRef.current.textContent === "Saved"){
            isSavingRef.current.textContent = "Saving"
        }

        const layer = e.layer
        const uuid = v4()

        layer.feature = {}
        layer.feature.type = "Feature"
        layer.feature.properties = {
            descript: "",
            uuid: uuid,
        }

        layer.on('add', (e) => {
            e.target.openPopup()
        })

        FeatureGroupRef.current.addLayer(layer)
        // updatedb()
        

        // add popup on layer
        const div = document.createElement("div")
        const popupInput = document.createElement("textarea")
        popupInput.className = "popupInput"
        popupInput.maxLength = 15
        popupInput.wrap = "hard"
        popupInput.placeholder = "click & edit"
        div.appendChild(popupInput)
        layer.bindPopup(div)
        layer.openPopup()
        

        // add eventlistener on popup input field
        popupInput.addEventListener('change', async (e) => {

            myMap.eachLayer((layer) => {
                if (layer.feature &&  layer.feature.properties && layer.feature.properties.uuid === uuid){
                    layer.feature.properties.descript = (e.target).value
                }
            })

            // updatedb()
        })
    

        setTimeout(() => {
            isSavingRef.current.textContent = "Saved"
        }, 1000)
    }

    async function handleDelete(){
        // updatedb()
    }

    async function updatedb(){

            try {
                const docRef = doc(db, "playground", "plan")
                await updateDoc(docRef, {
                    "geoJsonData" : JSON.stringify(FeatureGroupRef.current.toGeoJSON())
                })
            }
            catch(error){
                console.log(error)
            }
    }

    
    return (
        <FeatureGroup ref={FeatureGroupRef}>
            <EditControl 
                position = 'topleft' 
                onCreated={e => handleCreate(e)}
                onDeleted={handleDelete}
                edit={{ edit: false }}
                draw={{ 
                    rectangle: false, 
                    circle: false, 
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
                    marker: {
                        icon: new MyMarker()
                    }
                }}
            />
        </FeatureGroup>
    )
}