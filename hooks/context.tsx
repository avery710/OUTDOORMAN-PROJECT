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

export function AuthUserProvider({ children }: any){
    const currentAuth = useFirebaseAuth()

    return (
        <UserContext.Provider value={currentAuth}>
            { children }
        </UserContext.Provider>
    )
}

export const useAuth = () => useContext(UserContext)