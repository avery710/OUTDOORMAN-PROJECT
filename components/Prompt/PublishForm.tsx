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


                // // delete draft in users -> stories-edit
                // await deleteDoc(doc(db, "users", authUser.uid, "stories-edit", storyId as string))
                // console.log("delete")

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
        <form onSubmit={e => handlePublish(e)}>
            <h3>Story Preview</h3>
            <PreviewPlaceholder>
                Upload a preview image to make your story more inviting to readers.
                { (imagePreview && previewUrl) &&
                    <Image 
                        src={previewUrl} 
                        fill alt="preview-image" 
                        style={{objectFit: "cover", objectPosition: "center"}}
                    />
                }
            </PreviewPlaceholder>
            <input type="file" accept=".jpg, .jpeg, .png" onChange={e => loadImage(e.target.files)}/>
            { warning && 
                <div>
                    The image you are trying to upload is too big. 
                    Please resize it so that it is under 10MB.
                </div>
            }

            <h3>Publishing to: {authUser?.username}</h3>
            <div>
                Once you publish the story, your article will be public to everyone. 
                Do you really want to publish the story?
            </div>
            <div>
                <button onClick={handleCancel}>Cancel</button>
                <button type='submit' ref={publishRef} disabled={true}>Publish</button>
            </div>
        </form>
    )
}

const PreviewPlaceholder = styled.div`
    width: 300px;
    height: 200px;
    background-color: rgba(0, 0, 0, 0.1);
    aspect-ratio: 1/1;
    overflow: hidden;
    position: relative;
    border-radius: 3px;
    display: flex;
    justify-content: center;
    align-items: center;
`