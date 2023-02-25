import { BubbleMenu } from '@tiptap/react'
import styles from './tiptap.module.scss'


export default function Bubblemenu({ editor, setGeoOverlay }: any){

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
            <button
                onClick={() => editor.isActive('GeoLink') ? 
                    editor.chain().focus().extendMarkRange('GeoLink').unsetGeoLink().run()
                    :
                    setGeoOverlay("flex")
                }
                className={editor.isActive('GeoLink') ? styles.isActive : ''}
            >
                GeoLink
            </button>
        </BubbleMenu>
    )
}