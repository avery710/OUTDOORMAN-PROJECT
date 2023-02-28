import { useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage"
import { storage } from 'lib/firebase'
import { v4 as uuidv4 } from 'uuid'
import { useRouter } from 'next/router'
import { useAuth } from 'hooks/context'

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
        <form onSubmit={e => handleSubmit(e)}>
            <label>
                Choose an image file.
                <br/>
                <input type="file" accept=".jpg, .jpeg, .png" onChange={e => loadImage(e.target.files)}/>
            </label>
            <div ref={warningRef} style={{ display: "none" }}>
                The image you are trying to upload is too big. 
                Please resize it so that it is under 10MB.
            </div>
            <br/>
            <button type='submit' ref={submitRef} disabled={true}>submit</button>
        </form>
    )
}