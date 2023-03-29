import React, { useEffect, useRef } from 'react'
import styled from 'styled-components'
import Image from 'next/image'


export default function LandingPage(){

    const sectionOneRef = useRef<HTMLDivElement | null>(null)
    const sectionTwoRef = useRef<HTMLDivElement | null>(null)
    const sectionThreeRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {

        function handleScroll(){

            const windowPos = window.scrollY

            if (sectionOneRef.current && windowPos > 450){
                console.log("add")
                sectionOneRef.current.style.opacity = "1"
            }

            if (sectionTwoRef.current && windowPos > 450 + 605*0.85 + 170){
                sectionTwoRef.current.style.opacity = "1"
            }

            if (sectionThreeRef.current && windowPos > 450 + 605*0.85 + 200 + 658*0.85 + 130){
                sectionThreeRef.current.style.opacity = "1"
            }
        }
        
        window.removeEventListener('scroll', () => handleScroll())
        window.addEventListener('scroll', () => handleScroll())

        return () => window.removeEventListener('scroll', () => handleScroll())
        
    }, [])

    return (
        <>
        <ImageWrapper>
            <Image
                src="/images/landing-img.jpg"
                alt="landing-img"
                fill
                style={{objectFit: "cover", objectPosition: "center"}}
            />
            <SloganWrapper>
                <Image
                    src="/images/slogan.png"
                    alt="slogan"
                    fill
                    style={{objectFit: "cover", objectPosition: "center"}}
                />
            </SloganWrapper>
            <SloganWrapper2>
                <Image
                    src="/images/slogan-360.png"
                    alt="slogan"
                    fill
                    style={{objectFit: "cover", objectPosition: "center"}}
                />
            </SloganWrapper2>
        </ImageWrapper>

        <DetailWrapper>

            <DetailSection1 ref={sectionOneRef}>
                <ImageContainer1>
                    <Image 
                        src="/gif/gif-1-black.gif"
                        alt="gif"
                        fill
                        style={{objectFit: "contain", objectPosition: "center"}}
                    />
                </ImageContainer1>
                <Detail1>
                    <Title>Mark selected texts with geo location</Title>
                    <br/>
                    <Content>
                        While editing your stories, you can select texts and add geo location just as the way of adding links. The marker with description &#38; location will then show up on the map.
                    </Content>
                </Detail1>
            </DetailSection1>

            <DetailSection2 ref={sectionTwoRef}>
                <Detail2>
                    <Title>Add GPX waypoint description to text-editor</Title>
                    <br/>
                    <Content>
                        After uploading your GPX file to the map, you can add the descriptions of waypoints to the text-editor.
                    </Content>
                </Detail2>
                <ImageContainer2>
                    <Image 
                        src="/gif/gif-2-black.gif"
                        alt="gif"
                        fill
                        style={{objectFit: "contain", objectPosition: "center"}}
                    />
                </ImageContainer2>
                
            </DetailSection2>

            <DetailSection3 ref={sectionThreeRef}>
                <Detail3>
                    <Title>Read stories along with map</Title>
                    <br/>
                    <Content>
                        While reading the published stories, you can quickly grasp the precise location of what the texts are describing simply just by clicking the texts with geo-link.
                    </Content>
                </Detail3>
                <ImageContainer3>
                    <Image 
                        src="/gif/gif-3-black.gif"
                        alt="gif"
                        fill
                        style={{objectFit: "contain", objectPosition: "center"}}
                    />
                </ImageContainer3>
                
            </DetailSection3>

        </DetailWrapper>
        </>
    )
}

const ImageWrapper = styled.div`
    width: 100vw;
    height: calc(100vh - 65px);
    position: relative;
`

const SloganWrapper = styled.div`
    width: 572px;
    height: 99px;
    position: absolute;
    top: 30%;
    left: 10%;

    @media (min-width: 360px) and (max-width: 800px) {
        display: none;
    }

    @media (min-width: 800px) and (max-width: 2000px) {
        display: block;
    }
`

const SloganWrapper2 = styled.div`
    width: 351px;
    height: 242px;
    position: absolute;
    top: 30%;
    left: 10%;

    @media (min-width: 360px) and (max-width: 800px) {
        display: block;
    }

    @media (min-width: 800px) and (max-width: 2000px) {
        display: none;
    }
`

const DetailWrapper = styled.div`
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    background-color: black;
    padding-bottom: 100px;
    
    @media (min-width: 360px) and (max-width: 1200px) {
        padding-top: 100px;
    }
`

const DetailSection = styled.div`
    width: 80%;
    max-width: 1100px;
    height: auto;
    background-color: white;
    display: flex;
    align-items: center;
    position: relative;
    opacity: 0;
    transition: all 1s ease-in-out;
    padding-top: 180px;
    padding-bottom: 100px;
    background-color: black;
    color: white;

    @media (min-width: 360px) and (max-width: 1200px) {
        justify-content: center;
    }
`

const DetailSection1 = styled(DetailSection)`
    @media (min-width: 1200px) and (max-width: 2000px) {
        justify-content: flex-start;
    }
`

const DetailSection2 = styled(DetailSection)`
    @media (min-width: 1200px) and (max-width: 2000px) {
        justify-content: flex-end;
    }
`

const DetailSection3 = styled(DetailSection)`
    @media (min-width: 1200px) and (max-width: 2000px) {
        justify-content: center;
    }
`

const ImageContainer = styled.div`
    @media (min-width: 360px) and (max-width: 800px) {
        width: 100%;
        height: 100%;
    }

    z-index: 9;
`

const ImageContainer1 = styled(ImageContainer)`
    width: 720px;
    height: 509px;
    position: relative;
`

const ImageContainer2 = styled(ImageContainer)`
    width: 641px;
    height: 552px;
    position: relative;
`

const ImageContainer3 = styled(ImageContainer)`
    width: 644px;
    height: 508px;
    position: relative;
`

const Detail1 = styled.div`
    position: absolute;

    @media (min-width: 1400px) and (max-width: 2000px) {
        right: 50px;
        max-width: 450px;
        top: 360px;
    }

    @media (min-width: 1200px) and (max-width: 1400px) {
        right: 50px;
        width: 35%;
        top: 280px;
    }

    @media (min-width: 360px) and (max-width: 1200px) {
        top: 0;
        left: 0;
        width: 95%;
    }

    z-index: 10;
`

const Detail2 = styled.div`
    position: absolute;
    left: 0;
    
    @media (min-width: 1400px) and (max-width: 2000px) {
        top: 350px;
        max-width: 450px;
    }

    @media (min-width: 1200px) and (max-width: 1400px) {
        top: 300px;
        width: 35%;
    }

    @media (min-width: 360px) and (max-width: 1200px) {
        top: 0px;
        width: 95%;
    }

    z-index: 10;
`

const Detail3 = styled.div`
    position: absolute;

    @media (min-width: 1200px) and (max-width: 2000px) {
        top: 100px;
        width: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 70%;
    }

    @media (min-width: 360px) and (max-width: 1200px) {
        top: 0;
        left: 0;
        width: 95%;
    }

    z-index: 10;
`

const Title = styled.div`
    font-weight: 700;
    width: 93%;

    @media (min-width: 1200px) and (max-width: 2000px) {
        line-height: 50px;
        font-size: 36px;
    }

    @media (min-width: 360px) and (max-width: 1200px) {
        font-size: 30px;
    }
`

const Content = styled.div`
    font-size: 18px;
    line-height: 28px;

    @media (min-width: 360px) and (max-width: 1200px) {
        font-size: 16px;
    }
`