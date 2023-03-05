import { useRef, useState } from 'react'
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { storage } from 'lib/firebase'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import styled from 'styled-components'

export default function ImagePrompt({setOverlayDisplay, editor}: any) {

    const [ file, setFile ] = useState<File>()
    const submitRef = useRef<HTMLButtonElement>(null)
    const warningRef = useRef<HTMLDivElement>(null)
    
    const router = useRouter()
    const { storyId } = router.query


    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        
        e.preventDefault()

        if (file){
            // upload to storage and get the img url
            const imageRef = ref(storage, `stories/${storyId as string}/${file.name + uuidv4()}`)
            
            uploadBytes(imageRef, file).then((snapshot) => {
                getDownloadURL(snapshot.ref).then((url) => {
                    editor.chain().focus().setImage({ src: url }).run()
                })
            })
        }
        
        setOverlayDisplay("none")
    }
    
    function loadImage(files: FileList | null){

        if (files !== null) {
            
            if (submitRef.current && warningRef.current){
                if (files[0].size / (1024 * 1024) >= 10){
                    console.log("file size -> ", files[0].size)
                    submitRef.current.disabled = true
                    warningRef.current.style.display = "block"
                }
                else {
                    submitRef.current.disabled = false
                    warningRef.current.style.display = "none"
                    setFile(files[0])
                }
            }
            
        }
    }

    return (
        <FormWrapper onSubmit={e => handleSubmit(e)}>
            <h3>Choose an image file</h3>
            <Label>
                Upload file
                <Input type="file" accept=".jpg, .jpeg, .png" onChange={e => loadImage(e.target.files)}/>
            </Label>
            <FileName>{file && file.name}</FileName>
            
            <Warning ref={warningRef} style={{ display: "none" }}>
                The image you are trying to upload is too big. 
                <br/>
                Please resize it so that it is under 10MB.
            </Warning>
            <br/>
            <SubmitButton type='submit' ref={submitRef} disabled={true}>submit</SubmitButton>
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
    padding-top: 16px;
`

const Warning = styled.div`
    color: rgb(201, 74, 74);
    font-size: 14px;
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