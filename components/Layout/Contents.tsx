import { useRouter } from 'next/router'
import React from 'react'
import styled from 'styled-components'
import Card from './Card'


export default function Contents({ list, setDeleteId, setOverlayDisplay, path }: any) {

    const router = useRouter()
    
    return list && (
        <Wrapper>
            { list.map((content: any) => {
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
}

const Wrapper = styled.div`
    padding-bottom: 20px;
    border-top: 1px solid rgba(230, 230, 230, 1);
`