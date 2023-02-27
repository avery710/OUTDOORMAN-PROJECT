export default function PublishButton({ setPublishOverlay }: any){

    function handlePublish(){
        setPublishOverlay("flex")
    }

    return (
        <button onClick={handlePublish}>
            Publish
        </button>
    )
}