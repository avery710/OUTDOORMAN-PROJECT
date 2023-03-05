import { cardDataType } from "types"
import { db } from '../../lib/firebase'
import { doc, deleteDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"

export default function DeletePlanForm({ setOverlayDisplay, deleteId, list, setList, path }: any){
    const { authUser } = useAuth()

    function handleCancel(){
        setOverlayDisplay("none")
    }

    async function handleDelete(){
        setList(list.filter((draft: cardDataType) => draft.uuid != deleteId))
        setOverlayDisplay("none")

        if (authUser && authUser.uid){

            // delete in db
            if (path === "plan"){
                await deleteDoc(doc(db, "users", authUser.uid, "plans", deleteId))
                console.log("delete")
            }
            else if (path === "draft"){
                await deleteDoc(doc(db, "users", authUser.uid, "stories-edit", deleteId))
                console.log("delete")
            }
            
        }
    }

    return (
        <div>
            <h2>Delete {path}</h2>
            <div>
                Deletion is not reversible, and the {path} will be completely deleted. 
                Do you really want to delete the {path}?
            </div>
            <div>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}