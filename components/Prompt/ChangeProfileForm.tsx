import { ChangeEvent, Dispatch, SetStateAction, useRef, useState } from 'react'
import styled from 'styled-components'
import Image from "next/image"
import { useRouter } from 'next/router'
import { useAuth } from 'hooks/context'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { db, storage } from 'lib/firebase'
import { doc, updateDoc } from 'firebase/firestore'
import { autherInfo } from 'types'


interface Props {
    setOverlayDisplay: Dispatch<SetStateAction<string>>,
    auther: autherInfo,
    setProfileUrl: Dispatch<SetStateAction<string>>,
    setUsername: Dispatch<SetStateAction<string>>,
}


export default function ChangeProfileForm({ setOverlayDisplay, auther, setProfileUrl, setUsername }: Props) {

    const { authUser } = useAuth()
    const router = useRouter()

    const [ file, setFile ] = useState<File>()
    const [ warning, setWarning ] = useState<boolean>(false)
    const [ imagePreview, setImagePreview ] = useState<boolean>(false)
    const [ previewUrl, setPreviewUrl ] = useState<string>("")
    const [ name, setName ] = useState<string>("")
    const submitRef = useRef<HTMLButtonElement>(null)


    function handleCancel(){
        setOverlayDisplay("none")
        setImagePreview(false)
        setPreviewUrl("")
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        
        e.preventDefault()

        if (file){
            // upload to storage and get the img url
            const imageRef = ref(storage, `users/${authUser?.uid}/profile-pic`)

            const snapshot = await uploadBytes(imageRef, file)
            const url = await getDownloadURL(snapshot.ref)
            const storageUrl = url

            if (authUser && authUser.uid){

                const docRef = doc(db, "users", authUser.uid)
                await updateDoc(docRef, {
                    "photoUrl": storageUrl,
                })
            }

            setProfileUrl(storageUrl)
        }

        if (name){
            if (authUser && authUser.uid){

                const docRef = doc(db, "users", authUser.uid)
                await updateDoc(docRef, {
                    "username": name,
                })
            }

            setUsername(name)
        }

        setOverlayDisplay("none")
    }

    function loadImage(files: FileList | null){

        if (files !== null) {

            if (submitRef.current && files[0]){
                if (files[0].size / (1024 * 1024) >= 10){
                    console.log("file size -> ", files[0].size)
                    setWarning(true)
                    submitRef.current.disabled = true
                }
                else {
                    setWarning(false)
                    setFile(files[0])
                    setImagePreview(true)
                    setPreviewUrl(URL.createObjectURL(files[0]))
                    submitRef.current.disabled = false
                }
            }
        }
    }

    function InputChange(e: ChangeEvent<HTMLInputElement>){
        setName(e.target.value)
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <h3>Profile Information</h3>
            <div>
                photo
                <PreviewPlaceholder>
                    { (imagePreview && previewUrl) ?
                        <Image 
                            src={previewUrl} 
                            fill alt="preview-image" 
                            style={{objectFit: "cover", objectPosition: "center"}}
                        />
                        :
                        <Image 
                            src={auther?.photoUrl} 
                            fill alt="preview-image" 
                            style={{objectFit: "cover", objectPosition: "center"}}
                        />
                    }
                </PreviewPlaceholder>
                <Update>
                    <label htmlFor="files" style={{cursor: "pointer"}}>Update</label>
                    <input type="file" id="files" style={{visibility: "hidden"}} accept=".jpg, .jpeg, .png" onChange={e => loadImage(e.target.files)}/>
                </Update>
                { warning && 
                    <div>
                        The image you are trying to upload is too big. 
                        Please resize it so that it is under 10MB.
                    </div>
                }
            </div>

            <div>
                <label htmlFor="textInput" style={{cursor: "pointer"}}>Name</label>
                <br/>
                <input type="text" id="textInput" onChange={e => InputChange(e)} placeholder={auther?.username}/>
            </div>

            <button onClick={handleCancel}>Cancel</button>
            <button type='submit' ref={submitRef}>Publish</button>
        </form>
    )
}

const PreviewPlaceholder = styled.div`
    width: 88px;
    height: 88px;
    border-radius: 44px;
    background-color: rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Update = styled.div`
    background-color: white;
    color: rgba(26, 137, 23, 1);
    border: none;
    cursor: pointer;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    font-weight: 500;
    padding: 5px 0px;
`