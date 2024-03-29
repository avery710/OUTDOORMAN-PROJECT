import { generateHTML } from '@tiptap/html'
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Image from '@tiptap/extension-image'
import { GeoLink } from './extensions/GeoLink'
import styled from 'styled-components'
import AutherSection from 'components/Common/Card/AutherSection'
import { doc, getDoc } from 'firebase/firestore'
import { db } from 'lib/firebase'
import { JSONContent } from '@tiptap/react'
import L from 'leaflet'


interface Props {
    editorContent: JSONContent, 
    title: string, 
    mapRef: MutableRefObject<L.DrawMap | null>, 
    userId: string, 
    date: string,
}


export default function EditorForView({ editorContent, title, mapRef, userId, date }: Props){

    const divRef = useRef<HTMLDivElement>(null)
    const [ autherPhotoUrl, setAutherPhotoUrl ] = useState<string>("")
    const [ autherName, setAutherName ] = useState<string>("")
    const [ autherUniqname, setAutherUniqname ] = useState<string>("")

    useEffect(() => {
        if (editorContent){
            const html = generateHTML(
                editorContent, [
                    StarterKit,
                    Underline,
                    Image,
                    Link,
                    GeoLink,
                    Placeholder,
                ]
            )

            const paddingBottom = document.createElement("div")
            paddingBottom.className = "paddingBottom"

            if (divRef.current){
                divRef.current.innerHTML = html
                divRef.current.appendChild(paddingBottom)
            }

            setTimeout(() => {
                document.querySelectorAll('.geolink').forEach(geolink => {
                    const lat = Number(geolink.getAttribute('data-lat'))
                    const lng = Number(geolink.getAttribute('data-lng'))

                    geolink.addEventListener('click', () => {
                        mapRef.current?.flyTo([lat, lng], 13)
                    })
                })
            }, 1000)
            
        }
    }, [editorContent])

    useEffect(() => {
        async function fetchAuther(){
            const docRef = doc(db, "users", userId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setAutherPhotoUrl(docSnap.data().photoUrl)
                setAutherName(docSnap.data().username)
                setAutherUniqname(docSnap.data().uniqname)
            }
        }

        fetchAuther()
    }, [])
    
    return (
        <Wrapper>
            <BasicInfoWrapper>
                <FirstSection>
                    <AutherSection
                        autherName={autherName}
                        autherUniqname={autherUniqname}
                        autherPhotoUrl={autherPhotoUrl}
                    />
                    <Date>{date}</Date>
                </FirstSection>
                
                <TitleWrapper>{title}</TitleWrapper>
            </BasicInfoWrapper>
            <EditorContent ref={divRef} className="ProseMirror"></EditorContent>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    overflow: auto;
    height: calc(100vh - 65px);
`

const BasicInfoWrapper = styled.div`
    padding: 0px 60px;
    padding-top: 50px;
    display: flex;
    flex-direction: column;
`

const TitleWrapper = styled.div`
    line-height: 40px;
    font-size: 28px;
    font-weight: 700;
`

const FirstSection = styled.div`
    padding-bottom: 26px;
    display: flex;
    flex-direction: column;
`

const Date = styled.div`
    font-size: 13px;
    color: rgba(117,117,117,1);
    padding-bottom: 8px;
`

const EditorContent = styled.div`
    padding-top: 30px;
`