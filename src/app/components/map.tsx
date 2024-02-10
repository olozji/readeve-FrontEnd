/*global kakao */
import React, { useEffect, useState } from 'react';

import MapSearch from './mapSearch';
import searchIcon from 'public/images/searchIcon.png'
import Image from 'next/image';

const AddPlace = (()=>{
  const [InputText, setInputText] = useState('') // 추가할 장소이름 검색
  const [Place, setPlace] = useState('') // 추가할 장소 데이터 설정

  const onChange = (e:any) => {
    setInputText(e.target.value)
  }

  const handleSubmit = (e:any) => {
    e.preventDefault()
    setPlace(InputText)
    setInputText('')
  }

  return (
    <>
      <form className="inputForm" onSubmit={handleSubmit}>
        <div className = "addSearchDiv">
        <div className="searchInputDiv">
        <input
              type="text" size={50} defaultValue=""
              placeholder="장소를 검색하세요"
              onChange={onChange}
              value={InputText}/>
          {/* <Image id="searchIcon" onClick={handleSubmit} src={searchIcon} alt='search'/> */}
          </div>
          <div className="buttonDiv">
          <button type="submit" style={{display:"none"}}>enterKey시 검색할 수 있는 형식상 submit 버튼</button>
          <button id="searchBtn" onClick={handleSubmit}>검색</button>
          </div>
          </div>
      </form>
      
    
      <MapSearch searchPlace={Place} />
      {/*검색한 값을 props로 MapSearch 컴포넌트로 보냄*/ }
    </>
  )
})
// AddPlaceMap 컴포넌트에 이름으로 검색한 장소 데이터 전달
export default AddPlace;