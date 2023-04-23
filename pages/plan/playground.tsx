import dynamic from 'next/dynamic'
import { db } from '../../lib/firebase'
import { doc, getDoc } from "firebase/firestore"
import { GetStaticProps } from "next"
import { mountDatas } from 'types'
import NavbarForEdit from 'components/Layout/NavbarForEdit'
import { useRef} from 'react'
import Head from 'next/head'
import styled from 'styled-components'


export const getStaticProps: GetStaticProps = async () => {

    // fetch storyData
    let storyData = {}

    const playgroundDoc = doc(db, "playground", "plan")
    const docSnap = await getDoc(playgroundDoc)

    if (docSnap.exists()) {
        storyData = {
            title: docSnap.data().title,
            geoJsonData: docSnap.data().geoJsonData
        }
    }

    // fetch mountain data
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
            mountains
        },
    }
}

interface Props {
    storyData: {
        title: string,
        geoJsonData: string
    }, 
    mountains: mountDatas,
}

export default function PlaygroundPlanPage({ storyData, mountains }: Props){

    const isSavingRef = useRef<HTMLLIElement>(null)


    const MapForPlan = dynamic(
        () => import('../../components/Map/Playground/MapForPlan'), 
        { ssr: false }
    )

      
    return (
        <>
            <Head>
                <title>Plan Playground</title>
            </Head>
            <NavbarForEdit title={storyData.title} isSavingRef={isSavingRef} />
            <MapWrapper>
                <MapForPlan 
                    geoJsonData={storyData.geoJsonData} 
                    mountains={mountains}
                    isSavingRef={isSavingRef}
                />
            </MapWrapper>
        </>
    )
}

const MapWrapper = styled.div`
    height: calc(100vh - 60px);
    width: 100vw;
`