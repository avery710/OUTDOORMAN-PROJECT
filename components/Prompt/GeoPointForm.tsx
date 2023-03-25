import { useRef } from 'react'
import styled from 'styled-components';
import { geoPointType } from 'types'
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
        <FormWrapper onSubmit={e => handleSubmit(e)}>
            <Label>
                Latitude : 
                <InputField type="number" step="0.000000001" ref={latRef} onChange={e => handleChange(e)}/>
            </Label>
            <br/>
            <Label>
                Longtitude:
                <InputField type="number" step="0.000000001" ref={lngRef} onChange={e => handleChange(e)}/>
            </Label>
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
    font-size: 16px;
    font-weight: 500;
    display: flex;
    align-items: center;
`

const InputField = styled.input`
    width: 100px;
    height: 20px;
    border: none;
    font-size: 14px;
    border-bottom: 1px solid black;
    margin-left: 10px;
    background-color: white;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    margin-bottom: 6px;

    &:focus {
        outline: none;
    }
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