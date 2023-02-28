import { FloatingMenu } from '@tiptap/react'
import styles from './tiptap.module.scss'


export default function Floatingmenu({ editor, setImageOverlay }: any) {

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