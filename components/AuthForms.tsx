import styled from 'styled-components'


export function SignInForm({ setSignInForm }: any){
    function handleClick(){
        setSignInForm(false)
    }

    return (
        <>
            <h1 style={{ marginTop: "80px" , marginBottom: "80px" }}>
                Welcome Back!
            </h1>
        
            <Button>
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

    return (
        <>
            <h1 style={{ marginTop: "80px" ,marginBottom: "80px" }}>
                Join Outdoorman Project!
            </h1>

            <Button>
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