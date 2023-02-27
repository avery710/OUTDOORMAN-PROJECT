import dynamic from 'next/dynamic'
import styles from '../../styles/newStory.module.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import NavbarForEdit from 'components/Layout/NavbarForEdit'
import { db } from 'lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import OverlayPrompt from 'components/Prompt/OverlayPrompt'
import GpxForm from 'components/Prompt/GpxForm'
import { geoPointArray, wayPointArray } from 'types'
import { Editor } from '@tiptap/react'
import { LayerGroup, MapContainer } from 'react-leaflet'
import BaseLayer from 'components/Map/BaseLayer'
import { LatLngExpression } from 'leaflet'
import FlyToLocation from 'components/Map/FlyToLocation'
import * as L from "leaflet"
import { Feature, Geometry } from 'geojson'
import PlaygroundEditor from 'components/TiptapEditor/PlaygroundEditor'
import GpxLayer from 'components/Map/Playground/GpxLayer'
import GeoPointsLayer from 'components/Map/Playground/GeoPointsLayer'


export default function NewStoryEdit(){

    const [ title, setTitle ] = useState<string>()
    const isSavingRef = useRef<HTMLLIElement>(null)

    const [ geoPoints, setGeoPoints ] = useState<geoPointArray | null>(null)
    const [ location, setLocation ] = useState<LatLngExpression | null>(null)

    const [ gpxOverlay, setGpxOverlay ] = useState<string>("none")
    const [ gpxtracks, setGpxTracks ] = useState<Array<LatLngExpression> | null>(null)
    const [ gpxWaypoints, setGpxWaypoints ] = useState<wayPointArray | null>(null)
    const [ gpxtrackGeoJson, setGpxTrackGeoJson ] = useState<Array<LatLngExpression> | null>(null)

    const [ MAP, setMAP ] = useState<L.Map | null>(null)
    const [ EDITOR, setEDITOR ] = useState<Editor | null>(null)

    const gpxLayerRef = useRef<L.LayerGroup<any>>(new L.LayerGroup())
    const geoLayerRef = useRef<L.LayerGroup<any>>(new L.LayerGroup())
    const drawLayerRef = useRef<L.FeatureGroup<any>>(new L.FeatureGroup())

    const [ fetchData, setFetchData ] = useState<any | null>(null)
    const [ isfetching, setIsFetching ] = useState<boolean>(false)


    const DrawingToolBar = dynamic(
        () => import('../../components/Map/Playground/DrawToolForWrite'), 
        { ssr: false }
    )


    // fetch data for editor and map
    useEffect(() => {

        async function init(){

            const docRef = doc(db, "playground", "write")
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){

                console.log("docSnap.data() -> ", docSnap.data())

                setFetchData(docSnap.data())

                // fetch title
                const fetchTitle = docSnap.data().title
                fetchTitle ? setTitle(fetchTitle) : setTitle("Untitled")

                setIsFetching(true)
            }
        }   
        
        init()

    }, [])


    // add layers to map
    useEffect(() => {

        if (EDITOR && fetchData && MAP){

            console.log("add add")

            console.log("MAP -> ", MAP)

            // fetch editor content
            const editorContent = fetchData.editorContent
            EDITOR.commands.setContent(editorContent)


            // fetch gpx layer geojson data
            const fetchGpx = fetchData.gpxLayer
            let gpxLayers = null
            let gpxBounds = null
            if (fetchGpx){
                gpxLayers = L.geoJSON(JSON.parse(fetchGpx), {
                    onEachFeature: (feature: Feature<Geometry, any>, layer: L.Layer) => {
    
                        if (feature.properties && feature.properties.descript) {
                            const innerHtml = `
                                <h3>${feature.properties.descript}</h3>
                                <p>位置：${feature.properties.lat}, ${feature.properties.lng}</p>
                                <p>高度：${feature.properties.elevation}</p>
                            `
                            const div = document.createElement("div")
                            div.innerHTML = innerHtml
        
                            const button = document.createElement("button")
                            button.innerHTML = "add to text-editor"
        
                            button.onclick = function(){
                                const mark = EDITOR.schema.marks.GeoLink.create({ lat: feature.properties.lat, lng: feature.properties.lng })
                                const from = EDITOR.state.selection.from
                                const transaction = EDITOR.state.tr.insertText(feature.properties.descript)
                                transaction.addMark(from, from + feature.properties.descript.length, mark)
                                EDITOR.view.dispatch(transaction)
                            }
        
                            div.appendChild(button)
        
                            layer.bindPopup(div)
                        }
                    }
                })
                gpxLayerRef.current.addLayer(gpxLayers)
                gpxBounds = gpxLayers.getBounds()
            }
        
            
            // fetch drawing layer geojson data
            const fetchDraw = fetchData.drawLayer
            let drawLayers: any = null
            let drawBounds = null
            if (fetchDraw){
                console.log("draw add")
                drawLayers = L.geoJSON(JSON.parse(fetchDraw))
                drawBounds = drawLayers.getBounds()
            }


            // gpx bound > draw bound
            if (gpxBounds && gpxBounds.isValid()){
                MAP.fitBounds(gpxBounds)
            }
            else if (drawBounds && drawBounds.isValid()){
                MAP.fitBounds(drawBounds)
            }
            else {
                MAP.locate().on("locationfound", e => {
                    L.marker(e.latlng).bindPopup("Current Location").addTo(MAP)
                    MAP.flyTo(e.latlng, MAP.getZoom())
                })
            }


            setTimeout(() => {
                if (drawLayers){
                    drawLayerRef.current.addLayer(drawLayers)
                }
            }, 100)
        }
        
    }, [EDITOR, MAP])


    function handleClickGPX(){
        setGpxOverlay("flex")
    }


    // prevent map from re-rendering -> keep in useMemo
    const Map = useMemo(() => {
        return (
            <MapContainer 
                center={[23.46999192, 120.9572655]} 
                zoom={13} 
                scrollWheelZoom={true} 
                style={{ height: "100%", width: "100%" }}
                ref={setMAP}
            >
                <BaseLayer />
                <LayerGroup ref={gpxLayerRef}/>
                <LayerGroup ref={geoLayerRef}/>
                <DrawingToolBar
                    drawLayerRef={drawLayerRef}
                    isSavingRef={isSavingRef}
                />
            </MapContainer>
        )
    }, [])


    return isfetching ?
    (
        <>
            <NavbarForEdit title={title} isSavingRef={isSavingRef} />

            <div className={styles.container}>
                <div className={styles.map}>
                    {  MAP && 
                            <>
                                <GpxLayer 
                                    gpxtracks={gpxtracks} 
                                    gpxWaypoints={gpxWaypoints}
                                    EDITOR={EDITOR}
                                    layerGroupRef={gpxLayerRef}
                                    map={MAP}
                                    isSavingRef={isSavingRef}
                                    gpxtrackGeoJson={gpxtrackGeoJson}
                                />
                                <GeoPointsLayer 
                                    geoPoints={geoPoints}
                                    layerGroupRef={geoLayerRef}
                                    map={MAP}
                                />
                                <FlyToLocation 
                                    location={location}
                                    map={MAP}
                                />
                            </>
                    }
                    { Map }
                </div>

                <button className={styles.gpx} onClick={handleClickGPX}>
                    GPX
                </button>
            
                <div className={styles.editor}>
                    <PlaygroundEditor 
                        geoPoints={geoPoints} 
                        setGeoPoints={setGeoPoints} 
                        setLocation={setLocation}
                        setEDITOR={setEDITOR}
                        isSavingRef={isSavingRef}
                    />
                </div>

                <OverlayPrompt overlayDisplay={gpxOverlay} setOverlayDisplay={setGpxOverlay}>
                    <GpxForm 
                        setOverlayDisplay={setGpxOverlay} 
                        setGpxTracks={setGpxTracks} 
                        setGpxWaypoints={setGpxWaypoints}
                        setGpxTrackGeoJson={setGpxTrackGeoJson}
                    />
                </OverlayPrompt>
            </div>
        </>
    )
    :
    (
        <div>loading...</div>
    )
}