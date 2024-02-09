'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import kakaologin from '../../../../public/kakao_login_medium_narrow.png'

export default function LoginBtn() {
  let img = kakaologin
  return (
    <Image
      src={kakaologin}
      fit ={true}
      onClick={() => {
        signIn('kakao')
      }}
    />
  )
}
