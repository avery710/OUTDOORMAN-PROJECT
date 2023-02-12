import { useState } from 'react'
import dynamic from 'next/dynamic'
import PlannerStyle from '../styles/Planner.module.css'
import EnterNamePrompt from '../components/Layout/EnterNamePrompt'
import { db } from '../lib/firebase'
import { doc, getDoc } from "firebase/firestore"
import { GetStaticProps } from "next"

interface pageProps {
    highMountains: GeoJSON.Feature | null
    middleMountains: GeoJSON.Feature | null
    lowMountains: GeoJSON.Feature | null
}

export const getStaticProps: GetStaticProps = async () => {
    let datas: pageProps = {
        highMountains : null,
        middleMountains : null,
        lowMountains : null,
    }
    
    try {
        const docRef = doc(db, "mountains", "高山")
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            datas.highMountains = JSON.parse(docSnap.data().GeojsonData)
            console.log("success!")
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
        () => import('../components/Map/MapForPlan'), 
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