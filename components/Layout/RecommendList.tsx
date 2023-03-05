import React, { useEffect } from 'react'
import styled from 'styled-components'
import { recommendCardArray, recommendCardType } from 'types'
import { v4 } from 'uuid'
import RecommendCard from './RecommendCard'

interface Props {
    recommendList: recommendCardArray,
}

export default function RecommendList({ recommendList }: Props) {

    return recommendList && (
        <RecommendWrap>
            <RecommendHeader>Recommend Reading</RecommendHeader>
            {recommendList.map((content: recommendCardType) => {
                return <RecommendCard
                            content={content}
                            key={v4()}
                        />
            })}
        </RecommendWrap>
    )
}

const RecommendWrap = styled.div`
    margin-bottom: 50px;
`

const RecommendHeader = styled.div`
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    padding-bottom: 20px;
`