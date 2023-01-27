import { use, useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap, FeatureGroup, LayersControl } from 'react-leaflet'
import { EditControl } from "react-leaflet-draw"
import { LatLngExpression } from "leaflet"
import L from "leaflet"

export default function MapForPlan() {
    return (
        <MapContainer 
            center={[23.47, 120.96]} 
            zoom={13} 
            scrollWheelZoom={true} 
            style={{ height: "100%", width: "100%" }}
        >
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

                <LayersControl.BaseLayer name='2020-正射影像圖'>
                    <TileLayer
                        attribution='&copy; <a href="https://maps.nlsc.gov.tw">內政部國土測繪中心</a>'
                        url='https://wmts.nlsc.gov.tw/wmts/PHOTO2020/default/GoogleMapsCompatible/{z}/{y}/{x}.jpeg'
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name='2003-臺灣經建3版地形圖'>
                    <TileLayer
                        attribution='&copy; <a href="https://gissrv4.sinica.edu.tw/gis/twhgis/">中央研究院臺灣百年歷史地圖</a>'
                        url='https://gis.sinica.edu.tw/tileserver/file-exists.php?img=TM50K_2003-png-{z}-{x}-{y}'
                    />
                </LayersControl.BaseLayer>

                <LayersControl.BaseLayer name='1921-日治臺灣堡圖'>
                    <TileLayer
                        attribution='&copy; <a href="https://gissrv4.sinica.edu.tw/gis/twhgis/">中央研究院臺灣百年歷史地圖</a>'
                        url='https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM20K_1921-jpg-{z}-{x}-{y}'
                    />
                </LayersControl.BaseLayer>

                <LayersControl.Overlay name='便利商店'>
                    <TileLayer
                        attribution='&copy; <a href="https://maps.nlsc.gov.tw">內政部國土測繪中心</a>'
                        url='https://wmts.nlsc.gov.tw/wmts/ConvenienceStore/default/GoogleMapsCompatible/{z}/{y}/{x}.png'
                    />
                </LayersControl.Overlay>

                <LayersControl.Overlay name='等高線圖'>
                    <TileLayer
                        attribution='&copy; <a href="https://maps.nlsc.gov.tw">內政部國土測繪中心</a>'
                        url='https://wmts.nlsc.gov.tw/wmts/MOI_CONTOUR_2/default/GoogleMapsCompatible/{z}/{y}/{x}.png'
                    />
                </LayersControl.Overlay>

            </LayersControl>
            
            <DrawingToolBar />
            <LocationMarker />
        </MapContainer>
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
    const [mapLayers, setMapLayers] = useState([])
    const map = useMap()

    map.on('draw:edited', function (e) {
        console.log(e)
    });

    map.on('draw:created', function (e) {
        console.log(e)
    });

    map.on('draw:deleted', function (e) {
        console.log(e)
    });

    return (
        <FeatureGroup>
            <EditControl 
                position = 'topright' 
                draw={{ rectangle: false, circle: false }}
            />
        </FeatureGroup>
    )
}