import React from 'react'
import dynamic from 'next/dynamic'
import PlannerStyle from '../styles/Planner.module.css'
import Head from "next/head"

type Props = {}

export default function Planner({}: Props) {
    const MapForPlan = dynamic(
        () => import('../components/MapForPlan'), 
        { 
            ssr: false 
        }
    )
      
    return (
        <div className={PlannerStyle.planner}>
            {/* <Head>
                <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.3/dist/leaflet.css"
                integrity="sha256-kLaT2GOSpHechhsozzB+flnD+zUyjE2LlfWPgU04xyI=" crossOrigin=""/>

                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/leaflet.min.css" />
                <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/leaflet.draw/1.0.4/leaflet.draw.css"/>
            </Head> */}
            <MapForPlan />
        </div>
    )
}