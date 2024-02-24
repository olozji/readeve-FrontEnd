import { PropType } from "../../detail/[id]/page";
import MyPageComponent from "./MyPage";
import markerImage from '/public/images/marker1.png'
import markerImageOpacity from '/public/images/marker2.png'



const MyPage = (props:PropType) => {
  return (
    <MyPageComponent id={props.params.id} markerImage={markerImage} markerImageOpacity={markerImageOpacity}></MyPageComponent>
  )
};

export default MyPage;