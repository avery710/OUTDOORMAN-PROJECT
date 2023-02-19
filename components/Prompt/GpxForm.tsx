import { useRef, useState } from "react"
import gpxParser from "gpxparser"
import { wayPointArray } from "types"

export default function GpxForm({setOverlayDisplay, setGpxTracks, setGpxWaypoints}: any) {
    const gpxRef = useRef<HTMLInputElement | null>(null)
    const [gpx, setGpx] = useState<string>("")

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()

        if (gpx){
            const gpxData = new gpxParser()
            gpxData.parse(gpx)
            const tracks = gpxData.tracks[0].points.map(pos => [pos.lat, pos.lon])
            const waypoints: wayPointArray = gpxData.waypoints.map(waypoint => (
                {lat: waypoint.lat, lng: waypoint.lon, elevation: waypoint.ele, descript: waypoint.name}
            ))
            setGpxWaypoints(waypoints)
            setGpxTracks(tracks)
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
        }
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <label>
                Upload GPX file!
                <input type="file" accept=".gpx" ref={gpxRef} onChange={e => loadGPX(e.target.files)}/>
            </label>
            <br/>
            <button type='submit'>submit</button>
        </form>
    )
}