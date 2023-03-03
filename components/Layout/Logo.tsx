import Image from 'next/image'
import styled from 'styled-components'


export default function Logo(){
    return (
        <LogoWrapper>
            <Image 
                src='/images/icons/outdoorman-logo-3.png'
                alt='outdoorman project' 
                fill
                style={{objectFit: "cover", objectPosition: "center"}}
            />
        </LogoWrapper>
    )
}

const LogoWrapper = styled.div`
    height: 30px;
    width: 143.5px;
    position: relative;
`