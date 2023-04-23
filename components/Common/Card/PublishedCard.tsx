import DeleteTooltip from 'components/Common/Form/DeleteTooltip'
import { doc, getDoc } from 'firebase/firestore'
import { useAuth } from 'hooks/context'
import { db } from 'lib/firebase'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { autherInfo, publishCardType } from 'types'
import AutherSection from './AutherSection'


interface Props {
    content: publishCardType,
    setDeleteId: Dispatch<SetStateAction<string>> | null,
    setOverlayDisplay: Dispatch<SetStateAction<string>> | null,
    auther: autherInfo | null,
}


export default function PublishedCard({ content, setDeleteId, setOverlayDisplay, auther }: Props){

    const { authUser } = useAuth()
    const { pathname } = useRouter()
    const [ tooltipDisplay, setTooltipDisplay ] = useState<boolean>(false)
    const buttonRef = useRef<HTMLButtonElement>(null)
    const [ autherPhotoUrl, setAutherPhotoUrl ] = useState<string>("")
    const [ autherName, setAutherName ] = useState<string>("")
    const [ autherUniqname, setAutherUniqname ] = useState<string>("")


    useEffect(() => {
        document.addEventListener('click', (e) => {
            if (!buttonRef.current?.contains(e.target as Node)){
                setTooltipDisplay(false)
            }
        })

        async function fetchAuther(){
            const docRef = doc(db, "users", content.userId)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                setAutherPhotoUrl(docSnap.data().photoUrl)
                setAutherName(docSnap.data().username)
                setAutherUniqname(docSnap.data().uniqname)
            }
        }

        fetchAuther()
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
                <AutherSection
                    autherName={autherName}
                    autherUniqname={autherUniqname}
                    autherPhotoUrl={autherPhotoUrl}
                />
            }

            <StoryWrapper>
                <LeftSection>
                    <LeftUpper href={`/${autherUniqname}/${content.url}`}>
                        <TitleWrapper>{content.title}</TitleWrapper>
                        <ContentWrapper>{content.editorTextContent}</ContentWrapper>
                    </LeftUpper>
                    <PublishDate>
                        Published on {content.date}
                        { ( authUser && authUser?.uniqname === auther?.uniqname ) &&
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
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    width: 100%;
`

const LeftSection = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const LeftUpper = styled.a`
    display: flex;
    flex-direction: column;
    text-decoration: none;
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