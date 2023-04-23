import { useEffect, useState } from 'react'
import { db } from '../../lib/firebase'
import { collection, getDocs } from "firebase/firestore"
import { useAuth } from 'hooks/context'
import { cardDataArray, recommendCardArray } from 'types'
import Layout from 'components/Layout/Layout'
import OverlayPrompt from 'components/Common/OverlayPrompt/OverlayPrompt'
import DeletePlanForm from 'components/Common/Form/DeletePlanForm'
import MePage from 'components/Layout/MePage'
import RightSection from 'components/Layout/RightSection'
import Head from 'next/head'
import LoadingEffect from 'components/Common/Loading/LoadingEffect'
import styled from 'styled-components'


export default function MyPlans(){
    
    const [ loaded, setLoaded ] = useState<boolean>(false)
    const [ list, setList ] = useState<cardDataArray | null>(null)
    const [ recommend, setRecommend ] = useState<recommendCardArray>([])
    const { authUser } = useAuth()
    const [ deleteDisplay, setDeleteDisplay ] = useState<string>("none")
    const [ deleteId, setDeleteId ] = useState<string>("")

    useEffect(() => {
        // fetch plans from db
        async function fetchPlans(){
            if (authUser && authUser.uid){
                let array: cardDataArray = []

                const querySnapshot = await getDocs(collection(db, "users", authUser.uid, "plans"))
                querySnapshot.forEach(doc => {
                    array.push({
                        title: doc.data().title,
                        date: doc.data().date,
                        uuid: doc.id,
                        ms: doc.data().ms,
                    })
                })

                array.sort((a, b) => b.ms - a.ms)

                setList(array)
            }
        }

        async function fetchPublished(){
            const temp: recommendCardArray = []

            const querySnapshot = await getDocs(collection(db, "published"))
            querySnapshot.forEach((doc) => {

                const recommendCard = {
                    title: doc.data().title,
                    ms: doc.data().ms,
                    userId: doc.data().userId,
                    url: doc.data().url
                }

                temp.push(recommendCard)
            })

            setRecommend(temp)
        }

        fetchPlans()
        fetchPublished()
        setLoaded(true)
    }, [])


    return (
        <>
            <Head>
                <title>Your plans</title>
            </Head>
            {
                loaded ? (
                    <>
                        <Layout
                            leftComponent={
                                <MePage
                                    loaded={loaded} 
                                    list={list} 
                                    setDeleteId={setDeleteId}
                                    setOverlayDisplay={setDeleteDisplay}
                                    headerTitle="Your plans"
                                    path="plan"
                                />
                            }
                            rightComponent={<RightSection recommendList={recommend}/>}
                        />
                            
                        <OverlayPrompt overlayDisplay={deleteDisplay} setOverlayDisplay={setDeleteDisplay}>
                            <DeletePlanForm 
                                setOverlayDisplay={setDeleteDisplay} 
                                deleteId={deleteId} 
                                list={list}
                                setList={setList}
                                path="plan"
                            />
                        </OverlayPrompt>
                    </>
                )
                :
                (
                    <LoadingEffect/>
                )
            }
        </>
    )
}