import Navbar from './Navbar'
import styled from 'styled-components'


interface LayoutProps {
    leftComponent: JSX.Element | JSX.Element[],
    rightComponent: JSX.Element | JSX.Element[],
}


const Layout = ({ leftComponent, rightComponent }: LayoutProps) => {
    return (
        <>
            <Navbar />
            <ContentWrapper>
                <Container>
                    <LeftSection>
                        {leftComponent}
                    </LeftSection>
                    <RightSection>
                        {rightComponent}
                    </RightSection>
                </Container>
            </ContentWrapper>
        </>
    )
}

export default Layout

const ContentWrapper = styled.div`
    width: 100vw;
    min-height: calc(100vh - 65px);
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: center;
    // background-color: red;
`

const Container = styled.div`
    width: 95%;
    max-width: 1200px;
    min-height: calc(100vh - 60px);
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    height: fit-content;
`


const LeftSection = styled.div`
    max-width: 680px;
    min-height: calc(100vh - 60px);
    height: fit-content;
    width: 100%;
    // background-color: blue;
`

const RightSection = styled.div`
    max-width: 360px;
    min-height: calc(100vh - 60px);
    height: fit-content;
    width: 100%;
    display: none;
    border-left: 1px solid rgba(230, 230, 230, 1);
    // background-color: black;

    @media (min-width: 900px) and (max-width: 2000px) {
        display: block;
    }
`