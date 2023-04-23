import React from 'react'
import styled from 'styled-components'
import Image from 'next/image'

export default function LoadingEffect(){
    return (
        <Wrapper>
            <ImageWrapper>
                <Image
                    src="/images/loading-effect.png"
                    alt="loading-image"
                    width={140}
                    height={30}
                />
            </ImageWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
`

const ImageWrapper = styled.div`
    width: 140px;
    height: 30px;
    position: relative;
`