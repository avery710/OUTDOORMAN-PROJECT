import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from 'components/Layout'
import { AuthUserProvider } from 'lib/context'
import { useRouter } from 'next/router'

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter()

    return (
        <AuthUserProvider>
            {router.pathname === "/set-username" || router.pathname === "/" ? 
                <Component {...pageProps} />
                : 
                <Layout>
                    <Component {...pageProps} />
                </Layout> 
            }
        </AuthUserProvider>
    )
}