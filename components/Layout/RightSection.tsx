import React from 'react'
import styled from 'styled-components'
import { recommendCardArray } from 'types'
import RecommendList from './RecommendList'

interface Props {
    recommendList: recommendCardArray
}

export default function RightSection({ recommendList }: Props) {
    return (
        <Wrapper>
            <RecommendList recommendList={recommendList}/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin-top: 50px;
    margin-bottom: 50px;
    margin-left: 50px;
    width: 100%;
    max-width: 310px;
    display: flex;
    flex-direction: column;
`