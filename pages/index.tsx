import { useAuth } from 'hooks/context'
import { useEffect } from 'react'
import { useRouter } from 'next/router';
import Layout from '../components/Layout/Layout'

export default function Home() {
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
                    <Layout>
                        <div>
                            This is index page.
                        </div>
                    </Layout>
                )
                : (   
                    // login but missing username -> redirect to /set-username page
                    <div>
                        loading...
                    </div>
                )
        : ( 
            // logged out
            <Layout>
                <div>
                    This is index page.
                </div>
            </Layout>
        )
}