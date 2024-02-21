import { PropType } from "../../detail/[id]/page";
import MyPageComponent from "./MyPage";

const MyPage = (props:PropType) => {
  return (
    <MyPageComponent id={props.params.id}></MyPageComponent>
  )
};

export default MyPage;