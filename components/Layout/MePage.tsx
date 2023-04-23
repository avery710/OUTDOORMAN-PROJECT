import Header from "./Header"
import styled from "styled-components"
import Card from "../Common/Card/Card"
import { cardDataArray, cardDataType } from "types"
import LoadingEffect from "components/Common/Loading/LoadingEffect"
import { Dispatch, SetStateAction } from "react"

interface Props {
    loaded: boolean, 
    list: cardDataArray | null, 
    setDeleteId: Dispatch<SetStateAction<string>>, 
    setOverlayDisplay: Dispatch<SetStateAction<string>>, 
    headerTitle: string, 
    path: string,
}

export default function MePage({ 
    loaded, 
    list, 
    setDeleteId, 
    setOverlayDisplay, 
    headerTitle, 
    path }: Props){

    return (
        <>
            <Header title={headerTitle} />
            { loaded ?
                list && (
                    <Wrapper>
                        { list.map((content: cardDataType) => {
                            return <Card 
                                        title={content.title} 
                                        uuid={content.uuid} 
                                        date={content.date} 
                                        setDeleteId={setDeleteId}
                                        setOverlayDisplay={setOverlayDisplay}
                                        key={content.uuid}
                                        path={path}
                                    />
                            })
                        }
                    </Wrapper>
                )
                :
                <div style={{width: "100%", height: "100%"}}>
                    <LoadingEffect/>
                </div>
            }
        </>
    )
}

const Wrapper = styled.div`
    padding-bottom: 20px;
    border-top: 1px solid rgba(230, 230, 230, 1);
`