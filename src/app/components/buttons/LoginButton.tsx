'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import kakaologin from '/public/images/kakao_login_medium_narrow.png'


export default function LoginBtn({onLogin} : {onLogin?: () => void}) {
  let img = kakaologin
  return (
    <Image
      src={kakaologin}
      fit ={true}
      onClick={ async () => {
        const result = await signIn('kakao');
        if(result?.error) {
          // 로그인 실패시
        } else if (result?.url && onLogin) {
          onLogin();
        }
      }}
    />
  )
}
