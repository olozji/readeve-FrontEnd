'use client'

import { signIn } from 'next-auth/react'
import Image from 'next/image'
import kakaologin from '/public/images/kakaoLogin.png'


export default function LoginBtn({onLogin} : {onLogin?: () => void}) {
  let img = kakaologin
  return (
    <Image
      src={kakaologin}
      alt=''
      onClick={ async () => {
        const result = await signIn('kakao',{callbackUrl:'http://localhost:8081/login/oauth2/code/kakao'});
        if(result?.error) {
          // 로그인 실패시
        } else if (result?.url && onLogin) {
          onLogin();
        }
      }}
    />
  )
}
