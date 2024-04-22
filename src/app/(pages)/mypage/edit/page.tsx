'use client'
import { useSession } from 'next-auth/react'
import { useState, FormEvent, useEffect } from 'react'


//현재는 클라이언트 사이드에서만 토큰정보가 변경되어서 로그아웃 후 재 로그인 하면 변경내용이 유지가 안됨. 백엔드와 상의 필요
const ProfilePage = () => {
  const [name, setName] = useState('')
  const [imagePreview, setImagePreview] = useState<string>('');
    
    const { data: session, status, update } = useSession()
    //TODO:AWS s3 활용해서 이미지 url 길이 줄이기
  const updateSession = () => {
    update({
        user: { name: name ,image:imagePreview}
    })
    console.log(session)
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    }
  };
    useEffect(() => {
        if (session) {
            setImagePreview(session!.user!.image!)

        }
},[session])
  if (status === 'authenticated') {
    return (
      <>
            <p>Signed in as {session.user!.name}</p>

        <div>
          <label htmlFor="name">이름:</label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="container mx-auto p-4">
      <form className="flex flex-col items-center gap-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
        />
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-full object-cover" />
        )}
      </form>
    </div>
        <button onClick={updateSession}>Edit name</button>
       
      </>
    )
  }

  return <a href="/api/auth/signin">Sign in</a>
}

export default ProfilePage
