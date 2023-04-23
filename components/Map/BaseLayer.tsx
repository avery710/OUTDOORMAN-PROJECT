import { doc, getDoc } from "firebase/firestore"
import { Feature, Geometry } from 'geojson'
import L from "leaflet"
import { db } from "lib/firebase"
import { useEffect, useState } from "react"
import { TileLayer, LayersControl, GeoJSON } from 'react-leaflet'
import { mountDatas } from "types"

export default function BaseLayer(){
    
    const [ mountData, setMountData ] = useState<mountDatas | null>(null)

    useEffect(() => {
        async function fetchMountains() {
            let datas: mountDatas = {
                highMountains : null,
                middleMountains : null,
                lowMountains : null,
            }
            
            try {
                const docRef1 = doc(db, "mountains", "高山")
                const docSnap1 = await getDoc(docRef1)
        
                if (docSnap1.exists()) {
                    datas.highMountains = JSON.parse(docSnap1.data().GeojsonData)
                }
        
                const docRef2 = doc(db, "mountains", "中級山")
                const docSnap2 = await getDoc(docRef2)
        
                if (docSnap2.exists()) {
                    datas.middleMountains = JSON.parse(docSnap2.data().GeojsonData)
                }
        
                const docRef3 = doc(db, "mountains", "郊山")
                const docSnap3 = await getDoc(docRef3)
        
                if (docSnap3.exists()) {
                    datas.lowMountains = JSON.parse(docSnap3.data().GeojsonData)
                }
            }
            catch (error){
                console.log(error)
            }

            setMountData(datas)
        }

        fetchMountains()
    }, [])


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
        <LayersControl position='bottomleft'>

            <LayersControl.BaseLayer checked name='魯地圖 Taiwan Topo'>
                <TileLayer
                    attribution='&copy; <a href="https://rudy.basecamp.tw/taiwan_topo.html">Rudy Taiwan TOPO</a> | &copy; <a href="https://twmap.happyman.idv.tw/map/">地圖產生器</a>'
                    url='https://tile.happyman.idv.tw/mp/wmts/rudy/gm_grid/{z}/{x}/{y}.png'
                />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name='開放街圖 OpenStreetMap'>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url='https://tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name='2020 正射影像圖'>
                <TileLayer
                    attribution='&copy; <a href="https://maps.nlsc.gov.tw">內政部國土測繪中心</a>'
                    url='https://wmts.nlsc.gov.tw/wmts/PHOTO2020/default/GoogleMapsCompatible/{z}/{y}/{x}.jpeg'
                />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name='2001 臺灣經建3版地形圖'>
                <TileLayer
                    attribution='&copy; <a href="https://gissrv4.sinica.edu.tw/gis/twhgis/">中央研究院臺灣百年歷史地圖</a>'
                    url='https://gis.sinica.edu.tw/tileserver/file-exists.php?img=TM25K_2001-jpg-{z}-{x}-{y}'
                />
            </LayersControl.BaseLayer>

            <LayersControl.BaseLayer name='1921 日治臺灣堡圖'>
                <TileLayer
                    attribution='&copy; <a href="https://gissrv4.sinica.edu.tw/gis/twhgis/">中央研究院臺灣百年歷史地圖</a>'
                    url='https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM20K_1921-jpg-{z}-{x}-{y}'
                />
            </LayersControl.BaseLayer>

            { (mountData && mountData.highMountains) &&
                <LayersControl.Overlay checked name='高山 高於3000m'>
                    <GeoJSON 
                        data={mountData.highMountains} 
                        pointToLayer={(feature, latlng) => adjustMarker(latlng, '/images/map/peak.png')}
                        onEachFeature={(feature, layer) => addPopup(feature, layer)}
                    />
                </LayersControl.Overlay>
            }
            
            { (mountData && mountData.middleMountains) && 
                <LayersControl.Overlay name='中級山 1500-3000m'>
                    <GeoJSON 
                        data={mountData.middleMountains} 
                        pointToLayer={(feature, latlng) => adjustMarker(latlng, '/images/map/mountain.png')}
                        onEachFeature={(feature, layer) => addPopup(feature, layer)}
                    />
                </LayersControl.Overlay>
            }
            
            { (mountData && mountData.lowMountains) && 
                <LayersControl.Overlay name='郊山 低於1500m'>
                    <GeoJSON 
                        data={mountData.lowMountains} 
                        pointToLayer={(feature, latlng) => adjustMarker(latlng, '/images/map/lowMountain.png')}
                        onEachFeature={(feature, layer) => addPopup(feature, layer)}
                    />
                </LayersControl.Overlay>
            }

        </LayersControl>
    )
}