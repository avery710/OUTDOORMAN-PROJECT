import { getDocs, collection, doc, getDoc, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useEffect, useState } from 'react'
import Layout from 'components/Layout/Layout'
import OverlayPrompt from 'components/Common/OverlayPrompt/OverlayPrompt'
import { useAuth } from 'hooks/context'
import { autherInfo, publishCardArray, recommendCardArray } from 'types'
import ProfilePage from 'components/Layout/ProfilePage'
import DeletePublishForm from 'components/Common/Form/DeletePublishForm'
import ProfileRightSection from 'components/Layout/ProfileRightSection'
import ChangeProfileForm from 'components/Common/Form/ChangeProfileForm'
import { useRouter } from 'next/router'
import Head from 'next/head'
import LoadingEffect from 'components/Common/Loading/LoadingEffect'


// generate static pages
export const getStaticPaths: GetStaticPaths = async () => {

    const users: any[] = []

    // fetch all published stories param
    const querySnapshot = await getDocs(collection(db, "users"))
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        users.push({ params: { username: doc.data().uniqname }})

    })

    return {
        paths: users,
        fallback: true,
    }
}


export const getStaticProps: GetStaticProps = async ({ params }) => {

    // get user id
    let userId = ""
    const userInfo: autherInfo = {
        photoUrl: "",
        username: "",
        uniqname: ""
    }
    let publishedId: Array<string> = []
    let published: publishCardArray = []

    if (params && params.username){
        const docRef = doc(db, "uniqname", params.username as string)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            userId =  docSnap.data().userId
        }
    }

    // get user info
    if (userId){
        const docRef = doc(db, "users", userId)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            userInfo.photoUrl = docSnap.data().photoUrl,
            userInfo.username = docSnap.data().username,
            userInfo.uniqname = docSnap.data().uniqname
        }

        const querySnapshot = await getDocs(collection(db, "users", userId, "published"))
        querySnapshot.forEach(doc => {
            publishedId.push(doc.id)
        })
    }

    // get published story data
    if (publishedId.length > 0){

        for (const id of publishedId){
            const docRef = doc(db, "published", id)
            const docSnap = await getDoc(docRef)

            if (docSnap.exists()) {
                published.push({
                    title: docSnap.data().title,
                    date: docSnap.data().date,
                    editorTextContent: docSnap.data().editorTextContent,
                    previewImageUrl: docSnap.data().previewImageUrl,
                    ms: docSnap.data().ms,
                    url: docSnap.data().url,
                    userId: docSnap.data().userId,
                    uuid: id,
                })
            }
        }

        if (published.length > 1){
            published.sort((a, b) => b.ms - a.ms)
        }
    }
    
    return {
        props: {
            userInfo,
            published,
        },
        revalidate: 5,
    }
}


interface PageProps {
    userInfo: autherInfo,
    published: publishCardArray,
}


export default function UserPage({ userInfo, published }: PageProps){

    const router = useRouter()

    const [ loaded, setLoaded ] = useState<boolean>(false)
    const [ recommend, setRecommend ] = useState<recommendCardArray>([])

    const [ profileUrl, setProfileUrl ] = useState<string>(userInfo?.photoUrl)
    const [ username, setUsername ] = useState<string>(userInfo?.username)
    const [ list, setList ] = useState<publishCardArray>(published)
    const [ deleteId, setDeleteId ] = useState<string>("")
    const [ deleteDisplay, setDeleteDisplay ] = useState<string>("none")
    const [ profilePicDisplay, setProfilePicDisplay ] = useState<string>("none")


    useEffect(() => {
        // fetch recommended section 
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
            setLoaded(true)
        }
    
        fetchPublished()
    }, [])



    return (
        <>
            <Head>
                <title>{userInfo?.uniqname}</title>
            </Head>
            {
                loaded ? (
                    <>
                        <Layout
                            leftComponent={
                                <ProfilePage
                                    headerTitle={username}
                                    list={list}
                                    setDeleteId={setDeleteId}
                                    setOverlayDisplay={setDeleteDisplay}
                                    auther={userInfo}
                                />
                            }
                            rightComponent={
                                <ProfileRightSection
                                    auther={userInfo}
                                    profileUrl={profileUrl}
                                    username={username}
                                    recommendList={recommend}
                                    setOverlayDisplay={setProfilePicDisplay}
                                />
                            }
                        />
            
                        <OverlayPrompt overlayDisplay={deleteDisplay} setOverlayDisplay={setDeleteDisplay}>
                            <DeletePublishForm 
                                setOverlayDisplay={setDeleteDisplay} 
                                deleteId={deleteId} 
                                list={list}
                                setList={setList}
                            />
                        </OverlayPrompt>
            
                        <OverlayPrompt overlayDisplay={profilePicDisplay} setOverlayDisplay={setProfilePicDisplay}>
                            <ChangeProfileForm 
                                auther={userInfo}
                                setOverlayDisplay={setProfilePicDisplay}
                                setProfileUrl={setProfileUrl}
                                setUsername={setUsername}
                            />
                        </OverlayPrompt>
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