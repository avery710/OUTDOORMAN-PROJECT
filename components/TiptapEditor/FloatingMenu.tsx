import { FloatingMenu } from '@tiptap/react'
import styles from './tiptap.module.scss'


export default function Floatingmenu({ editor, setImageOverlay }: any) {
    return (
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
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive('bulletList') ? 'is-active' : ''}
            >
                <i className={styles.list}/>
            </button>
            <button onClick={() => setImageOverlay("flex")}>
                <i className={styles.image}/>
            </button>
        </FloatingMenu>
    )
}