import { cardDataType, publishCardType } from "types"
import { db } from '../../../lib/firebase'
import { doc, deleteDoc } from "firebase/firestore"
import { useAuth } from "hooks/context"
import styled from "styled-components"

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
        <Wrapper>
            <h3>Delete published story</h3>
            <div>
                Deletion is not reversible, and the story will be completely deleted. 
                <br/>
                Do you really want to delete the story?
            </div>
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