import React from 'react'
import dynamic from 'next/dynamic'

type Props = {}

export default function EditPlans({}: Props) {
    const BasicMap = dynamic(
        () => import('../../../components/Map/BasicMap'), 
        { ssr: false }
    )
    
    return (
        <div style={{width: "100vw", height: "calc(100vh - 60px)"}}>
            <BasicMap />
        </div>
    )
}