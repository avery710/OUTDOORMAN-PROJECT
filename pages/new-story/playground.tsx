import dynamic from 'next/dynamic'
import styles from '../../styles/newStory.module.css'
import { useEffect, useMemo, useRef, useState } from 'react'
import NavbarForEdit from 'components/Layout/NavbarForEdit'
import { db } from 'lib/firebase'
import { doc, getDoc } from 'firebase/firestore'
import OverlayPrompt from 'components/Common/OverlayPrompt/OverlayPrompt'
import GpxForm from 'components/Common/Form/GpxForm'
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
import GpxButton from 'components/Map/GpxButton'
import { myMarkerOptions } from 'lib/leafletMarkerOption'
import Head from 'next/head'
import GeoPointForm from 'components/Common/Form/GeoPointForm'
import ImagePrompt from 'components/Common/Form/ImageForm'
import LinkForm from 'components/Common/Form/LinkForm'
import DraggableMarker from 'components/Map/DraggableMarker'


export default function NewStoryEdit(){

    const [ title, setTitle ] = useState<string>()
    const isSavingRef = useRef<HTMLLIElement>(null)

    const [ geoPoints, setGeoPoints ] = useState<geoPointArray | null>(null)
    const [ location, setLocation ] = useState<LatLngExpression>([23.27194, 121.00771])

    const [ gpxOverlay, setGpxOverlay ] = useState<string>("none")
    const [ gpxtracks, setGpxTracks ] = useState<Array<LatLngExpression> | null>(null)
    const [ gpxWaypoints, setGpxWaypoints ] = useState<wayPointArray | null>(null)
    const [ gpxtrackGeoJson, setGpxTrackGeoJson ] = useState<Array<LatLngExpression> | null>(null)

    const [ MAP, setMAP ] = useState<L.Map | null>(null)
    const [ EDITOR, setEDITOR ] = useState<Editor | null>(null)

    const [ ImageOverlay, setImageOverlay ] = useState<string>("none")
    const [ GeoOverlay, setGeoOverlay ] = useState<string>("none")
    const [ LinkOverlay, setLinkOverlay ] = useState<string>("none")

    const gpxLayerRef = useRef<L.LayerGroup<any>>(new L.LayerGroup())
    const geoLayerRef = useRef<L.LayerGroup<any>>(new L.LayerGroup())
    const dragLayerRef = useRef<L.LayerGroup<any>>(new L.LayerGroup())
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
                            button.className = "addTextButton"
                            button.innerHTML = "Add to text-editor"
        
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
                    },

                    style: {
                        "color": '#ffff00',
                        "weight": 4,
                        "opacity": 0.7,
                    },
    
                    pointToLayer: function (feature, latlng) {
                        return L.marker(latlng, myMarkerOptions)
                    },
                })
                gpxLayerRef.current.addLayer(gpxLayers)
                gpxBounds = gpxLayers.getBounds()
            }
        
            
            // fetch drawing layer geojson data
            const fetchDraw = fetchData.drawLayer
            let drawLayers: any = null
            let drawBounds = null
            if (fetchDraw){
                drawLayers = L.geoJSON(JSON.parse(fetchDraw),{
                    style: {
                        "color": '#ffff00',
                        "weight": 4,
                        "opacity": 0.7,
                    },
                })
                drawBounds = drawLayers.getBounds()
            }


            // gpx bound > draw bound
            if (gpxBounds && gpxBounds.isValid()){
                MAP.fitBounds(gpxBounds)
            }
            else if (drawBounds && drawBounds.isValid()){
                MAP.fitBounds(drawBounds)
            }

            const marker = L.marker(location, myMarkerOptions).bindPopup(`<p>Double click the map to get other location</p>`)
            marker.on('add', e => e.target.openPopup())
            MAP.addLayer(marker)


            setTimeout(() => {
                if (drawLayers){
                    drawLayerRef.current.addLayer(drawLayers)
                }
            }, 500)
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
                attributionControl={false}
            >
                <BaseLayer />
                <LayerGroup ref={gpxLayerRef}/>
                <LayerGroup ref={geoLayerRef}/>
                <LayerGroup ref={dragLayerRef}/>
                <DrawingToolBar
                    drawLayerRef={drawLayerRef}
                    isSavingRef={isSavingRef}
                />
            </MapContainer>
        )
    }, [])


    return (
        <>
            <Head>
                <title>Story playground</title>
            </Head>
            {
                isfetching ?
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
                                            {/* <FlyToLocation 
                                                location={location}
                                                map={MAP}
                                            /> */}
                                            <DraggableMarker
                                                dragLayerRef={dragLayerRef}
                                                map={MAP}
                                            />
                                        </>
                                }
                                { Map }
                            </div>
            
                            <GpxButton handleClickGPX={handleClickGPX}/>
                        
                            <div className={styles.editor}>
                                <PlaygroundEditor 
                                    geoPoints={geoPoints} 
                                    setGeoPoints={setGeoPoints} 
                                    setLocation={setLocation}
                                    setEDITOR={setEDITOR}
                                    isSavingRef={isSavingRef}
                                    setGeoOverlay={setGeoOverlay}
                                    setLinkOverlay={setLinkOverlay}
                                    setImageOverlay={setImageOverlay}
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

                            <OverlayPrompt overlayDisplay={GeoOverlay} setOverlayDisplay={setGeoOverlay}>
                                <GeoPointForm geoPoints={geoPoints} setGeoPoints={setGeoPoints} setOverlayDisplay={setGeoOverlay} editor={EDITOR}/>
                            </OverlayPrompt>
            
                            <OverlayPrompt overlayDisplay={ImageOverlay} setOverlayDisplay={setImageOverlay}>
                                <ImagePrompt setOverlayDisplay={setImageOverlay} editor={EDITOR}/>
                            </OverlayPrompt>
            
                            <OverlayPrompt overlayDisplay={LinkOverlay} setOverlayDisplay={setLinkOverlay}>
                                <LinkForm setOverlayDisplay={setLinkOverlay} editor={EDITOR}/>
                            </OverlayPrompt>
                        </div>
                    </>
                )
                :
                (
                    <div>loading...</div>
                )
            }
        </>
    )
}