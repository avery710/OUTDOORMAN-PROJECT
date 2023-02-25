import { useState } from 'react'
import dynamic from 'next/dynamic'
import PlannerStyle from '../../styles/Planner.module.css'
import EnterNamePrompt from '../../components/Layout/EnterNamePrompt'
import { db } from '../../lib/firebase'
import { doc, getDoc } from "firebase/firestore"
import { GetStaticProps } from "next"
import { mountDatas } from 'types'


export const getStaticProps: GetStaticProps = async () => {
    let datas: mountDatas = {
        highMountains : null,
        middleMountains : null,
        lowMountains : null,
    }
    
    try {
        const docRef1 = doc(db, "mountains", "高山")
        const docSnap1 = await getDoc(docRef1)

        if (docSnap1.exists()) {
            datas.highMountains = JSON.parse(docSnap1.data().GeojsonData)
        }

        const docRef2 = doc(db, "mountains", "中級山")
        const docSnap2 = await getDoc(docRef2)

        if (docSnap2.exists()) {
            datas.middleMountains = JSON.parse(docSnap2.data().GeojsonData)
        }

        const docRef3 = doc(db, "mountains", "郊山")
        const docSnap3 = await getDoc(docRef3)

        if (docSnap3.exists()) {
            datas.lowMountains = JSON.parse(docSnap3.data().GeojsonData)
        }
    }
    catch (error){
        console.log(error)
    }

    return {
        props: {
            datas
        },
    }
}

export default function Planner ({datas}: any){
    const [ haveName, setHaveName ] = useState<boolean>(false)

    const MapForPlan = dynamic(
        () => import('../../components/Map/MapForPlan'), 
        { ssr: false }
    )
      
    return haveName ? (
        <div className={PlannerStyle.planner}>
            <MapForPlan {...datas}/>
        </div>
    ) : (
        <div>
            <EnterNamePrompt setHaveName={setHaveName}/>
        </div>
    )
}