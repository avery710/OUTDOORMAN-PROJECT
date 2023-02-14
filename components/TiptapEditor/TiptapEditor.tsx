import {
    BubbleMenu,
    EditorContent,
    FloatingMenu,
    useEditor,
} from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Document from '@tiptap/extension-document'
import Link from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import Blockquote from '@tiptap/extension-blockquote'
import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import styles from './tiptap.module.scss'
import { useState } from 'react'
import OverlayPrompt from 'components/Layout/OverlayPrompt'
import ImagePrompt from './ImagePrompt'


const CustomDocument = Document.extend({
    content: 'heading block*',
})

const TiptapEditor = () => {
    const editor = useEditor({
        extensions: [
            CustomDocument,
            StarterKit.configure({
                document: false,
            }),
            Placeholder.configure({
                placeholder: ({node}) => {
                    if (node.type.name === "heading"){
                        return "Title"
                    }

                    return ''
                },
            }),
            Link.configure({
                validate: href => /^https?:\/\//.test(href),
            }),
            Underline,
            // Blockquote,
            Image,
            // Dropcursor,
        ],
        content: `
        <h1>
            Title
        </h1>
        <p>
            Tell your story!
        </p>
      `,
    })

    const [ImageOverlay, setImageOverlay] = useState<string>("none")

    const setlink = () => {
        if (editor){
            const previousUrl = editor.getAttributes('link').href
            const url = window.prompt('URL', previousUrl)

            // cancelled
            if (url === null) {
                return
            }

            // empty
            if (url === '') {
                editor.chain().focus().unsetLink().run()
                return
            }

            // update link
            editor.chain().focus().setLink({ href: url }).run()
        }
    }

    return (
        <>
            {editor && 
                <BubbleMenu className={styles.bubbleMenu} tippyOptions={{ duration: 100 }} editor={editor}>
                    <button
                        onClick={() => editor.chain().focus().toggleBold().run()}
                        className={editor.isActive('bold') ? styles.isActive : ''}
                    >
                        Bold
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleItalic().run()}
                        className={editor.isActive('italic') ? styles.isActive : ''}
                    >
                        Italic
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleUnderline().run()}
                        className={editor.isActive('underline') ? styles.isActive : ''}
                    >
                        Underline
                    </button>
                    <button
                        onClick={() => { editor.isActive('link') ? 
                                editor.chain().focus().extendMarkRange('link').unsetLink().run() : setlink()
                            }}
                        className={editor.isActive('link') ? styles.isActive : ''}
                    >
                        Link
                    </button>
                </BubbleMenu>
            }

            {editor && 
                <FloatingMenu className={styles.floatingMenu} tippyOptions={{ duration: 100 }} editor={editor}>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                        className={editor.isActive('heading', { level: 1 }) ? styles.isActive : ''}
                    >
                        H1
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                        className={editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}
                    >
                        H2
                    </button>
                    <button
                        onClick={() => editor.chain().focus().toggleBlockquote().run()}
                        className={editor.isActive('blockquote') ? styles.isActive : ''}
                    >
                        <i className={styles.quote}/>
                    </button>
                    <button onClick={() => setImageOverlay("flex")}>
                        <i className={styles.image}/>
                    </button>
                </FloatingMenu>
            }

            <EditorContent editor={editor} />

            { ImageOverlay === "flex" && 
                <OverlayPrompt overylayDisplay={ImageOverlay} setOverlayDisplay={setImageOverlay}>
                    <ImagePrompt setOverlayDisplay={setImageOverlay} editor={editor}/>
                </OverlayPrompt>
            }

        </>
    )
}

export default TiptapEditor