import L from "leaflet"
import { useEffect } from "react"
import { FeatureGroup, useMap } from "react-leaflet"
import { EditControl } from "react-leaflet-draw"
import { db } from '../../../lib/firebase'
import { doc, updateDoc } from "firebase/firestore"
import { v4 } from "uuid"


export default function DrawingToolBar({ geoJsonData, isSavingRef, setLayers, FeatureGroupRef }){

    const myMap = useMap()


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
                        console.log("init add onchange ")

                        // update the changes to featureObject and save to db
                        FeatureGroupRef.current.eachLayer((layer) => {
                            if (layer.feature &&  layer.feature.properties && layer.feature.properties.uuid === feature.properties.uuid){
                                layer.feature.properties.descript = (e.target).value
                            }
                        })

                        updatedb()
                    })
                },
            })
            
            setLayers(layers)

            const bounds = layers.getBounds()

            if (bounds.isValid()){
                myMap.fitBounds(bounds)
            }
            else {
                // never edited before
                myMap.locate().on("locationfound", e => {
                    L.marker(e.latlng).bindPopup("Current Location").addTo(myMap)
                    myMap.flyTo(e.latlng, myMap.getZoom())
                })
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
        updatedb()
        

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

            console.log("onchange ")

            FeatureGroupRef.current.eachLayer((layer) => {
                if (layer.feature &&  layer.feature.properties && layer.feature.properties.uuid === uuid){
                    layer.feature.properties.descript = (e.target).value
                }
            })

            updatedb()
        })
    

        setTimeout(() => {
            isSavingRef.current.textContent = "Saved"
        }, 1000)
    }

    async function handleDelete(){
        updatedb()
    }

    async function updatedb(){

        console.log("update db! ", FeatureGroupRef.current.toGeoJSON())

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
                draw={{ rectangle: false, circle: false, circlemarker: false }}
            />
        </FeatureGroup>
    )
}