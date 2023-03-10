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
        <>
            <h1 style={{ marginTop: "80px" , marginBottom: "80px" }}>
                Welcome Back!
            </h1>
        
            <Button onClick={handleSignIn}>
                Sign in with Google
            </Button>

            <p style={{ marginTop: "80px" , marginBottom: "80px" }}>
                No account? <button onClick={handleToggle}>Create One</button>
            </p>
        </>
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
        <>
            <h1 style={{ marginTop: "80px" ,marginBottom: "80px" }}>
                Join Outdoorman Project!
            </h1>

            <Button onClick={handleSignUp}>Sign up with Google</Button>

            <p style={{ marginTop: "80px" , marginBottom: "80px"}}>
                Already have an account? <button onClick={handleToggle}>Sign in</button>
            </p>
        </>
    )
}

const Button = styled.button`
    width: 200px;
    height: 40px;

    display: flex;
    justify-content: center;
    align-items: center;

    border-radius: 20px;
    border: 1px solid black;
    background-color: white;
    cursor: pointer;
`