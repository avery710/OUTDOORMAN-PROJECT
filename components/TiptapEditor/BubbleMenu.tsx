import { BubbleMenu, isTextSelection } from '@tiptap/react'
import styles from './tiptap.module.scss'
import 'tippy.js/dist/svg-arrow.css'
import { roundArrow } from 'tippy.js'


export default function Bubblemenu({ editor, setGeoOverlay, setLinkOverlay }: any){

    return (
        <BubbleMenu 
            className={styles.bubbleMenu} 
            tippyOptions={{ duration: 100, arrow: roundArrow }} 
            editor={editor}
            shouldShow={({ editor, view, state, oldState, from, to }) => {
                const { doc, selection } = state
                const { empty } = selection

                const isEmptyTextBlock = !doc.textBetween(from, to).length && isTextSelection(state.selection)
                const hasEditorFocus = view.hasFocus() 

                if (!hasEditorFocus || empty || isEmptyTextBlock || !editor.isEditable || editor.isActive('image')) {
                    return false
                }

                return true
            }}
        >
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive('bold') ? styles.isActive : ''}
            >
                <i className={styles.bold}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive('heading', { level: 2 }) ? styles.isActive : ''}
            >
                <i className={styles.title}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive('italic') ? styles.isActive : ''}
            >
                <i className={styles.italic}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive('underline') ? styles.isActive : ''}
            >
                <i className={styles.underline}/>
            </button>
            <button
                onClick={() => { editor.isActive('link') ? 
                        editor.chain().focus().extendMarkRange('link').unsetLink().run() 
                        : 
                        setLinkOverlay("flex")
                    }}
                className={editor.isActive('link') ? styles.isActive : ''}
            >
                <i className={styles.link}/>
            </button>
            <button
                onClick={() => editor.isActive('GeoLink') ? 
                    editor.chain().focus().extendMarkRange('GeoLink').unsetGeoLink().run()
                    :
                    setGeoOverlay("flex")
                }
                className={editor.isActive('GeoLink') ? styles.isActive : ''}
            >
                <i className={styles.geo}/>
            </button>      
        </BubbleMenu>
    )
}