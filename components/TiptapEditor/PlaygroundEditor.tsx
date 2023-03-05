import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { GeoLink } from './extensions/GeoLink'
import { useEffect, useState } from 'react'
import OverlayPrompt from 'components/Prompt/OverlayPrompt'
import ImagePrompt from '../Prompt/ImageForm'
import GeoPointForm from '../Prompt/GeoPointForm'
import { geoPointArray, geoPointType } from 'types'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from 'lib/firebase'
import Floatingmenu from './FloatingMenu'
import Bubblemenu from './BubbleMenu'


const TiptapEditor = ({
    geoPoints, 
    setGeoPoints, 
    setLocation, 
    setEDITOR, 
    isSavingRef }: any) => {

    const [ Marks, setMarks ] = useState<geoPointArray | null>(null)
    const [ ImageOverlay, setImageOverlay ] = useState<string>("none")
    const [ GeoOverlay, setGeoOverlay ] = useState<string>("none")


    // editor configure
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            Link.configure({
                validate: href => /^https?:\/\//.test(href),
                autolink: false,
            }),
            GeoLink.configure({
                setLocation: setLocation,
            }),
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === 'heading'){
                        return 'Title'
                    }
              
                    return 'Tell your story...'
                },
            })
        ]
    })

    
    // get editor instance
    useEffect(() => {
        if (editor){
            console.log("editor -> ", editor)
            setEDITOR(editor)
            
            setTimeout(() => {

                // initial loop and add setGeoPoint
                const state = editor.view.state
                const { doc } = state

                const temp: geoPointArray = []
                doc.forEach(node => {
                    node.forEach(child => {
                        child.marks.forEach(mark => {
                            if (mark.type.name === "GeoLink" && mark.attrs.uuid){
                                temp.push({
                                    lat: mark.attrs.lat,
                                    lng: mark.attrs.lng,
                                    uuid: mark.attrs.uuid,
                                    descript: child.textContent,
                                })
                            }
                        })
                    })
                })
                setMarks(temp)
                setGeoPoints(temp)


                // loop through the doc to get current geolink marks
                editor.on('transaction', ({ editor, transaction }) => {
                    const state = editor.view.state
                    const { doc } = state
    
                    const temp: geoPointArray = []
                    doc.forEach(node => {
                        node.forEach(child => {
                            child.marks.forEach(mark => {
                                if (mark.type.name === "GeoLink" && mark.attrs.uuid){
                                    temp.push({
                                        lat: mark.attrs.lat,
                                        lng: mark.attrs.lng,
                                        uuid: mark.attrs.uuid,
                                        descript: child.textContent,
                                    })
                                }
                            })
                        })
                    })
                    setMarks(temp)
                })
            }, 100);
            
        }
    }, [editor])


    // compare marks with geoPoints -> then update 
    useEffect(() => {
        if (Marks && geoPoints){

            if (Marks.length != geoPoints.length){
                setGeoPoints(Marks)
            }
            else if (Marks.length === geoPoints.length){
                let result = false

                geoPoints.forEach((geoPoint: geoPointType) => {
                    const object = Marks.filter(Marks => Marks.uuid === geoPoint.uuid)
                    
                    if (object.length > 0){
                        if (object[0].descript != geoPoint.descript){
                            console.log("Marks -> ", Marks)
                            console.log("geoPoints -> ", geoPoints)
                            result = true
                        }
                    }
                })

                if (result){
                    setGeoPoints(Marks)
                }
            }
        }
    }, [geoPoints, Marks])
    

    // save content to db
    useEffect(() => {
        
        async function updateDB(content: any){
            isSavingRef.current.textContent = "isSaving"

            const docRef = doc(db, "playground", "write")
            await updateDoc(docRef, {
                "editorContent" : content
            })

            setTimeout(() => {
                isSavingRef.current.textContent = "Saved"
            }, 800)
        }
        
        if (editor){
            // save content to db
            editor.on('update', ({ editor }) => {
                const content = editor.getJSON()
                updateDB(content)
            })
        }

    }, [editor])


    return (
        <>
            { editor && <Bubblemenu editor={editor} setGeoOverlay={setGeoOverlay} /> }

            { editor && <Floatingmenu editor={editor} setImageOverlay={setImageOverlay}/> }

            { GeoOverlay === "flex" &&
                <OverlayPrompt overylayDisplay={GeoOverlay} setOverlayDisplay={setGeoOverlay}>
                    <GeoPointForm geoPoints={geoPoints} setGeoPoints={setGeoPoints} setOverlayDisplay={setGeoOverlay} editor={editor}/>
                </OverlayPrompt>
            }

            { ImageOverlay === "flex" && 
                <OverlayPrompt overylayDisplay={ImageOverlay} setOverlayDisplay={setImageOverlay}>
                    <ImagePrompt setOverlayDisplay={setImageOverlay} editor={editor}/>
                </OverlayPrompt>
            }

            <EditorContent editor={editor} />
        </>
    )
}

export default TiptapEditor