import { useRef } from 'react'
import { geoPointType } from 'types'

export default function GeoPointForm({setGeoPointData, setOverlayDisplay}: any) {
    const latRef = useRef<HTMLInputElement | null>(null)
    const lngRef = useRef<HTMLInputElement | null>(null)
    const descriptRef = useRef<HTMLInputElement | null>(null)

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()

        if (latRef.current && lngRef.current && descriptRef.current){
            const newGeoPoint: geoPointType = {
                lat: Number(latRef.current.value),
                lng: Number(lngRef.current.value),
                descript: descriptRef.current.value,
            }
            console.log(newGeoPoint)
            
            // save input data & propagate data to map and editor
            setGeoPointData(newGeoPoint)

            // set overlay prompt disappear
            setOverlayDisplay("none")
        }
    }

    function handleChange(e: React.ChangeEvent<HTMLInputElement>){
        // regular expression
        const val = e.target.value
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <label>
                Latitude:
                <input type="number" step="0.000000001" ref={latRef} onChange={e => handleChange(e)}/>
            </label>
            <br/>
            <label>
                Longtitude:
                <input type="number" step="0.000000001" ref={lngRef} onChange={e => handleChange(e)}/>
            </label>
            <br/>
            <label>
                Short Description:
                <input type="text" ref={descriptRef} onChange={e => handleChange(e)}/>
            </label>
            <br/>

            <button type='submit'>submit</button>
        </form>
    )
}