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
        <div className="DiaryEditor">
         <header>
            기록하기
        </header>
       <div>
        <section>
            <h4>오늘은 언제인가요?</h4>
            <div className='input_box'>
            <input 
            className="input_date"
            value={date}
            onChange={(e)=>setDate(e.target.value)}
            type="date"
            />
            </div>
        </section>
        <section>
            <h4>나의 한줄평</h4>
            <div className="input_box emotion_list_wrapper">
            </div>
        </section>
        <section>
            <h4>오늘의 기록</h4>
            <div className="image">
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
                    </div>
            <div className="input_content">
                <textarea
                placeholder="오늘 나의 기분은..."
                value={content}
                onChange={(e)=>setContent(e.target.value)}
                /> 
            </div>
        </section>
        <section>
            <div className="control_btn">
                <button>취소하기</button>
                <button>작성완료</button>
            </div>
        </section>
       </div>
        </div>
    )
}


export default Editor;
