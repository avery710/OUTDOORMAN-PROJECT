import { Editor, EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { GeoLink } from './extensions/GeoLink'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { geoPointArray, geoPointType } from 'types'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from 'lib/firebase'
import Floatingmenu from './FloatingMenu'
import Bubblemenu from './BubbleMenu'
import { LatLngExpression } from 'leaflet'


interface Props {
    geoPoints: geoPointArray | null, 
    setGeoPoints: Dispatch<SetStateAction<geoPointArray | null>>, 
    setLocation: Dispatch<SetStateAction<LatLngExpression | null>>, 
    setEDITOR: Dispatch<SetStateAction<Editor | null>>, 
    setGeoOverlay: Dispatch<SetStateAction<string>>,
    setLinkOverlay: Dispatch<SetStateAction<string>>,
    setImageOverlay: Dispatch<SetStateAction<string>>,
}


const TiptapEditor = ({
    geoPoints, 
    setGeoPoints, 
    setLocation, 
    setEDITOR, 
    setGeoOverlay,
    setLinkOverlay,
    setImageOverlay }: Props) => {

    const [ Marks, setMarks ] = useState<geoPointArray | null>(null)


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
        ],
        autofocus: true,
    })

    
    // get editor instance
    useEffect(() => {
        if (editor){
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


    return (
        <>
            { editor && <Bubblemenu editor={editor} setGeoOverlay={setGeoOverlay} setLinkOverlay={setLinkOverlay}/> }

            { editor && <Floatingmenu editor={editor} setImageOverlay={setImageOverlay}/> }

            <EditorContent editor={editor} />
        </>
    )
}

export default TiptapEditor