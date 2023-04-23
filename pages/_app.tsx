import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout/Layout'
import { AuthUserProvider } from 'hooks/context'
import { useRouter } from 'next/router'
import { useAuth } from 'hooks/context'
import { useEffect } from 'react'
import LoadingEffect from 'components/Common/Loading/LoadingEffect'

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    return (
        <AuthUserProvider>
            {   router.pathname === "/me/plans" || 
                router.pathname === "/me/stories" ||  
                router.pathname === "/new-story/[storyId]" ||
                router.pathname === "/plan/[planId]"
                ? 
                <LoginOrNot Component={Component} pageProps={pageProps} />
                :
                <Component {...pageProps} />
            }
        </AuthUserProvider>
    )
}

function LoginOrNot({ Component, pageProps }: any){
    const { authUser, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        // after loading + no user
        if (!loading && !authUser){
            router.push('/')
        }
    }, [authUser, loading])

    return loading ?
        (
            <LoadingEffect/>
        )
        : authUser ?
            (
                <Component {...pageProps} />
            )
            :
            (
                <LoadingEffect/>
            )
}