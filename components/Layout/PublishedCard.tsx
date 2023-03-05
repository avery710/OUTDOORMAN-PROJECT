import DeleteTooltip from 'components/Prompt/DeleteTooltip'
import { useAuth } from 'hooks/context'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { autherInfo, publishCardType } from 'types'


interface Props {
    content: publishCardType,
    setDeleteId: Dispatch<SetStateAction<string | undefined>>,
    setOverlayDisplay: Dispatch<SetStateAction<string>>,
    auther: autherInfo,
}


export default function PublishedCard({ content, setDeleteId, setOverlayDisplay, auther}: Props){

    const { authUser } = useAuth()
    const { pathname } = useRouter()
    const [ tooltipDisplay, setTooltipDisplay ] = useState<boolean>(false)
    const buttonRef = useRef<HTMLButtonElement>(null)


    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (!buttonRef.current?.contains(e.target as Node)){
                setTooltipDisplay(false)
            }
        })
    }, [])


    function handleToggle(){
        if (tooltipDisplay === true){
            setTooltipDisplay(false)
        }
        else {
            setTooltipDisplay(true)
        }
    }

    
    return (
        <CardWrapper>
            { pathname != '/[username]' && 
                <div>{auther.username}</div>
            }

            <StoryWrapper>
                <LeftSection>
                    <LeftUpper>
                        <Link href={`/${auther.uniqname}/${content.url}`}>
                            <TitleWrapper>{content.title}</TitleWrapper>
                            <ContentWrapper>{content.editorTextContent}</ContentWrapper>
                        </Link>
                    </LeftUpper>
                    <PublishDate>
                        Published on {content.date}
                        { ( authUser?.uniqname === auther.uniqname ) &&
                                <Button onClick={handleToggle} ref={buttonRef}>
                                    <Icon />
                                    <DeleteTooltip 
                                        tooltipDisplay={tooltipDisplay} 
                                        path="story"
                                        setOverlayDisplay={setOverlayDisplay}
                                        setDeleteId={setDeleteId}
                                        uuid={content.uuid}
                                    />
                                </Button>
                        }
                    </PublishDate>
                </LeftSection>
                
                <RightSection>
                    <ImageWrapper>
                        <Image
                            src={content.previewImageUrl}
                            alt='preview-img'
                            fill
                            style={{objectFit: "cover", objectPosition: "center"}}
                        />
                    </ImageWrapper>
                </RightSection>
            </StoryWrapper>
        </CardWrapper>
    )
}

const CardWrapper = styled.div`
    height: fit-content;
    width: 100%;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-top: 40px;
`

const StoryWrapper = styled.div`
    display: flex;
    justify-content: space-between;
`

const LeftSection = styled.div`
    display: flex;
    flex-direction: column;
`

const LeftUpper = styled.div`
    display: flex;
    flex-direction: column;
`

const PublishDate = styled.div`
    display: flex;
    padding: 32px 0px;
    font-size: 14px;
    font-weight: 400;
    color: rgba(117, 117, 117, 1);
    display: flex;
    align-items: center;
`

const RightSection = styled.div`
    margin-left: 60px;
`

const TitleWrapper = styled.div`
    font-weight: 700;
    font-size: 20px;
    line-height: 26px;
    overflow: hidden;
    padding-bottom: 10px;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
`

const ContentWrapper = styled.div`
    font-size: 15px;
    line-height: 22px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 3;
    font-weight: 400;
    color: rgba(41, 41, 41, 1);
`

const ImageWrapper = styled.div`
    width: 112px;
    height: 112px;
    position: relative;
    border-radius: 1px;
    background-color: rgba(0, 0, 0, 0.1);
    overflow: hidden;
`

const Button  = styled.button`
    height: 27px;
    width: 27px;
    border: none;
    background: none;
    cursor: pointer;
    position: relative;
`

const Icon = styled.i`
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
    height: 100%;
    width: 100%;
    background-image: url(/images/icons/more.svg);
    margin-top: 5px;
`