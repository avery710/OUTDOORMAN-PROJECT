import { createContext, useContext } from 'react'
import useFirebaseAuth from './useFirebaseAuth'
import { userType } from '../types'

interface userContextProps {
    authUser: userType | null,
    loading: boolean,
    signInWithGoogle: () => void,
    signOutGoogle:  () => Promise<void>,
}

const UserContext = createContext<userContextProps>({ 
    authUser: null, 
    loading: true,
    signInWithGoogle: () => {},
    signOutGoogle: async () => {},
})

// 可以直接將 JSX component 傳進去
export function AuthUserProvider({ children }: any){
    const currentAuth = useFirebaseAuth()

    return (
        <UserContext.Provider value={currentAuth}>
            { children }
        </UserContext.Provider>
    )
}

// 直接用 useAuth() 取得當前的 auth 資訊
export const useAuth = () => useContext(UserContext)