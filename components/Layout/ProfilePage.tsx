import styled from "styled-components"
import Header from "./Header"
import PublishedCard from "./PublishedCard"
import { publishCardType, publishCardArray, autherInfo } from "types"
import { Dispatch, SetStateAction } from "react"
import { useAuth } from "hooks/context"

interface Props {
    headerTitle: string,
    list: publishCardArray,
    setDeleteId: Dispatch<SetStateAction<string | undefined>>,
    setOverlayDisplay: Dispatch<SetStateAction<string>>,
    auther: autherInfo,
}


export default function ProfilePage({ headerTitle, list, setDeleteId, setOverlayDisplay, auther }: Props){
    
    return (
        <>
            <Header title={headerTitle} />
            { list && (
                <Wrapper>
                    { list.map((content: publishCardType) => {
                        return  <PublishedCard
                                    content={content}
                                    setDeleteId={setDeleteId}
                                    setOverlayDisplay={setOverlayDisplay}
                                    auther={auther}
                                    key={content.uuid}
                                />
                    })}
                </Wrapper>
            )}
        </>
    )
}

const Wrapper = styled.div`
    padding-bottom: 20px;
    border-top: 1px solid rgba(230, 230, 230, 1);
`