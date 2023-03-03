import Header from "./Header"
import Contents from 'components/Layout/Contents'


export default function MePage({ loaded, list, setDeleteId, setOverlayDisplay, headerTitle, path }: any){
    return (
        <>
            <Header title={headerTitle} />
            { loaded ?
                <Contents 
                    list={list}
                    setDeleteId={setDeleteId}
                    setOverlayDisplay={setOverlayDisplay}
                    path={path}
                />
                :
                <div>loading...</div>
            }
        </>
    )
}