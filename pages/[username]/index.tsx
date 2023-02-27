import { getDocs, collection, doc, getDoc, query, where } from 'firebase/firestore'
import { db } from '../../lib/firebase'
import { GetStaticPaths, GetStaticProps } from 'next'
import React, { useEffect } from 'react'
import Header from '../../components/Layout/Header'
import profileStyle from '../../styles/profile.module.css'


// generate static pages
export const getStaticPaths: GetStaticPaths = async () => {

    const users: any[] = []

    // fetch all published stories param
    const querySnapshot = await getDocs(collection(db, "users"))
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        console.log(doc.id, " => ", doc.data())
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
    let userInfo = null
    let publishedId: Array<string> = []
    let published: Array<any> = []

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
            userInfo = docSnap.data()
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
                    editorContent: docSnap.data().editorContent
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
    }
}


export default function UserPage({ userInfo, published }: any){

    useEffect(() => {
        console.log("published -> ", published)
    }, [published])

    return (
        <div className={profileStyle.container}>
            <Header title='Avery Lin' />
            <div>

            </div>
        </div>
    )
}