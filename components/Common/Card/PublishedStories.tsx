import { stringify } from "querystring";
import { useEffect, useState } from "react";
import { storyCardArray } from "types"
import { v4 as uuidv4 } from 'uuid';


interface Props {
    storyData: storyCardArray
}

export default function PublishedStories({ storyData }: Props) {
    const [ writer, setWriter ] = useState()

    useEffect(() => {
        // fetch writer info here
    }, [storyData])

    return (
        <>
            { storyData.map(story => {
                return <Card key={uuidv4()} story={story} />
            })}
        </>
    )
}


function Card({ story }: any){
    return (
        <>
            <h4>{story.title}</h4>
            <ul>
                <li>{story.date}</li>
                <li>{stringify(story.editorContent)}</li>
            </ul>
        </>
        
    )
}