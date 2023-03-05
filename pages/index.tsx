import { useAuth } from 'hooks/context'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout'
import { db } from 'lib/firebase'
import { getDocs, collection } from 'firebase/firestore';
import { publishCardArray, publishCardType, recommendCardArray, recommendCardType, storyCardArray } from 'types';
import Image from 'next/image';
import styled from 'styled-components';
import RightSection from 'components/Layout/RightSection';
import IndexLeftSection from 'components/Layout/IndexLeftSection';

export async function getStaticProps(){

    const recommendArray: recommendCardArray = []
    const publishedArray: publishCardArray = []

    const querySnapshot = await getDocs(collection(db, "published"))
    querySnapshot.forEach(doc => {

        const recommendCard: recommendCardType = {
            title: doc.data().title,
            ms: doc.data().ms,
            userId: doc.data().userId,
            url: doc.data().url
        }
        recommendArray.push(recommendCard)

        const publishCard: publishCardType = {
            title: doc.data().title,
            date: doc.data().date,
            editorTextContent: doc.data().editorTextContent,
            previewImageUrl: doc.data().previewImageUrl,
            ms: doc.data().ms,
            userId: doc.data().userId,
            url: doc.data().url,
            uuid: doc.id,
        }
        publishedArray.push(publishCard)

    })

    publishedArray.sort((a, b) => b.ms - a.ms)
  
    return {
        props: {
            recommendArray,
            publishedArray,
        },
        revalidate: 60,
    }
}

interface PageProps {
    recommendArray: recommendCardArray,
    publishedArray: publishCardArray,
}

export default function Home({ recommendArray, publishedArray }: any){

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
                    <Layout
                        leftComponent={<IndexLeftSection published={publishedArray}/>}
                        rightComponent={<RightSection recommendList={recommendArray}/>}
                    />
                )
                : (   
                    // login but missing username -> redirect to /set-username page
                    <div>loading...</div>
                )
        : ( 
            // logged out
            <Layout
                leftComponent={<IndexLeftSection published={publishedArray}/>}
                rightComponent={<RightSection recommendList={recommendArray}/>}
                landingSection={
                    <ImageWrapper>
                        <Image
                            src="/images/landing-img.jpg"
                            alt="landing-img"
                            fill
                            style={{objectFit: "cover", objectPosition: "center"}}
                        />
                    </ImageWrapper>
                }
            />
        )
}


const ImageWrapper = styled.div`
    width: 100vw;
    height: calc(100vh - 65px);
    position: relative;
`