import { doc, getDoc } from 'firebase/firestore'
import { db } from 'lib/firebase'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { recommendCardType } from 'types'
import AutherSection from './AutherSection'

interface Props {
    content: recommendCardType
}

export default function RecommendCard({ content }: Props){

    const [ autherPhotoUrl, setAutherPhotoUrl ] = useState<string>("")
    const [ autherName, setAutherName ] = useState<string>("")
    const [ autherUniqname, setAutherUniqname ] = useState<string>("")

    useEffect(() => {
        
        async function fetchAuther(){
            const docRef = doc(db, "users", content.userId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){
                setAutherPhotoUrl(docSnap.data().photoUrl)
                setAutherName(docSnap.data().username)
                setAutherUniqname(docSnap.data().uniqname)
            }
        }

        fetchAuther()
        
    }, [])

    return (
        <Wrapper>
            <AutherSection
                autherPhotoUrl={autherPhotoUrl}
                autherUniqname={autherUniqname}
                autherName={autherName}
            />
            <TitleWrapper href={`/${autherUniqname}/${content.url}`}>
                {content.title}
            </TitleWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    padding-bottom: 14px;
`

const TitleWrapper = styled.a`
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
    overflow: hidden;
    padding-bottom: 8px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
    text-decoration: none;
`