import { GetStaticPaths, GetStaticProps } from 'next/types'
import { db } from '../../lib/firebase'
import { doc, collection, getDocs, getDoc  } from "firebase/firestore"
import { mountDatas, storyDataType } from 'types'
import { useRouter } from 'next/router'
import styles from '../../styles/newStory.module.css'
import EditorForView from 'components/TiptapEditor/EditorForView'
import { Key, useEffect, useMemo, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from 'components/Layout/NavbarForPublished'
import Head from 'next/head'
import OverlayPrompt from 'components/Common/OverlayPrompt/OverlayPrompt'
import { SignInForm, SignUpForm } from 'components/Common/Form/AuthForms'


interface pageProps {
    storyData: storyDataType,
    mountains: mountDatas,
}


// generate static pages
export const getStaticPaths: GetStaticPaths = async () => {

    const paths: Array<any> = []

    // fetch all published stories param
    const querySnapshot = await getDocs(collection(db, "published"))
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        paths.push({ params: { username: doc.data().uniqname, titleId: doc.data().url }})

    })

    return {
        paths: paths,
        fallback: true,
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {

    // fetch (CallBack = true) data
    let storyData = {}

    if (params && params.titleId){

        const TitleUrl = params.titleId as string
        const splits = TitleUrl.split("-")
        const uuid = splits[splits.length - 1]

        const publishDoc = doc(db, "published", uuid)
        const docSnap = await getDoc(publishDoc)

        if (docSnap.exists()) {
            storyData = docSnap.data()
        }
    }

    // fetch mountains data
    let mountains: mountDatas = {
        highMountains : null,
        middleMountains : null,
        lowMountains : null,
    }
    
    try {
        const docRef1 = doc(db, "mountains", "高山")
        const docSnap1 = await getDoc(docRef1)

        if (docSnap1.exists()) {
            mountains.highMountains = JSON.parse(docSnap1.data().GeojsonData)
        }

        const docRef2 = doc(db, "mountains", "中級山")
        const docSnap2 = await getDoc(docRef2)

        if (docSnap2.exists()) {
            mountains.middleMountains = JSON.parse(docSnap2.data().GeojsonData)
        }

        const docRef3 = doc(db, "mountains", "郊山")
        const docSnap3 = await getDoc(docRef3)

        if (docSnap3.exists()) {
            mountains.lowMountains = JSON.parse(docSnap3.data().GeojsonData)
        }
    }
    catch (error){
        console.log(error)
    }

    
    return {
        props: {
            storyData,
            mountains,
        },
    }
}


export default function Published({ storyData, mountains }: pageProps) {

    const router = useRouter()
    const mapRef = useRef<any | null>(null)
    const [ overlayDisplay, setOverlayDisplay ] = useState<string>("none")
    const [ signInForm, setSignInForm ] = useState<boolean>(false)

    const MapForView = useMemo(() => {

        return dynamic(
            () => import('../../components/Map/MapForView'), 
            { ssr: false }
        )

    }, [])


    if (router.isFallback){
        return <div>Loading...</div>
    }

    return (
        <>
            <Head>
                <title>{storyData.title}</title>
            </Head>
            <Navbar setOverlayDisplay={setOverlayDisplay} setSignInForm={setSignInForm}/>
            <div className={styles.container}>
                <div className="map-wrapper" style={{height: "100vh", width: "50vw"}}>
                    <MapForView 
                        mapRef={mapRef} 
                        mountains={mountains}
                        storyData={storyData}
                    />
                </div>

                <div className={styles.editor}>
                    <EditorForView 
                        editorContent={storyData.editorContent} 
                        title={storyData.title}
                        mapRef={mapRef}
                        userId={storyData.userId}
                        date={storyData.date}
                    />
                </div>
            </div>

            <OverlayPrompt 
                overlayDisplay={overlayDisplay} 
                setOverlayDisplay={setOverlayDisplay}
            >
                { signInForm ? 
                    <SignInForm setSignInForm={setSignInForm}/>
                    : <SignUpForm setSignInForm={setSignInForm}/> 
                }
            </OverlayPrompt>
        </>
    )
}