'use client';

import { useCallback, useContext, useEffect, useRef, useState } from "react";

const Editor = () => {

    const contentRef = useRef();
    const [content, setContent] = useState("");
    const [emotion, setEmotion] = useState(3);

    const [date, setDate] = useState();

    const [ image, setImage] = useState('');
    const [ loading, setloading] = useState(false);
        
    

    const handleClickEmotion = useCallback(()=>{
            setEmotion(emotion);
    },[]);



   const handleSubmit = () => {
    if(content.length < 1) {
        //contentRef.current.focus();
        return;
    }
//     if(window.confirm(
//         isEdit ? '해당 일기를 수정하시겠습니까?' : '새로운 일기를 작성하시겠습니까?'
//         )
//         ){
//          if(!isEdit){
//             onCreate(date, content, emotion, image);
//     }else {
//          onEdit(originData.id, date, content, emotion, image);
//     }   
//   }
   }

    const handleRemove = () => {
        if(window.confirm(
            '정말 삭제하시겠습니까?'
        )){
        }
    }


    const upLoadingImg= async (e:any) => {
        const files = e.target.files;
        const data = new FormData();
        data.append('file', files[0]);
        data.append('upload_preset', 'nrwpmxgs');
        setloading(true);
        const res = await fetch(
            'https://api.cloudinary.com/v1_1/dxgin55zt/upload/',
            {
            method:'POST',
            body:data
            }
        )
        const file = await res.json();
        setImage(file.secure_url);
        setloading(false);
    }
      


    return (
        <div className="flex justify-center mx-auto box-border min-h-full">
       <form className="w-full px-5 py-10 sm:px-10 md:px-20 lg:px-40 xl:px-80 border border-slate-400 rounded-md">
       <header className="h-10">
            <h1>기록하기</h1>
        </header>
        <h1 className="py-8">제목</h1>
        {/* 추후에 받아올 지도 장소 */}
        <section className="py-8 flex gap-10 border border-slate-400 rounded-t-md">
            <h4 className="px-5">where</h4>
            <div className='input_box'>
            <input 
            className="border-slate-400 rounded-md bg-slate-200"
            placeholder="독서한 장소를 입력해주세요"
            type="text"
            />
            </div>
        </section>
        <section className="py-8 flex gap-10 border border-slate-400">
            <h4 className="px-5">when</h4>
            <div className='input_box'>
            <input 
            className="input_date"
            value={date}
            type="date"
            />
            </div>
        </section>
        <section className="py-8 flex gap-10 border border-slate-400">
            <h4 className="px-5">나의 한줄평</h4>
            <div className="input_box emotion_list_wrapper">
                <input 
                className="border-slate-400 rounded-md bg-slate-200"
                placeholder="예시)재미있었다"/>
            </div>
        </section>
        <section className="py-8 flex border border-slate-400 gap-3">
            <h4 className="px-5">tag</h4>
            <div className="tag_name flex gap-3">
                <div className="border bg-slate-200 rounded-md">#조용한</div>
                <div className="border bg-slate-200 rounded-md">#시끄러운</div>
                <div className="border bg-slate-200 rounded-md">#고양이</div>
            </div>
        </section>
        <section className="py-8 flex border border-b-0 border-slate-400 gap-3">
            <div className="tag_name flex mx-auto gap-5">
                <div className="border bg-red-200 rounded-md">나만보기 </div>
                <div className="border bg-indigo-200 rounded-md">전체보기</div>
            </div>
        </section>
        <section className="py-8 border border-t-0 border-slate-400 rounded-b-md">
            <h4 className="px-5">이미지</h4>
            <div className="px-5 py-8 image">
                <label htmlFor="image_input">
                <img className="image_icon"/>
                    </label>
                    <input
                        type="file"
                        name="file"
                        placeholder ="이미지 업로드 테스트"
                        id="image_input"
                        onChange = {upLoadingImg}
                    />
                    {loading ? (
                        <h3>Loading...</h3>
                    ):(
                        <img src={image} style={{width:'300px'}}/>
                    )}
                    <div className="flex gap-4 px-5 py-8">
                    <div className="w-64 h-64 border bg-slate-200 rounded-md">이미지</div>
                    <div className="w-64 h-64 border bg-slate-200 rounded-md">이미지</div>
                    <div className="w-64 h-64 border bg-slate-200 rounded-md">이미지</div>
                    </div>
                    </div>
            <div className="px-5 py-8">
                <textarea
                className="border border-slate-200 rounded-md w-full h-80 bg-slate-200"
                placeholder="오늘 나의 독서는..."
                value={content}
                onChange={(e)=>setContent(e.target.value)}
                /> 
            </div>
        </section>
        <section>
            <div className="control_btn flex gap-5">
                <button className="bg-red-300 rounded-md">취소하기</button>
                <button className="bg-indigo-400 rounded-md">작성완료</button>
            </div>
        </section>
       </form>
        </div>
    )
}


export default Editor;
