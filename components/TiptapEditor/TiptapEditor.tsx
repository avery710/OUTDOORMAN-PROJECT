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
// import Blockquote from '@tiptap/extension-blockquote'
// import Dropcursor from '@tiptap/extension-dropcursor'
import Image from '@tiptap/extension-image'
import styles from './tiptap.module.scss'
import { useEffect, useState } from 'react'
import OverlayPrompt from 'components/Layout/OverlayPrompt'
import ImagePrompt from './ImagePrompt'
import { GeoLink } from './extensions/GeoLink'
import GeoPointForm from './GeoPointForm'
import { geoPointArray, geoPointType } from 'types'


const CustomDocument = Document.extend({
    content: 'heading block*',
})

const TiptapEditor = ({geoPoints, setGeoPoints, setLocation}: any) => {
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
                autolink: false,
            }),
            Underline,
            Image,
            GeoLink.configure({
                setLocation: setLocation,
            }),
            // Blockquote,
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

    const [Marks, setMarks] = useState<geoPointArray | null>(null)
    const [ImageOverlay, setImageOverlay] = useState<string>("none")
    const [GeoOverlay, setGeoOverlay] = useState<string>("none")

    useEffect(() => {
        if (editor){
            editor.on('transaction', ({ editor, transaction }) => {
                const state = editor.view.state
                const selection = state.selection
                const { doc } = state

                // loop through the doc to check whether geolink mark has been deleted
                const temp: geoPointArray = []
                doc.forEach(node => {
                    node.forEach(child => {
                        child.marks.forEach(mark => {
                            if (mark.type.name === "GeoLink"){
                                temp.push({
                                    lat: mark.attrs.lat,
                                    lng: mark.attrs.lng,
                                    uuid: mark.attrs.uuid,
                                    descript: child.textContent,
                                })
                                console.log(child)
                            }
                        })
                    })
                })
                setMarks(temp)
            })
        }
    }, [editor])

    useEffect(() => {
        if (Marks && geoPoints){
            if (Marks.length != geoPoints.length){
                setGeoPoints(Marks)
            }
            else if (Marks.length === geoPoints.length){
                let result = false

                geoPoints.forEach((geoPoint: geoPointType) => {
                    const object = Marks.filter(Marks => Marks.uuid === geoPoint.uuid)
                    
                    if (object.length > 0){
                        if (object[0].descript != geoPoint.descript){
                            console.log("Marks -> ", Marks)
                            console.log("geoPoints -> ", geoPoints)
                            result = true
                        }
                    }
                })

                if (result){
                    setGeoPoints(Marks)
                }
            }
        }
    }, [geoPoints, Marks])

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
                    <button>
                        <i className={styles.bookmark}/>
                    </button>
                    <button onClick={() => setImageOverlay("flex")}>
                        <i className={styles.image}/>
                    </button>
                    <button>
                        <i className={styles.youtube}/>
                    </button>
                </FloatingMenu>
            }

            { GeoOverlay === "flex" &&
                <OverlayPrompt overylayDisplay={GeoOverlay} setOverlayDisplay={setGeoOverlay}>
                    <GeoPointForm geoPoints={geoPoints} setGeoPoints={setGeoPoints} setOverlayDisplay={setGeoOverlay} editor={editor}/>
                </OverlayPrompt>
            }

            { ImageOverlay === "flex" && 
                <OverlayPrompt overylayDisplay={ImageOverlay} setOverlayDisplay={setImageOverlay}>
                    <ImagePrompt setOverlayDisplay={setImageOverlay} editor={editor}/>
                </OverlayPrompt>
            }

            <EditorContent editor={editor} />

        </>
    )
}

export default TiptapEditor