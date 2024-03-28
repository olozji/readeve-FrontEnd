import NavBar from "@/app/components/NavBar";
import EditorComponent from "../EditComponent"
export interface PropType {
  params: {
    id: number
    searchParams: {}
  }
}
const Edit = (props:PropType) => {
  return (
    <><NavBar/>
    <EditorComponent editReviewId={props.params.id}
    >
      </EditorComponent>
      </>
  )
}

export default Edit;