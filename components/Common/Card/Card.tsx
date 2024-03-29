import DeleteTooltip from 'components/Common/Form/DeleteTooltip'
import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import styled from 'styled-components'

interface Props {
    title: string, 
    uuid: string, 
    date: string, 
    setDeleteId: Dispatch<SetStateAction<string>>, 
    setOverlayDisplay: Dispatch<SetStateAction<string>>, 
    path: string,
}

export default function Card({ title, uuid, date, setDeleteId, setOverlayDisplay, path }: Props){

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
        <CardContainer>
            <TitleWrapper href={path === "draft" ? `/new-story/${uuid}` : `/${path}/${uuid}`}>
                {title}
            </TitleWrapper>
            <InfoWrapper>
                <LastEdit>Last edited {date}</LastEdit>
                <Button onClick={handleToggle} ref={buttonRef}>
                    <Icon />
                    <DeleteTooltip 
                        tooltipDisplay={tooltipDisplay} 
                        path={path}
                        setOverlayDisplay={setOverlayDisplay}
                        setDeleteId={setDeleteId}
                        uuid={uuid}
                    />
                </Button>
            </InfoWrapper>
        </CardContainer>
    )
}


const CardContainer = styled.div`
    height: fit-content;
    width: 100%;
    border-bottom: 1px solid rgba(230, 230, 230, 1);
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding-top: 20px;
    padding-bottom: 20px;
`

const TitleWrapper = styled.a`
    height: 30px;
    font-weight: 700;
    font-size: 16px;
    display: flex;
    align-items: center;
    text-decoration: none;
`

const InfoWrapper = styled.div`
    color: #B0B0B0;
    display: flex;
    align-items: center;
    height: 30px;
    position: relative;
`

const LastEdit = styled.div`
    font-size: 14px;
    font-weight: 400;
    color: rgba(117, 117, 117, 1);
    margin-right: 5px;
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