import Link from 'next/link'
import styled from 'styled-components'

export default function Card({title, uuid, date, setDeleteId, setOverlayDisplay}: any){
    function handleDelete(){
        setOverlayDisplay("flex")
        setDeleteId(uuid)
    }

    return (
        <CardContainer>
            <TitleWrapper>
                <Link href={`/plan/${uuid}`}>
                    {title}
                </Link>
            </TitleWrapper>
            <InfoWrapper>
                <div>Last edited {date}</div>
                <button onClick={handleDelete}>delete</button>
            </InfoWrapper>
        </CardContainer>
    )
}

const CardContainer = styled.div`
    height: fit-content;
    width: 400px;
    border-bottom: 1px solid black;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-around;
    padding: 20px
`

const TitleWrapper = styled.div`
    height: 20px
    font-weight: 700;
    margin-bottom: 10px;
`

const InfoWrapper = styled.div`
    color: #B0B0B0;
    display: flex;
    height: 20px
`