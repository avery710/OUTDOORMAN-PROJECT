import { cardDataType } from "types"
import { db } from '../../lib/firebase'
import { doc, deleteDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"

export default function DeletePlanForm({ setOverlayDisplay, deleteId, list, setList }: any){
    const { authUser } = useAuth()

    function handleCancel(){
        setOverlayDisplay("none")
    }

    async function handleDelete(){
        setList(list.filter((plan: cardDataType) => plan.uuid != deleteId))
        setOverlayDisplay("none")

        if (authUser && authUser.uid){
            // delete in db
            await deleteDoc(doc(db, "users", authUser.uid, "plans", deleteId))
            console.log("delete")
        }
    }

    return (
        <div>
            <h2>Delete Plan</h2>
            <div>
                Deletion is not reversible, and the plan will be completely deleted. Do you really want to delete?
            </div>
            <div>
                <button onClick={handleCancel}>Cancel</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
        </div>
    )
}