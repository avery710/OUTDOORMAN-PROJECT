import React, { MouseEventHandler } from 'react'
import styled from 'styled-components'


interface Props {
    handleClickGPX: MouseEventHandler<HTMLButtonElement> | undefined
}


export default function GpxButton({ handleClickGPX }: Props) {
    return (
        <UploadGpx onClick={handleClickGPX}/>
    )
}

const UploadGpx = styled.button`
    background-color: black;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: 24px 24px;
    background-image: url(/images/icons/upload-gpx-60.svg);
    width: 45px;
    height: 45px;
    bottom: 64px;
    left: 11px;
    padding: 10px;
    z-index: 400;
    position: absolute;
    cursor: pointer;
    border: 5px solid black;
    border-radius: 5px;

    &:hover {
        background-image: url(/images/icons/upload-gpx-100.svg);
        transition: all .1s ease-in-out;
    }
`