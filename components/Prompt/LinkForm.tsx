import { useRef } from "react"

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
        <form onSubmit={e => handleSubmit(e)}>
            <label>
                Enter url: 
                <br/>
                <input type="url" ref={inputRef} placeholder="https://" autoFocus={true}/>
            </label>
            <br/>
            <button type='submit'>submit</button>
        </form>
    )
}