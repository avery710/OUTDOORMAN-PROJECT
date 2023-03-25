import Header from "./Header"
import styled from "styled-components"
import Card from "../Common/Card/Card"
import { storyCardType } from "types"


export default function MePage({ loaded, list, setDeleteId, setOverlayDisplay, headerTitle, path }: any){
    return (
        <>
            <Header title={headerTitle} />
            { loaded ?
                list && (
                    <Wrapper>
                        { list.map((content: storyCardType) => {
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
                <div>loading...</div>
            }
        </>
    )
}

const Wrapper = styled.div`
    padding-bottom: 20px;
    border-top: 1px solid rgba(230, 230, 230, 1);
`