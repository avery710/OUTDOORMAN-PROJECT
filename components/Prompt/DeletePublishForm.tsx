import { cardDataType, publishCardType } from "types"
import { db } from '../../lib/firebase'
import { doc, deleteDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"

export default function DeletePublishForm({ setOverlayDisplay, deleteId, list, setList }: any){
    
    const { authUser } = useAuth()

    function handleCancel(){
        setOverlayDisplay("none")
    }

    async function handleDelete(){
        setList(list.filter((publishedStory: publishCardType) => publishedStory.uuid != deleteId))
        setOverlayDisplay("none")

        if (authUser && authUser.uid){
            
            // delete in db -> published 
            await deleteDoc(doc(db, "users", authUser.uid, "published", deleteId))

            // delete in db  -> user -> published
            await deleteDoc(doc(db, "published", deleteId))
        }
    }

    return (
        <div>
            <h2>Delete published story</h2>
            <div>
                Deletion is not reversible, and the story will be completely deleted. 
                Do you really want to delete the story?
            </div>
            <div>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}