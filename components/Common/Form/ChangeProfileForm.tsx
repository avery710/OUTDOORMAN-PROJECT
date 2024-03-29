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
        <FormWrapper onSubmit={e => handleSubmit(e)}>
            <h3>Profile Information</h3>
            <Wrapper>
                <p>photo</p>
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
                    <Warning>
                        The image you are trying to upload is too big. 
                        Please resize it so that it is under 10MB.
                    </Warning>
                }
            </Wrapper>

            <Wrapper>
                <label htmlFor="textInput" style={{cursor: "pointer"}}>Name</label>
                <br/>
                <InputField type="text" id="textInput" onChange={e => InputChange(e)} placeholder={auther?.username}/>
            </Wrapper>

            <ButtonWrapper>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                <SubmitButton type='submit' ref={submitRef}>Submit</SubmitButton>
            </ButtonWrapper>
        </FormWrapper>
    )
}

const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

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

const Warning = styled.div`
    color: rgb(201, 74, 74);
    font-size: 14px;
    padding-top: 10px;
    padding-bottom: 10px;
`

const Wrapper = styled.div`
    padding-top: 10px;
    padding-bottom: 10px;
`

const ButtonWrapper = styled.div`
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
`

const CancelButton = styled.button`
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
    margin-right: 16px;
`

const SubmitButton = styled.button`
    border: 1px solid rgb(26, 137, 23);
    background-color: rgb(26, 137, 23);
    font-size: 14px;
    font-weight: 400;
    color: white;
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

const InputField = styled.input`
    width: 300px;
    height: 20px;
    border: none;
    font-size: 14px;
    border-bottom: 1px solid black;
    background-color: white;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    margin-top: 10px;

    &:focus {
        outline: none;
    }
`