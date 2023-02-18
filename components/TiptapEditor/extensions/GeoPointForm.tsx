import { useRef } from 'react'
import { geoPointType } from 'types'
// import { uuid } from 'uuidv4'
import { v4 as uuidv4 } from 'uuid';

export default function GeoPointForm({geoPoints, setGeoPoints, setOverlayDisplay, editor}: any) {
    const latRef = useRef<HTMLInputElement | null>(null)
    const lngRef = useRef<HTMLInputElement | null>(null)

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()

        const lat = latRef.current?.value
        const lng = lngRef.current?.value
        const {from, to} = editor.view.state.selection
        const descript = editor.state.doc.textBetween(from, to, '')
        const key = uuidv4()


        if (lat && lng && descript){
            const newGeoPoint: geoPointType = {
                lat: Number(lat),
                lng: Number(lng),
                descript: descript,
                uuid: key,
            }
            console.log(newGeoPoint)
            
            // save input data & add to the public ARRAY
            if (geoPoints){
                setGeoPoints([...geoPoints, newGeoPoint])
            }
            else {
                setGeoPoints([newGeoPoint])
            }
            
            editor.chain().focus().setGeoLink(newGeoPoint).run()

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
            <button type='submit'>submit</button>
        </form>
    )
}