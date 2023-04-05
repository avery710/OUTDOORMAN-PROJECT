import styled from "styled-components"
import { useAuth } from "hooks/context"

export default function GpxForm(){

    const { signInWithGoogle } = useAuth()

    function handleSignUp(){
        signInWithGoogle()
    }

    return (
        <Wrapper>
            <Title>Welcome to the Playground!</Title>
            <ContentWrapper>
                The playground is a demo environment where you can try out main features. Sign up to write and publish your own story!
            </ContentWrapper>
            <Button onClick={handleSignUp}>
                <GoogleIcon/>Sign up with Google
            </Button>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const Title = styled.h2`
    color: black;
`

const ContentWrapper = styled.div`
    font-size: 14px;
    text-align: center;
    line-height: 24px;
    max-width: 450px;
`

const Button = styled.button`
    width: 200px;
    height: 40px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
    margin-bottom: 30px;
    border-radius: 20px;
    border: 1px solid rgba(0, 0, 0, 0.7);
    background-color: white;
    cursor: pointer;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
`

const GoogleIcon = styled.i`
    background-size: contain;
    background-repeat: no-repeat;
    display: inline-block;
    height: 20px;
    width: 20px;
    margin-right: 8px;
    background-image: url(/images/icons/google-logo.png);
`