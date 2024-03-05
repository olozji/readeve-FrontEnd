import NavBar from '@/app/components/NavBar'
import { PropType } from '../../detail/[id]/page'
import MyPageComponent from './MyPage'
import markerImage from '/public/images/marker1.png'


const MyPage = (props: PropType) => {
  return (
    <>
      <NavBar />{' '}
      <MyPageComponent
        id={props.params.id}
        markerImage={markerImage}

      ></MyPageComponent>
    </>
  )
}

export default MyPage
