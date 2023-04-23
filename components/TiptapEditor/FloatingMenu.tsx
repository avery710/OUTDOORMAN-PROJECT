import { Editor, FloatingMenu } from '@tiptap/react'
import { Dispatch, SetStateAction } from 'react'
import styles from './tiptap.module.scss'

interface Props {
    editor: Editor, 
    setImageOverlay: Dispatch<SetStateAction<string>>,
}


export default function Floatingmenu({ editor, setImageOverlay }: Props) {

    return (
        <FloatingMenu className={styles.floatingMenu} tippyOptions={{ duration: 100, offset: [35, 0] }} editor={editor}>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            >
                <i className={styles.titleBlack}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
            >
                <i className={styles.quote}/>
            </button>
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
            >
                <i className={styles.list}/>
            </button>
            <button 
                onClick={() => setImageOverlay("flex")}
            >
                <i className={styles.image}/>
            </button>
        </FloatingMenu>
    )
}