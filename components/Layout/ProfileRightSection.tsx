import { useAuth } from 'hooks/context'
import React, { Dispatch, SetStateAction } from 'react'
import styled from 'styled-components'
import { autherInfo, recommendCardArray } from 'types'
import Profile from './Profile'
import RecommendList from '../Common/Card/RecommendList'


interface Props {
    auther: autherInfo,
    recommendList: recommendCardArray,
    setOverlayDisplay: Dispatch<SetStateAction<string>>,
    profileUrl: string,
    username: string,
}


export default function ProfileRightSection({ 
    auther, 
    recommendList, 
    setOverlayDisplay, 
    profileUrl, 
    username }: Props){

    const { authUser } = useAuth()

    return (
        <Wrapper>
            { ( authUser && authUser.uniqname === auther.uniqname ) &&
                <Profile
                    profileUrl={profileUrl}
                    username={username}
                    setOverlayDisplay={setOverlayDisplay}
                />
            }
            <RecommendList recommendList={recommendList}/>
        </Wrapper>
    )
}

const Wrapper = styled.div`
    margin-top: 50px;
    margin-bottom: 50px;
    margin-left: 50px;
    width: 100%;
    max-width: 310px;
    display: flex;
    flex-direction: column;
`