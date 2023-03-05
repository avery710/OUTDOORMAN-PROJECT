import { addDoc, doc, collection, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { getDownloadURL, ref, uploadBytes } from "firebase/storage"
import { useAuth } from "hooks/context"
import { db, storage } from "lib/firebase"
import { useRouter } from "next/router"
import { useRef, useState } from "react"
import styled from "styled-components"
import Image from "next/image"


export default function PublishButton({ setPublishOverlay }: any){

    const router = useRouter()
    const { storyId } = router.query
    const { authUser } = useAuth()

    const [ file, setFile ] = useState<File>()
    const [ warning, setWarning ] = useState<boolean>(false)
    const [ imagePreview, setImagePreview ] = useState<boolean>(false)
    const [ previewUrl, setPreviewUrl ] = useState<string>("")
    const publishRef = useRef<HTMLButtonElement>(null)


    function handleCancel(){
        setPublishOverlay("none")
        setImagePreview(false)
        setPreviewUrl("")
    }


    async function handlePublish(e: React.FormEvent<HTMLFormElement>){

        e.preventDefault()

        let storageUrl = ""

        if (file){
            // upload to storage and get the img url
            const imageRef = ref(storage, `stories/${storyId as string}/preview`)

            const snapshot = await uploadBytes(imageRef, file)
            const url = await getDownloadURL(snapshot.ref)
            storageUrl = url
        }
        
        if (authUser && authUser.uid && storyId){

            const docRef = doc(db, "users", authUser.uid, "stories-edit", storyId as string)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){

                const data = docSnap.data()

                // save to users -> published
                const userDoc = doc(db, "users", authUser.uid)
                await setDoc(doc(userDoc, "published", storyId as string), {
                    data: null,
                })

                // open a new doc & save details in published -> article uuid
                const publishedDoc = doc(db, "published", storyId as string)
                await setDoc(publishedDoc, {
                    uniqname: authUser.uniqname,
                    userId: authUser.uid,
                    drawLayer: data.drawLayer,
                    gpxLayer: data.gpxLayer,
                    geoPointLayer: data.geoPointLayer,
                    editorContent: data.editorContent,
                    editorTextContent: data.editorTextContent,
                    url: (data.title.replace(/\s/g, '-')).concat("-", storyId as string),
                    title: data.title,
                    date: data.date,
                    ms: data.ms,
                    previewImageUrl: storageUrl,
                })

                // detete unused photo
            }
            
            // return redirect to profile page
            router.push(`/${authUser.uniqname}/`)
        }

        setPublishOverlay("none")
    }


    function loadImage(files: FileList | null){

        if (files !== null) {

            if (publishRef.current && files[0]){
                if (files[0].size / (1024 * 1024) >= 10){
                    console.log("file size -> ", files[0].size)
                    setWarning(true)
                    publishRef.current.disabled = true
                }
                else {
                    setWarning(false)
                    setFile(files[0])
                    setImagePreview(true)
                    setPreviewUrl(URL.createObjectURL(files[0]))
                    publishRef.current.disabled = false
                }
            }
        }
    }
    

    return (
        <FormWrapper onSubmit={e => handlePublish(e)}>
            <h3>Story Preview</h3>
            <Prompt>Upload a preview image to make your story more inviting to readers.</Prompt>
            <PreviewPlaceholder>
                { (imagePreview && previewUrl) &&
                    <Image 
                        src={previewUrl} 
                        fill alt="preview-image" 
                        style={{objectFit: "cover", objectPosition: "center"}}
                    />
                }
            </PreviewPlaceholder>
            <Label>
                Upload Image
                <Input type="file" accept=".jpg, .jpeg, .png" onChange={e => loadImage(e.target.files)}/>
            </Label>
            
            { warning && 
                <Warning>
                    The image you are trying to upload is too big. 
                    <br/>
                    Please resize it so that it is under 10MB.
                </Warning>
            }

            <h3>Publishing to: {authUser?.username}</h3>
            <div>
                Once you publish the story, your article will be public to everyone. 
                <br/>
                Do you really want to publish the story?
            </div>
            <ButtonWrapper>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                <SubmitButton type='submit' ref={publishRef} disabled={true}>Publish</SubmitButton>
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
    width: 300px;
    height: 200px;
    background-color: rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
`

const Prompt = styled.div`
    font-size: 16px;
    padding-bottom: 14px;
`

const Label = styled.label`
    padding-top: 10px;
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

const Warning = styled.div`
    color: rgb(201, 74, 74);
    font-size: 14px;
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