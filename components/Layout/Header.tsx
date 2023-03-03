import styled from "styled-components"

interface Props {
    title: string
}

export default function Header({ title }: Props) {
    return (
        <Wrapper>
            <TitleWrapper>
                {title}
            </TitleWrapper>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin-top: 50px;
    margin-bottom: 50px;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
`

const TitleWrapper = styled.div`
    font-weight: 700;
    font-size: 40px;
`