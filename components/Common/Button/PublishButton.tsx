import { Dispatch, SetStateAction } from "react"
import styled from "styled-components"

interface Props {
    setPublishOverlay: Dispatch<SetStateAction<string>>,
}

export default function PublishButton({ setPublishOverlay }: Props){

    function handlePublish(){
        setPublishOverlay("flex")
    }

    return (
        <Publish onClick={handlePublish}>
            Publish
        </Publish>
    )
}

const Publish = styled.button`
    border: none;
    background-color: #80ff80;
    color: black;
    width: 80px;
    height: 30px;
    border-radius: 15px;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    font-family: 'Montserrat';
    margin-right: 10px;
    margin-left: 14px;
    opacity: 0.9;

    &:hover {
        opacity: 1;
        transition: all .1s ease-in-out;
    }
`