import { cardDataArray, cardDataType } from "types"
import { db } from '../../../lib/firebase'
import { doc, deleteDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"
import styled from "styled-components"
import { Dispatch, SetStateAction } from "react"

interface Props {
    setOverlayDisplay: Dispatch<SetStateAction<string>>,
    deleteId: string, 
    list: cardDataArray | null, 
    setList: Dispatch<SetStateAction<cardDataArray | null>>, 
    path: string,
}

export default function DeletePlanForm({ setOverlayDisplay, deleteId, list, setList, path }: Props){
    
    const { authUser } = useAuth()

    function handleCancel(){
        setOverlayDisplay("none")
    }

    async function handleDelete(){
        
        if (list){
            setList(list.filter((draft: cardDataType) => draft.uuid != deleteId))
        }
        
        setOverlayDisplay("none")

        if (authUser && authUser.uid){

            // delete in db
            if (path === "plan"){
                await deleteDoc(doc(db, "users", authUser.uid, "plans", deleteId))
            }
            else if (path === "draft"){
                await deleteDoc(doc(db, "users", authUser.uid, "stories-edit", deleteId))
            }
            
        }
    }

    return (
        <Wrapper>
            <h3>Delete {path}</h3>
            <Prompt>
                Deletion is not reversible, and the {path} will be completely deleted. 
                <br/>
                Do you really want to delete the {path}?
            </Prompt>
            <ButtonWrapper>
                <CancelButton onClick={handleCancel}>Cancel</CancelButton>
                <SubmitButton onClick={handleDelete}>Delete</SubmitButton>
            </ButtonWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const ButtonWrapper = styled.div`
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
`

const Prompt = styled.div`
    text-align: center;
`

const CancelButton = styled.button`
    border: 1px solid rgb(201, 74, 74);
    background-color: white;
    font-size: 14px;
    font-weight: 400;
    color: rgb(201, 74, 74);
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
    border: 1px solid rgb(201, 74, 74);
    background-color: rgb(201, 74, 74);
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