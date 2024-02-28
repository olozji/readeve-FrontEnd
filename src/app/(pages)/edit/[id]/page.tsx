import NavBar from "@/app/components/NavBar";
import EditorComponent from "../EditComponent"

const Edit = () => {
  return (
    <><NavBar/>
    <EditorComponent params={{
        id:"",
    }}
    >
      </EditorComponent>
      </>
  )
}

export default Edit;