import Layout from 'components/Layout/Layout'
import { useAuth } from 'hooks/context'
import { useEffect, useState } from 'react'
import { cardDataArray } from 'types'
import Header from '../../components/Layout/Header'
import style from '../../styles/profile.module.css'
import { db } from '../../lib/firebase'
import { collection, getDocs } from "firebase/firestore"
import Card from 'components/Layout/Card'
import OverlayPrompt from 'components/Prompt/OverlayPrompt'
import DeletePlanForm from 'components/Prompt/DeletePlanForm'


export default function MyStories() {
    const [ loaded, setLoaded ] = useState<boolean>(false)
    const [ list, setList ] = useState<cardDataArray | null>(null)
    const { authUser } = useAuth()
    const [ deleteDisplay, setDeleteDisplay ] = useState<string>("none")
    const [ deleteId, setDeleteId ] = useState<string>()
    

    useEffect(() => {

        // fetch stories from db
        async function fetchStories(){
            if (authUser && authUser.uid){
                let array: cardDataArray = []

                const querySnapshot = await getDocs(collection(db, "users", authUser.uid, "stories-edit"))
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
                setLoaded(true)
            }
        }

        fetchStories()
    }, [])


    return (
        <>
            <Layout>
                <div className={style.container}>
                    <Header title='Your Plans' />
                    <div style={{width: "80%"}}>
                        {loaded ? 
                            list ?
                                (list.map(content => {
                                    return <Card 
                                        title={content.title} 
                                        uuid={content.uuid} 
                                        date={content.date} 
                                        setDeleteId={setDeleteId}
                                        setOverlayDisplay={setDeleteDisplay}
                                        path="new-story"
                                        key={content.uuid}
                                    />
                                }))
                                :
                                (null)
                            :
                            (<div>loading...</div>)
                        }
                    </div>
                </div>
            </Layout>

            <OverlayPrompt overlayDisplay={deleteDisplay} setOverlayDisplay={setDeleteDisplay}>
                <DeletePlanForm 
                    setOverlayDisplay={setDeleteDisplay} 
                    deleteId={deleteId} 
                    list={list}
                    setList={setList}
                    path="new-story"
                />
            </OverlayPrompt>
        </>
    )
}