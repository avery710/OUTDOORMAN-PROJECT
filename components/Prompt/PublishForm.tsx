import { addDoc, doc, collection, setDoc, getDoc, deleteDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"
import { db } from "lib/firebase"
import { useRouter } from "next/router"


export default function PublishButton({ setPublishOverlay }: any){

    const router = useRouter()
    const { storyId } = router.query
    const { authUser } = useAuth()


    function handleCancel(){
        setPublishOverlay("none")
    }


    async function handlePublish(){

        if (authUser && authUser.uid && storyId){

            const docRef = doc(db, "users", authUser.uid, "stories-edit", storyId as string)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()){

                const data = docSnap.data()

                // save to users -> published
                const userDoc = doc(db, "users", authUser.uid)
                const userPublishDoc = await setDoc(doc(userDoc, "published", storyId as string), {
                    data: null,
                })

                // open a new doc & save details in published -> article uuid
                const publishedDoc = doc(db, "published", storyId as string)
                await setDoc(publishedDoc, {
                    uniqname: authUser.uniqname,
                    drawLayer: data.drawLayer,
                    gpxLayer: data.gpxLayer,
                    geoPointLayer: data.geoPointLayer,
                    editorContent: data.editorContent,
                    url: (data.title.replace(/\s/g, '-')).concat("-", storyId as string),
                    title: data.title,
                    date: data.date,
                    ms: data.ms,
                    userId: authUser.uid,
                })


                // // delete draft in users -> stories-edit
                // await deleteDoc(doc(db, "users", authUser.uid, "stories-edit", storyId as string))
                // console.log("delete")
            }
            

            // return redirect to profile page
            router.push(`/${authUser.uniqname}/`)
        }

        setPublishOverlay("none")

    }
    

    return (
        <div>
            <h2>Publishing to: {authUser?.username}</h2>
            <div>
                Once you publish the story, your article will be public to everyone. 
                Do you really want to publish the story?
            </div>
            <div>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handlePublish}>Publish</button>
            </div>
        </div>
    )
}