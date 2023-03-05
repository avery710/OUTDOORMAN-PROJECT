import React from 'react'
import styled from 'styled-components'
import { publishCardArray, publishCardType } from 'types'
import PublishedCard from './PublishedCard'

interface Props {
    published: publishCardArray
}

export default function IndexLeftSection({ published }: Props) {
    return published && (
        <Wrapper>
            { published.map((content: publishCardType) => {
                return  <PublishedCard
                            content={content}
                            setDeleteId={null}
                            setOverlayDisplay={null}
                            auther={null}
                            key={content.uuid}
                        />
            })}
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin-top: 10px;
`