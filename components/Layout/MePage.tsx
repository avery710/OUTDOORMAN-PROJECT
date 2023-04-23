import Header from "./Header"
import styled from "styled-components"
import Card from "../Common/Card/Card"
import { cardDataArray, cardDataType } from "types"
import Image from 'next/image'
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
                <LoadingWrapper>
                    <ImageWrapper>
                        <Image
                            src="/images/loading-effect.png"
                            alt="loading-image"
                            width={140}
                            height={30}
                        />
                    </ImageWrapper>
                </LoadingWrapper>
            }
        </>
    )
}

const Wrapper = styled.div`
    padding-bottom: 20px;
    border-top: 1px solid rgba(230, 230, 230, 1);
`

const LoadingWrapper = styled.div`
    width: 100%;
    height: 100%;
`

const ImageWrapper = styled.div`
    width: 140px;
    height: 30px;
    position: relative;
`