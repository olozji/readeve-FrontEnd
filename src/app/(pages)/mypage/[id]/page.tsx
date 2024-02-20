import axios from 'axios'
import MyPageComponent from './MyPage'

const MyPage = () => {
  return (
    <div>
      <MyPageComponent
        params={{
          id: '',
        }}
      ></MyPageComponent>
    </div>
  )
}

export default MyPage
