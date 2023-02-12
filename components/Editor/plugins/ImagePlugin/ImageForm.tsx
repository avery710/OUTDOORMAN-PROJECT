import { useRef, useState } from 'react'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { INSERT_IMAGE_COMMAND } from './ImagePlugin';
import type { InsertImagePayload } from "./ImagePlugin";

export default function ImageForm({setOverlayDisplay}: any) {
    const imgRef = useRef<HTMLInputElement | null>(null)
    const [editor] = useLexicalComposerContext()
    const [src, setSrc] = useState("")

    function handleSubmit(e: React.FormEvent<HTMLFormElement>){
        e.preventDefault()
          
        const payload: InsertImagePayload = {
            altText: "URL image",
            src: src,
        }
        editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload)

        setOverlayDisplay("none")
    }
    
    function loadImage(files: FileList | null){
        const reader = new FileReader();
        reader.onload = function () {
            if (typeof reader.result === 'string') {
                setSrc(reader.result);
            }
            return '';
        };
        if (files !== null) {
            reader.readAsDataURL(files[0]);
        }
    }

    return (
        <form onSubmit={e => handleSubmit(e)}>
            <label>
                Choose an image file!
                <input type="file" accept=".jpg, .jpeg, .png" ref={imgRef} onChange={e => loadImage(e.target.files)}/>
            </label>
            <br/>
            <button type='submit'>submit</button>
        </form>
    )
}