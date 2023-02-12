import { useRef, useEffect, useState, FC } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup, LayersControl, GeoJSON } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import { LatLngExpression } from "leaflet"
import L from "leaflet"
import { Feature, Geometry } from 'geojson'
import { db } from '../../lib/firebase'
import { doc, setDoc, getDoc } from "firebase/firestore"


interface pageProps {
    highMountains: GeoJSON.Feature
    middleMountains: GeoJSON.Feature
    lowMountains: GeoJSON.Feature
}

export default function MapForPlan (datas: pageProps){
    return (
        <MapContainer 
            center={[23.46999192, 120.9572655]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%" }}
        >
            <LayersControlGroups {...datas} />
            <DrawingToolBar />
            <LocationMarker />
        </MapContainer>
    )
}

function LayersControlGroups(datas: pageProps){

    function adjustMarker(latlng: L.LatLng, iconURL: string){
        return L.marker(latlng, 
            { icon: L.icon({
                iconUrl: iconURL,
                iconSize: [20, 20],
                popupAnchor: [0, -15]})
            }
        )
    }

    function addPopup(feature: Feature<Geometry, any>, layer: L.Layer){
        const properties = feature.properties
        layer.bindPopup(`
            <h3>${properties.名稱}</h3>
            <p>海拔：${properties.海拔}</p>
            <p>位置：${properties.位置}</p>
            <p>山脈：${properties.山脈}</p>
            <p>園區：${properties.園區}</p>
            <p>基石：${properties.基石}</p>
            <p>TWD67 TM2：${properties['TWD67 TM2']}</p>
        `)
    }

    return (
        <LayersControl position='bottomright'>

            <LayersControl.BaseLayer checked name='開放街圖 OpenStreetMap'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name='魯地圖 Taiwan Topo'>
                <TileLayer
                    attribution='&copy; <a href="https://rudy.basecamp.tw/taiwan_topo.html">Rudy Taiwan TOPO</a> | &copy; <a href="https://twmap.happyman.idv.tw/map/">地圖產生器</a>'
                    url='https://tile.happyman.idv.tw/mp/wmts/rudy/gm_grid/{z}/{x}/{y}.png'
                />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name='2020 正射影像圖'>
                <TileLayer
                    attribution='&copy; <a href="https://maps.nlsc.gov.tw">內政部國土測繪中心</a>'
                    url='https://wmts.nlsc.gov.tw/wmts/PHOTO2020/default/GoogleMapsCompatible/{z}/{y}/{x}.jpeg'
                />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name='2003 臺灣經建3版地形圖'>
                <TileLayer
                    attribution='&copy; <a href="https://gissrv4.sinica.edu.tw/gis/twhgis/">中央研究院臺灣百年歷史地圖</a>'
                    url='https://gis.sinica.edu.tw/tileserver/file-exists.php?img=TM50K_2003-png-{z}-{x}-{y}'
                />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name='1921 日治臺灣堡圖'>
                <TileLayer
                    attribution='&copy; <a href="https://gissrv4.sinica.edu.tw/gis/twhgis/">中央研究院臺灣百年歷史地圖</a>'
                    url='https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM20K_1921-jpg-{z}-{x}-{y}'
                />
            </LayersControl.BaseLayer>

            <LayersControl.Overlay checked name='高山 高於3000m'>
                <GeoJSON 
                    data={datas.highMountains} 
                    pointToLayer={(feature, latlng) => adjustMarker(latlng, './peak.png')}
                    onEachFeature={(feature, layer) => addPopup(feature, layer)}
                />
            </LayersControl.Overlay>

            <LayersControl.Overlay name='中級山 1500-3000m'>
                <GeoJSON 
                    data={datas.middleMountains} 
                    pointToLayer={(feature, latlng) => adjustMarker(latlng, './mountain.png')}
                    onEachFeature={(feature, layer) => addPopup(feature, layer)}
                />
            </LayersControl.Overlay>

            <LayersControl.Overlay name='郊山 低於1500m'>
                <GeoJSON 
                    data={datas.lowMountains} 
                    pointToLayer={(feature, latlng) => adjustMarker(latlng, './lowMountain.png')}
                    onEachFeature={(feature, layer) => addPopup(feature, layer)}
                />
            </LayersControl.Overlay>

        </LayersControl>
    )
}

function LocationMarker(){
    const [position, setPosition] = useState<LatLngExpression | null>(null)

    const map = useMap()

    useEffect(() => {
        map.locate().on("locationfound", e => {
            setPosition(e.latlng)
            map.flyTo(e.latlng, map.getZoom())
        })
    }, [map])

    return position === null ? null : (
        <Marker position={position}>
            <Popup>
                Hello Avery!
            </Popup>
        </Marker>
    )
}

function DrawingToolBar(){
    const FeatureGroupRef = useRef<L.FeatureGroup<any>>(new L.FeatureGroup())

    async function handleDraw(e: L.DrawEvents.Created){
        const layer = e.layer
        FeatureGroupRef.current.addLayer(layer)
        console.log(FeatureGroupRef.current)

        const docData = {
            GeoJSONdata : JSON.stringify(FeatureGroupRef.current.toGeoJSON())
        }
        
        try {
            await setDoc(doc(db, "VectorLayers", "test"), docData)
        }
        catch(error){
            console.log(error)
        }
    }

    async function handleUpdate(){
        const docData = {
            GeoJSONdata : JSON.stringify(FeatureGroupRef.current.toGeoJSON())
        }
        
        try {
            await setDoc(doc(db, "VectorLayers", "test"), docData)
        }
        catch(error){
            console.log(error)
        }
    }

    return (
        <FeatureGroup ref={FeatureGroupRef}>
            <EditControl 
                position = 'topright' 
                onCreated={e => handleDraw(e)}
                onEdited={() => handleUpdate()}
                onDeleted={() => handleUpdate()}
                draw={{ rectangle: false, circle: false }}
            />
        </FeatureGroup>
    )
}