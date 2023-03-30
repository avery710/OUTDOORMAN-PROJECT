import dynamic from 'next/dynamic'
import NavbarForEdit from 'components/Layout/NavbarForEdit'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import { db } from '../../lib/firebase'
import { doc, getDoc, updateDoc } from "firebase/firestore"
import { useAuth } from 'hooks/context'
import Head from 'next/head'
import LoadingEffect from 'components/Common/Loading/LoadingEffect'

export default function NewPlan(){
    
    const [ isValid, setIsValid ] = useState<boolean>(false)
    const router = useRouter()
    const { planId } = router.query
    const { authUser } = useAuth()
    const [ title, setTitle ] = useState<string>()
    const [ geoJsonData, setGeoJsonData ] = useState<string>()
    const isSavingRef = useRef<HTMLLIElement>(null)


    // fetch basic info from db and check whether current url is valid
    useEffect(() => {
        async function checkId(){
            if (authUser && authUser.uid && planId){
                const docRef = doc(db, "users", authUser.uid, "plans", planId as string)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()){
                    setIsValid(true)

                    const fetchTitle = docSnap.data().title
                    fetchTitle ? setTitle(fetchTitle) : setTitle("Untitled")

                    const fetchGeoData = docSnap.data().geoJsonData
                    setGeoJsonData(fetchGeoData)

                    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June", "July", "Aug", "Sep", "Oct", "Nov", "Dec"]
                    const today = new Date()
                    const date = monthNames[today.getMonth()].concat(" ", today.getDate().toString(), ", ", today.getFullYear().toString())
                    await updateDoc(docRef, {"date": date})

                    const ms = Date.now()
                    await updateDoc(docRef, {"ms": ms})
                }
                else {
                    router.push("/")
                }
            }   
        }

        checkId()
    }, [])

    
    const MapForPlan = dynamic(
        () => import('../../components/Map/MapForPlan'), 
        { ssr: false }
    )


    return (
        <>
            <Head>
                <title>New plan</title>
            </Head>
            {
                isValid ? 
                (
                    <>
                        <NavbarForEdit title={title} isSavingRef={isSavingRef}/>
                        <div style={{ height: "calc(100vh - 60px)", width: "100vw" }}>
                            <MapForPlan geoJsonData={geoJsonData} isSavingRef={isSavingRef}/>
                        </div>
                    </>
                )
                :
                (
                    <div style={{width: "100vw", height: "100vh"}}>
                        <LoadingEffect/>
                    </div>
                )
            }
        </>
    )
}