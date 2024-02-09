'use client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'

export default function Home() {
  let session = useSession()
  if (session) {
    console.log(session)
  }
  return (
    <div>
      <div>읽는곳곳</div>
      {session.data ? (
        <div>
          {session.data.user?.name}
          <Image
            src={session.data.user?.image}
            width={100}
            height={100}
            alt="Picture of the author"
          />
        </div>
      ) : (
        <div>로그인된 정보 X</div>
      )}
    </div>
  )
}
