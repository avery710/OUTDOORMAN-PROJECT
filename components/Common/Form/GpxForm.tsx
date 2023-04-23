import { Dispatch, SetStateAction, useRef, useState } from "react"
import gpxParser from "gpxparser"
import { wayPointArray } from "types"
import styled from "styled-components"
import { LatLngExpression } from "leaflet"

interface Props {
    setOverlayDisplay: Dispatch<SetStateAction<string>>, 
    setGpxTracks: Dispatch<SetStateAction<LatLngExpression[] | null>>, 
    setGpxWaypoints: Dispatch<SetStateAction<wayPointArray | null>>, 
    setGpxTrackGeoJson: Dispatch<SetStateAction<LatLngExpression[] | null>>,
}

export default function GpxForm({setOverlayDisplay, setGpxTracks, setGpxWaypoints, setGpxTrackGeoJson}: Props) {
    
    const gpxRef = useRef<HTMLInputElement | null>(null)
    const [ gpx, setGpx ] = useState<string>("")
    const [ file, setFile ] = useState<File>()

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){

        e.preventDefault()

        if (gpx){
            const gpxData = new gpxParser()
            gpxData.parse(gpx)
            const tracks: LatLngExpression[] = gpxData.tracks[0].points.map(pos => [pos.lat, pos.lon])
            const trackGeoJson: LatLngExpression[] = gpxData.tracks[0].points.map(pos => [pos.lon, pos.lat])
            const waypoints: wayPointArray = gpxData.waypoints.map(waypoint => (
                {lat: waypoint.lat, lng: waypoint.lon, elevation: waypoint.ele, descript: waypoint.name}
            ))
            setGpxWaypoints(waypoints)
            setGpxTracks(tracks)
            setGpxTrackGeoJson(trackGeoJson)
        }
        
        setOverlayDisplay("none")
    }
    
    function loadGPX(files: FileList | null){
        const reader = new FileReader()

        reader.onload = function () {
            if (typeof reader.result === 'string') {
                setGpx(reader.result);
            }
            return ''
        }

        if (files !== null && files.length > 0) {
            reader.readAsText(files[0])
            setFile(files[0])
        }
    }

    return (
        <FormWrapper onSubmit={e => handleSubmit(e)}>
            <Label>
                Upload GPX file
                <Input type="file" accept=".gpx" ref={gpxRef} onChange={e => loadGPX(e.target.files)}/>
            </Label>
            <FileName>{file && file.name}</FileName>
            <br/>
            <SubmitButton type='submit'>submit</SubmitButton>
        </FormWrapper>
    )
}

const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Label = styled.label`
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    color: rgb(26, 137, 23);
    padding-bottom: 16px;

    &:hover {
        scale: 0.98;
        transition: all .1s ease-in-out;
    }
`

const Input = styled.input`
    display: none;
`

const FileName = styled.div`
    font-size: 14px;
    color: rgba(117, 117, 117);
`

const SubmitButton = styled.button`
    border: 1px solid rgb(26, 137, 23);
    background-color: white;
    font-size: 14px;
    font-weight: 400;
    color: rgb(26, 137, 23);
    cursor: pointer;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    border-radius: 15px;
    padding-left: 14px;
    padding-right: 14px;
`