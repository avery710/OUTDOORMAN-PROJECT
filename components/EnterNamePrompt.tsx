import React, { useRef, FC } from 'react'
import { db } from '../lib/firebase'
import { doc, setDoc } from "firebase/firestore"; 


interface EnterNameProp {
    setHaveName: React.Dispatch<React.SetStateAction<boolean>>
}

const EnterNamePrompt: FC<EnterNameProp> = ({ setHaveName }) => {
    const inputRef = useRef<HTMLInputElement>(null)

    async function handleAddTask(){
        if (inputRef.current){
            if (inputRef.current.value){
                setHaveName(true)

                // save to firebase
                await setDoc(doc(db, "VectorLayers", inputRef.current.value), {
                    GeojsonData: ""
                });

            }
            else {
                console.log("no input")
            }
        }
    }

    return (
        <div>
            <input type="text" ref={inputRef}/>
            <button onClick={handleAddTask}>送出</button>
        </div>
    )
}

export default EnterNamePrompt;