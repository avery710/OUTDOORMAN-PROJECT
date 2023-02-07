import styled from 'styled-components'
import { getAuth, signInWithRedirect, getRedirectResult, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { provider } from '../lib/firebase'

export function SignInForm({ setSignInForm }: any){
    function handleClick(){
        setSignInForm(false)
    }

    async function handleSignIn(){
        try {
            const auth = getAuth()
            const result = await signInWithPopup(auth, provider)

            const credential = GoogleAuthProvider.credentialFromResult(result)
            const token = credential?.accessToken
            // The signed-in user info.
            const user = result.user
            console.log(user)
        }
        catch(error){
            console.log(error)
        }
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
                No account? <button onClick={handleClick}>Create One</button>
            </p>
        </>
    )
}

export function SignUpForm({ setSignInForm }: any){
    function handleClick(){
        setSignInForm(true)
    }

    async function handleSignUp(){
        const auth = getAuth()
        signInWithRedirect(auth, provider)
    }

    return (
        <>
            <h1 style={{ marginTop: "80px" ,marginBottom: "80px" }}>
                Join Outdoorman Project!
            </h1>

            <Button onClick={handleSignUp}>
                Sign up with Google
            </Button>

            <p style={{ marginTop: "80px" , marginBottom: "80px"}}>
                Already have an account? <button onClick={handleClick}>Sign in</button>
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