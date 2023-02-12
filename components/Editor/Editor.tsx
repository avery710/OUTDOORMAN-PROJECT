import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import myTheme from "./themes/myThemes"
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary"
import AutoFocusPlugin from './plugins/AutoFocusPlugin'
import TreeViewPlugin from './plugins/TreeViewPlugin'
import ToolbarPlugin from './plugins/ToolbarPlugin'
// import ToolbarPlugin from './plugins/Duplicate'
import { LinkNode } from "@lexical/link";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";



// function onChange(editorState: any) {
//     editorState.read(() => {
//         // Read the contents of the EditorState here.
//         const root = $getRoot();
//         const selection = $getSelection();
    
//         console.log(root, selection);
//     })
// }

function onError(error: any) {
    console.error(error)
}

function Placeholder(){
    return (
        <div className='editor-placeholder'>
            Enter some text...
        </div>
    )
}

export default function Editor() {
    const initialConfig = {
        namespace: 'MyEditor',
        theme: myTheme,
        onError: onError,
        nodes: [
            HeadingNode, 
            QuoteNode,
            LinkNode
        ]
    }
    
    return (
        <LexicalComposer initialConfig={initialConfig}>
            <div className='editor-container'>
                <ToolbarPlugin />
                <div className='editor-inner'>
                    <RichTextPlugin
                        // when contentEditable = true -> users can edit on web page
                        contentEditable={<ContentEditable className='editor-input'/>} 
                        placeholder={<Placeholder />}
                        ErrorBoundary={LexicalErrorBoundary}
                    />
                    {/* <OnChangePlugin onChange={onChange} /> */}
                    <HistoryPlugin />
                    <AutoFocusPlugin />
                    <LinkPlugin />
                    {/* <TreeViewPlugin /> */}
                </div>
            </div> 
        </LexicalComposer>
    )
}