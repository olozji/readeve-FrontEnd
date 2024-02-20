import BookLayoutItem from "../BookLayoutItem"

export interface PropType {
  params: {
    id: string
    searchParams: {}
  }
}

const Detail  = (props:PropType) => {
  return (
    <BookLayoutItem id={props.params.id}>
    </BookLayoutItem>
  )
}

export default Detail;