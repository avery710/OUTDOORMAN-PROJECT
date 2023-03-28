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

            if (sectionOneRef.current && windowPos > 150){
                console.log("add")
                sectionOneRef.current.style.opacity = "1"
            }

            if (sectionTwoRef.current && windowPos > 200 + 605*0.85 + 150){
                sectionTwoRef.current.style.opacity = "1"
            }

            if (sectionThreeRef.current && windowPos > 200 + 605*0.85 + 200 + 658*0.85 + 150){
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
                src="/images/landing-page-cover.jpg"
                alt="landing-img"
                fill
                style={{objectFit: "cover", objectPosition: "center"}}
            />
        </ImageWrapper>

        <DetailWrapper>

            <DetailSection style={{justifyContent: "flex-start"}} ref={sectionOneRef}>
                <Image 
                    src="/gif/gif-1.gif"
                    alt="gif"
                    width={1715*0.42}
                    height={1212*0.42}
                    
                />
                <Details style={{right: "0"}}>
                    <div style={{width: "100%", height: "70px"}}></div>
                    <Title>Mark selected texts <br/>with geo location</Title>
                    <br/>
                    <Content>
                        While editing your stories, you can select texts and add geo location just as the way of adding links. The marker with description &#38; location will then show up on the map. Besides, your afterwards modification of texts will be syncing on the map.
                    </Content>
                </Details>
            </DetailSection>

            <DetailSection style={{justifyContent: "flex-end"}} ref={sectionTwoRef}>
                <Details style={{left: "0"}}>
                    <div style={{width: "100%", height: "45px"}}></div>
                    <Title>Upload GPX file &#38; add waypoint description <br/>to text-editor</Title>
                    <br/>
                    <Content>
                        After uploading your GPX file to the map, you can add the descriptions of waypoints to the text-editor. Next time when you click on the added text, the map will centralize the corresponding marker.
                    </Content>
                </Details>
                <Image 
                    src="/gif/gif-2.gif"
                    alt="gif"
                    width={1526*0.42}
                    height={1315*0.42}
                />
            </DetailSection>

            <DetailSection ref={sectionThreeRef}>
                <Details style={{top: "70px", width: "100%", textAlign: "center"}}>
                    <Title>Read the stories along with map</Title>
                    <br/>
                    <Content>
                        While reading the published stories, you can quickly grasp the precise location of <br/>what the texts are describing simply just by clicking the texts with geo-link.
                    </Content>
                </Details>
                <div style={{width: "300px", height: "100%"}}></div>
                <Image 
                    src="/gif/gif-3.gif"
                    alt="gif"
                    width={1534*0.42}
                    height={1211*0.42}
                />
            </DetailSection>

        </DetailWrapper>
        </>
    )
}

const ImageWrapper = styled.div`
    width: 100vw;
    height: calc(100vh - 65px);
    position: relative;
`

const DetailWrapper = styled.div`
    width: 100vw;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
`

const DetailSection = styled.div`
    width: 80%;
    max-width: 1200px;
    height: auto;
    background-color: white;
    display: flex;
    align-items: center;
    position: relative;
    padding-top: 100px;
    padding-bottom: 100px;
    opacity: 0;
    transition: all 1s ease-in-out;
`

const Details = styled.div`
    width: 500px;
    position: absolute;
`

const Title = styled.div`
    font-size: 36px;
    font-weight: 700;
`

const Content = styled.div`
    font-size: 18px;
    line-height: 28px;
`