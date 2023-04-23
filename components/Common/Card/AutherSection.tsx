import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

interface Props {
    autherUniqname: string,
    autherPhotoUrl: string,
    autherName: string,
}

export default function AutherSection({ autherUniqname, autherPhotoUrl, autherName}: Props) {
    return (
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
    )
}

const AutherWrapper = styled.div`
    display: flex;
    align-items: center;
    width: fit-content;
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