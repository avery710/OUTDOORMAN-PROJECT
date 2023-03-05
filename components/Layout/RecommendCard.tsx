import { doc, getDoc } from 'firebase/firestore'
import { db } from 'lib/firebase'
import Image from 'next/image'
import Link from 'next/link'
import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { recommendCardType } from 'types'

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
            <AutherWrapper onClick={() => window.location.href = `/${autherUniqname}`}>
                <ImageWrapper>
                    { autherPhotoUrl && 
                        <Image
                            src={autherPhotoUrl}
                            alt="auther-photo"
                            fill
                            style={{objectFit: "cover", objectPosition: "center"}}
                        />
                    }
                </ImageWrapper>
                <AutherName>{autherName}</AutherName>
            </AutherWrapper>
            
            <TitleWrapper>
                <Link href={`/${autherUniqname}/${content.url}`}>
                    {content.title}
                </Link>
            </TitleWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    padding-bottom: 14px;
`

const AutherWrapper = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    padding-bottom: 8px;
    cursor: pointer;
`

const ImageWrapper = styled.div`
    width: 20px;
    height: 20px;
    position: relative;
    border-radius: 10px;
    background-color: rgba(0, 0, 0, 0.1);
    overflow: hidden;
    margin-right: 10px;
`

const AutherName = styled.div`
    font-size: 14px;
    font-weight: 500;
`

const TitleWrapper = styled.div`
    font-weight: 700;
    font-size: 15px;
    line-height: 20px;
    overflow: hidden;
    padding-bottom: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
`