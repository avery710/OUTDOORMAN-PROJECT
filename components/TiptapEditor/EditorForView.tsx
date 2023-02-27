import { JSONContent } from '@tiptap/react'
import { generateHTML } from '@tiptap/html'
import { Dispatch, LegacyRef, SetStateAction, useEffect, useRef, useState } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { GeoLink } from './extensions/GeoLink'
import { LatLngExpression } from 'leaflet'


interface Props {
    editorContent: JSONContent,
    title: string,
    setLocation: Dispatch<SetStateAction<LatLngExpression | null>>,
}

export default function EditorForView({ editorContent, title, mapRef }: any){

    // const [ output, setOutput ] = useState<HTMLElement | null>(null)
    const divRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (editorContent){
            const html = generateHTML(
                editorContent, 
                [
                    StarterKit,
                    Underline,
                    Image,
                    Link,
                    GeoLink,
                    Placeholder,
                ]
            )

            if (divRef.current){
                divRef.current.innerHTML = html
            }

            setTimeout(() => {
                document.querySelectorAll('.geolink').forEach(geolink => {
                    const lat = Number(geolink.getAttribute('data-lat'))
                    const lng = Number(geolink.getAttribute('data-lng'))

                    geolink.addEventListener('click', () => {
                        mapRef.current.flyTo([lat, lng], 13)
                    })
                    
                })
            }, 1000)
            
        }
    }, [editorContent])
    
    return (
        <>
            <h1>{title}</h1>
            <div ref={divRef} className="ProseMirror"></div>
        </>
    )
}