import BookLayoutItem from "../BookLayoutItem"

export interface PropType {
  params: {
    id: string;
    searchParams: {};
  }
}

const Detail = (props: PropType) => {
  return (
    <BookLayoutItem params={props.params}>
      {props}
    </BookLayoutItem>
  );
};

export default Detail;