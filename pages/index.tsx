import { useAuth } from 'hooks/context'
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout'
import { db } from 'lib/firebase'
import { getDocs, collection } from 'firebase/firestore';
import { storyCardArray } from 'types';
import PublishedStories from 'components/Layout/PublishedStories';
import Navbar from 'components/Layout/Navbar';
import Image from 'next/image';
import styled from 'styled-components';

export async function getStaticProps(){

    let storyData: storyCardArray = []

    const querySnapshot = await getDocs(collection(db, "published"))
    querySnapshot.forEach(doc => {
        storyData.push({
            title: doc.data().title,
            date: doc.data().date,
            uuid: doc.id,
            ms: doc.data().ms,
            editorContent: doc.data().editorContent,
            userId: doc.data().userId,
        })
    })

    storyData.sort((a, b) => b.ms - a.ms)
  
    return {
        props: {
            storyData
        },
        revalidate: 60,
    }
}

export default function Home({ storyData }: any){

    const { authUser, loading } = useAuth()
    const router = useRouter()
    

    useEffect(() => {
        if (!loading && authUser && !authUser.username){
            router.push('/set-username')
        }
    }, [authUser, loading])


    return loading ? 
        (   
            // add loading effect soon...
            <div>loading...</div>
        )
        : authUser ?
            authUser.username ?
                (   
                    // login complete!
                    // <Layout/>
                    <></>
                )
                : (   
                    // login but missing username -> redirect to /set-username page
                    <div>loading...</div>
                )
        : ( 
            // logged out
            <>
            <Navbar/>
            <ImageWrapper>
                <Image
                    src="/images/landing-img.jpg"
                    alt="landing-img"
                    fill
                    style={{objectFit: "cover", objectPosition: "center"}}
                />
            </ImageWrapper>
            </>
        )
}


const ImageWrapper = styled.div`
    width: 100vw;
    height: calc(100vh - 65px);
    position: relative;
`