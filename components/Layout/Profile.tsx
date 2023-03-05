import { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { autherInfo } from 'types'
import Image from "next/image"
import { useAuth } from 'hooks/context'

interface Props {
    setOverlayDisplay: Dispatch<SetStateAction<string>>,
    profileUrl: string,
    username: string,
}

export default function Profile({ setOverlayDisplay, profileUrl, username }: Props) {

    function handleEdit(){
        setOverlayDisplay("flex")
    }

    return (
        <Wrapper>
            <ImagePlaceholder>
                { profileUrl && 
                    <Image 
                        src={profileUrl} 
                        fill alt="profile-pic" 
                        style={{objectFit: "cover", objectPosition: "center"}}
                    />
                }
            </ImagePlaceholder>
            <Username>{username}</Username>
            <Edit onClick={handleEdit}>Edit Profile</Edit>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100%;
    margin-bottom: 50px;
`

const ImagePlaceholder = styled.div`
    width: 88px;
    height: 88px;
    background-color: white;
    overflow: hidden;
    position: relative;
    border-radius: 44px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Username = styled.div`
    font-size: 16px;
    font-weight: 500;
    padding-top: 20px;
    padding-bottom: 10px;
`

const Edit = styled.button`
    background-color: white;
    color: rgba(26, 137, 23, 1);
    border: none;
    cursor: pointer;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    font-weight: 500;
    padding: 5px 0px;
`