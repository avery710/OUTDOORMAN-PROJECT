import { Feature, Geometry } from 'geojson';
import L from 'leaflet';
import { useEffect } from 'react'
import styles from '../../styles/newStory.module.css'


export default function MapForView({ mapRef, mountains, storyData }: any) {

    useEffect(() => {

        // delete the initialized map
        if(mapRef.current != null){
            mapRef.current.off()
            mapRef.current.remove()
            console.log("remove!")
        }

        const Map = L.map("map", { zoomControl: false , attributionControl: false}).setView([23.46999192, 120.9572655], 13)
        // Map.attributionControl.setPosition('bottomleft')

        // tile layers
        const TaiwanTopo = L.tileLayer('https://tile.happyman.idv.tw/mp/wmts/rudy/gm_grid/{z}/{x}/{y}.png', {
            id: "defaultLayer",
            attribution: '&copy; <a href="https://rudy.basecamp.tw/taiwan_topo.html">Rudy Taiwan TOPO</a> | &copy; <a href="https://twmap.happyman.idv.tw/map/">地圖產生器</a>'
        }).addTo(Map)

        const openStreetMap = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        })

        const photoMap = L.tileLayer('https://wmts.nlsc.gov.tw/wmts/PHOTO2020/default/GoogleMapsCompatible/{z}/{y}/{x}.jpeg', {
            attribution: '&copy; <a href="https://maps.nlsc.gov.tw">內政部國土測繪中心</a>'
        })

        const jingjian3 = L.tileLayer('https://gis.sinica.edu.tw/tileserver/file-exists.php?img=TM25K_2001-jpg-{z}-{x}-{y}', {
            attribution: '&copy; <a href="https://gissrv4.sinica.edu.tw/gis/twhgis/">中央研究院臺灣百年歷史地圖</a>'
        })

        const baotu = L.tileLayer('https://gis.sinica.edu.tw/tileserver/file-exists.php?img=JM20K_1921-jpg-{z}-{x}-{y}', {
            attribution: '&copy; <a href="https://gissrv4.sinica.edu.tw/gis/twhgis/">中央研究院臺灣百年歷史地圖</a>'
        })

        const baseMaps = {
            '魯地圖 Taiwan Topo': TaiwanTopo,
            '開放街圖 OpenStreetMap': openStreetMap,
            '2020 正射影像圖': photoMap,
            '2001 臺灣經建3版地形圖': jingjian3,
            '1921 日治臺灣堡圖': baotu
        }

        
        // overlay geojson
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

        const highMounts = L.geoJSON(mountains.highMountains, {
            pointToLayer: (feature, latlng) => adjustMarker(latlng, '/peak.png'),
            onEachFeature: addPopup
        }).addTo(Map)

        const middleMounts = L.geoJSON(mountains.middleMountains, {
            pointToLayer: (feature, latlng) => adjustMarker(latlng, '/mountain.png'),
            onEachFeature: addPopup
        })

        const lowMounts = L.geoJSON(mountains.lowMountains, {
            pointToLayer: (feature, latlng) => adjustMarker(latlng, '/lowMountain.png'),
            onEachFeature: addPopup
        })

        const overlayMaps = {
            '高山 高於3000m': highMounts,
            '中級山 1500-3000m': middleMounts,
            '郊山 低於1500m': lowMounts
        };

        L.control.layers(baseMaps, overlayMaps, { position: "bottomleft" }).addTo(Map)


        // add layergroup from db
        function onEachFeature(feature: Feature<Geometry, any>, layer: L.Layer){
            if (feature.properties && feature.properties.descript) {
                const innerHtml = `
                    <h3>${feature.properties.descript}</h3>
                    <p>位置：${feature.properties.lat}, ${feature.properties.lng}</p>
                `

                layer.bindPopup(innerHtml)
            }
        }

        // add drawing layer
        const drawData = storyData.drawLayer
        const drawLayers = L.geoJSON(JSON.parse(drawData)).addTo(Map)
        const drawBounds = drawLayers.getBounds()

        // add gpx layer
        const gpxData = storyData.gpxLayer
        const gpxLayers = L.geoJSON(JSON.parse(gpxData), { onEachFeature: onEachFeature }).addTo(Map)
        const gpxBounds = gpxLayers.getBounds()

        // add geoPoint layer
        const geoPointData = storyData.geoPointLayer
        L.geoJSON(JSON.parse(geoPointData), { onEachFeature: onEachFeature }).addTo(Map)


        // fit bound
        if (gpxBounds && gpxBounds.isValid()){
            Map.fitBounds(gpxBounds)
        }
        else if (drawBounds && drawBounds.isValid()){
            Map.fitBounds(drawBounds)
        }
        else {
            Map.locate().on("locationfound", e => {
                L.marker(e.latlng).bindPopup("Current Location").addTo(Map)
                Map.flyTo(e.latlng, Map.getZoom())
            })
        }


        // store map instance in mapRef
        mapRef.current = Map
        console.log("mapref", mapRef.current)

    }, [mapRef, mountains, storyData])


    return (
        <div id="map" className={styles.map} />
    )
}