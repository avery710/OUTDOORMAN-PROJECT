import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react'
import Link from 'next/link'
import { useAuth } from '../../hooks/context'
import styled from 'styled-components';


export default function Toolbar({ visibility }: any) {
    
    const { signOutGoogle, authUser } = useAuth()

    async function handleLogOut(){
        await signOutGoogle()
        window.location.href = "/"
    }

    return (
        <ToolbarContainer visibility={visibility}>
            <Ul>
                <Li>
                    <Link href={`/${authUser?.uniqname}/`}>Profile</Link>
                </Li>
                <Li>
                    <Link href="/me/stories">Story drafts</Link>
                </Li>
                <Li>
                    <Link href="/me/plans">Plans</Link>
                </Li>
                <Li>
                    <SignOutWrapper>
                        <SignOutButton onClick={handleLogOut}>Sign out</SignOutButton>
                        <Email>{authUser?.email}</Email>
                    </SignOutWrapper>
                    
                </Li>
            </Ul>
        </ToolbarContainer>
    )
}


interface toolbarProps {
    visibility: string;
}

const ToolbarContainer = styled.div<toolbarProps>`
    position: absolute;
    height: fit-content;
    right: 10px;
    top: 62px;
    border: 1px solid rgb(234, 234, 234);
    border-radius: 5px;
    z-index: 100000;
    background-color: white;
    visibility: ${props => props.visibility};
    transition: all .1s ease-in-out;
`

const Ul = styled.ul`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    list-style: none;
    color: black;
    margin: 0;
    padding-left: 0;
    height: fit-content;
    color: rgb(70, 70, 70);
`

const Li = styled.li`
    line-height: 20px;
    font-size: 14px;
    width: fit-content;
    min-width: 240px;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    border-bottom: 1px solid rgb(234, 234, 234);
    padding: 20px;
`

const SignOutWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

const Email = styled.div`
    padding-top: 16px;
    font-size: 12px;
`

const SignOutButton = styled.button`
    border: none;
    background-color: white;
    color: rgb(70, 70, 70);
    cursor: pointer;
    padding: 0;
    font-family: 'Montserrat', 'Noto Sans TC', sans-serif;
`