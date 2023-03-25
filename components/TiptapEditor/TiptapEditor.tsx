import {
    EditorContent,
    JSONContent,
    useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { GeoLink } from './extensions/GeoLink'
import { useEffect, useState } from 'react'
import { geoPointArray, geoPointType } from 'types'
import { useRouter } from 'next/router'
import { useAuth } from 'hooks/context'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from 'lib/firebase'
import Floatingmenu from './FloatingMenu'
import Bubblemenu from './BubbleMenu'
import HardBreak from '@tiptap/extension-hard-break'


const TiptapEditor = ({
    geoPoints, 
    setGeoPoints, 
    setLocation, 
    setEDITOR, 
    isSavingRef,
    setGeoOverlay,
    setLinkOverlay,
    setImageOverlay }: any) => {

    const [ Marks, setMarks ] = useState<geoPointArray | null>(null)
    const router = useRouter()
    const { storyId } = router.query
    const { authUser } = useAuth()


    // editor configure
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            Image,
            HardBreak,
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
            }),
        ],
        autofocus: 'start',
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
    

    // save content to db
    useEffect(() => {
        
        async function updateDB(content: JSONContent, textContent: string){
            if (isSavingRef.current != "Saving in story draft..."){
                isSavingRef.current.textContent = "Saving in story draft..."

                setTimeout(() => {
                    isSavingRef.current.textContent = "Saved"
                }, 1000)
            }

            if (authUser && authUser.uid && storyId){
                const docRef = doc(db, "users", authUser.uid, "stories-edit", storyId as string)
                await updateDoc(docRef, {
                    "editorContent" : content,
                    "editorTextContent": textContent
                })
            }
        }
        
        if (editor){
            // save content to db
            editor.on('update', ({ editor }) => {
                const content = editor.getJSON()
                const textContent = editor.state.doc.textContent
                updateDB(content, textContent)
            })
        }

    }, [editor])


    return (
        <>
            { editor && <Bubblemenu editor={editor} setGeoOverlay={setGeoOverlay} setLinkOverlay={setLinkOverlay}/> }

            { editor && <Floatingmenu editor={editor} setImageOverlay={setImageOverlay} /> }

            <EditorContent editor={editor} />
        </>
    )
}

export default TiptapEditor