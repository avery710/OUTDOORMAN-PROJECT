import styled from 'styled-components'
import Image from 'next/image'
import { Dispatch, SetStateAction } from 'react';

interface Props {
    overlayDisplay: string, 
    setOverlayDisplay: Dispatch<SetStateAction<string>>, 
    children: JSX.Element,
}

export default function OverlayPrompt({ overlayDisplay, setOverlayDisplay, children }: Props){

    function handleClose(){
        setOverlayDisplay("none")
    }

    return (
        <OverlayBackground display={overlayDisplay}>
            <OverlayContainer>
                <CloseButtonWrapper onClick={handleClose}>
                    <Image src="/x.png" alt="close-button" width={20} height={20}/>
                </CloseButtonWrapper>

                { children }
            </OverlayContainer>
        </OverlayBackground>
    )
}

interface overlayProps {
    display: string;
}

const OverlayBackground = styled.div<overlayProps>`
    height: 100vh;
    width: 100vw;
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 10000; /* Sit on top */
    background-color: rgb(0,0,0); /* Black fallback color */
    background-color: rgba(0,0,0, 0.7); /* Black w/opacity */
    overflow-x: hidden; /* Disable horizontal scroll */

    display: ${props => props.display};
    justify-content: center;
    align-items: center;
`

const OverlayContainer = styled.div`
    position: relative;
    height: fit-content;
    min-width: 400px;
    width: fit-content;
    padding: 44px 56px;
    background-color: rgba(255, 255, 255, 1);
    border-radius: 5px;

    display: flex;
    flex-direction: column;
    align-items: center;
`

const CloseButtonWrapper = styled.button`
    position: absolute;
    width: 20px;
    height: 20px;
    top: 13px;
    right: 13px;
    cursor: pointer;

    display: flex;
    justify-content: center;
    align-items: center;

    padding: 0;
    border: none;
    background-color: white;
`