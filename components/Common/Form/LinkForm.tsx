import { useRef } from "react"
import styled from "styled-components"

export default function LinkForm({ setOverlayDisplay, editor }: any){

    const inputRef = useRef<HTMLInputElement>(null)

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()

        // cancelled
        if (inputRef.current){
            if (inputRef.current.value === null) {
                return
            }
    
            // empty
            if (inputRef.current.value === '') {
                editor.chain().focus().unsetLink().run()
                return
            }
    
            // update link
            editor.chain().focus().setLink({ href: inputRef.current.value }).run()
        }
        
        setOverlayDisplay("none")
    }

    return (
        <FormWrapper onSubmit={e => handleSubmit(e)}>
            <h3>Enter url</h3>
            <InputField type="url" ref={inputRef} placeholder="https://" autoFocus={true}/>
            <br/>
            <SubmitButton type='submit'>submit</SubmitButton>
        </FormWrapper>
    )
}

const FormWrapper = styled.form`
    display: flex;
    flex-direction: column;
    align-items: center;
`

const InputField = styled.input`
    width: 300px;
    height: 20px;
    padding: 5px;
    border: none;
    font-size: 14px;
    border-bottom: 1px solid black;
    background-color: white;
    text-align: center;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    margin-bottom: 6px;

    &:focus {
        outline: none;
    }
`

const SubmitButton = styled.button`
    border: 1px solid rgb(26, 137, 23);
    background-color: white;
    font-size: 14px;
    font-weight: 400;
    color: rgb(26, 137, 23);
    cursor: pointer;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
    border-radius: 15px;
    padding-left: 14px;
    padding-right: 14px;
`