import styled from 'styled-components'
import { useAuth } from 'hooks/context'

export function SignInForm({ setSignInForm }: any){
    function handleToggle(){
        setSignInForm(false)
    }

    const { signInWithGoogle } = useAuth()

    function handleSignIn(){
        signInWithGoogle()
    }

    return (
        <Wrapper>
            <Title>Welcome Back!</Title>
            <Button onClick={handleSignIn}>
                <GoogleIcon/>
                Sign in with Google
            </Button>
            <Prompt>
                No account? <ToggleButton onClick={handleToggle}>Create One</ToggleButton>
            </Prompt>
        </Wrapper>
    )
}

export function SignUpForm({ setSignInForm }: any){
    function handleToggle(){
        setSignInForm(true)
    }

    const { signInWithGoogle } = useAuth()

    function handleSignUp(){
        signInWithGoogle()
    }

    return (
        <Wrapper>
            <Title>Join Outdoorman Project!</Title>
            <Button onClick={handleSignUp}>
                <GoogleIcon/>
                Sign up with Google
            </Button>
            <Prompt>
                Already have an account? 
                <ToggleButton onClick={handleToggle}>Sign in</ToggleButton>
            </Prompt>
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

const Prompt = styled.div`
    font-size: 14px;
    color: black;
`

const ToggleButton = styled.button`
    background-color: white;
    color: rgb(26, 137, 23);
    border: none;
    font-weight: 500;
    font-size: 14px;
    cursor: pointer;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
`