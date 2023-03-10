import dynamic from 'next/dynamic'
import { db } from '../../lib/firebase'
import { doc, getDoc } from "firebase/firestore"
import { GetStaticProps } from "next"
import { mountDatas } from 'types'
import NavbarForEdit from 'components/Layout/NavbarForEdit'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'


export const getStaticProps: GetStaticProps = async () => {

    // fetch storyData
    let storyData = {}

    const playgroundDoc = doc(db, "playground", "plan")
    const docSnap = await getDoc(playgroundDoc)

    if (docSnap.exists()) {
        storyData = docSnap.data()
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

export default function PlaygroundPlanPage({ storyData, mountains }: any){

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
            <div style={{ height: "calc(100vh - 60px)", width: "100vw" }}>
                <MapForPlan 
                    geoJsonData={storyData.geoJsonData} 
                    mountains={mountains}
                    isSavingRef={isSavingRef}
                />
            </div>
        </>
    )
}