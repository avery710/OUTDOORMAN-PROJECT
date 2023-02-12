import { useEffect } from 'react'
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { geoPointType } from 'types'
import { $insertNodes, LexicalEditor, $getSelection } from 'lexical'
import { TextNode } from 'lexical';
import { GeoPointNode } from 'components/Editor/nodes/GeoPointNode';


export default function GeoPointPlugin({geoPointData, setGeoPointData}: any) {
    const [editor] = useLexicalComposerContext()

    useEffect(() => {
        if (geoPointData){
            // add description to editor
            const description = geoPointData.descript
            


            if (description){
                editor.update(() => {
                    const newNode = new GeoPointNode(description)
                    const nodes = [newNode, new TextNode(" ")]
                    $insertNodes(nodes)
                    console.log("add node!")
                })
            }            
        }
    }, [geoPointData])

    return (
        <></>
    )
}