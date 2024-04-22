'use client'
import { useSession } from 'next-auth/react'
import { useState, FormEvent } from 'react'

const ProfilePage = () => {
  const [name, setName] = useState('')
  const [profilePicUrl, setProfilePicUrl] = useState('')
  const { data: session, status, update } = useSession()
  const updateSession = () => {
    update({
        user: { name: name }
    })
    console.log(session)
  }
  if (status === 'authenticated') {
    return (
      <>
        {/* <p>Signed in as {session.user!.name}</p> */}
        <div>
          <label htmlFor="name">이름:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        {/* <div>
        <label htmlFor="profilePicUrl">프로필 사진 URL:</label>
        <input
          id="profilePicUrl"
          type="text"
          value={profilePicUrl}
          onChange={(e) => setProfilePicUrl(e.target.value)}
        />
      </div> */}
        {/* 업데이트할 정보를 update 메서드의 인수로 전달한다. */}
        <button onClick={updateSession}>Edit name</button>
        {/*
         * 인수없이 update 메서드를 다음과 같이 사용할 수 있다.
         * 이미 서버를 업데이트 했다고 가정했을 때 session update만 트리거 한다.
         * 아직 인수 없이 update 메서드를 사용하는 것에 대한 필요성을 모르겠다.
         */}
      </>
    )
  }

  return <a href="/api/auth/signin">Sign in</a>
}

export default ProfilePage
