import NavBar from "@/app/components/NavBar";
import BookLayoutItem from "../BookLayoutItem"

export interface PropType {
  params: {
    id: string
    searchParams: {}
  }
}

const Detail  = (props:PropType) => {
  return (
    <><NavBar/>
    <BookLayoutItem id={props.params.id}>
      </BookLayoutItem>
      </>
  )
}

export default Detail;