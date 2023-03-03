import styled from 'styled-components'

export default function DeleteTooltip({ tooltipDisplay, path, setOverlayDisplay, setDeleteId, uuid }: any) {

    function handleClick(){
        setOverlayDisplay("flex")
        setDeleteId(uuid)
    }

    return tooltipDisplay && (
        <>
            <Tooltip>
                <DeleteButton onClick={handleClick}>
                    Delete {path === "new-story" ? "draft" : "plan"}
                </DeleteButton>
            </Tooltip>
            <Triangle/>
            <TriangleBorder />
        </>
    )
}

const Tooltip = styled.div`
    position: absolute;
    border-radius: 3px;
    height: fit-content;
    background-color: white;
    transform: translateX(-50%);
    top: 105%;
    left: 50%;
    border: 1px solid rgba(230, 230, 230, 1);
    box-shadow: 1px 1px 2px 1px rgba(0, 0, 0, 0.05);
    z-index: 10;
`

const DeleteButton = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 110px;
    height: 45px;
    background: none;
    border: none;
    padding: 5px;
    font-family: 'Montserrat', sans-serif;
    color: rgb(201, 74, 74);
    cursor: pointer;
`

const Triangle = styled.div`
    position: absolute;
    transform: translateX(-50%);
    top: 80%;
    left: 50%;
    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid white;
    border-radius: 2px;
    z-index: 11;
`

const TriangleBorder = styled.div`
    position: absolute;
    transform: translateX(-50%);
    top: 74%;
    left: 50%;

    width: 0;
    height: 0;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-bottom: 10px solid rgba(230, 230, 230, 1);
    z-index: 9;
`