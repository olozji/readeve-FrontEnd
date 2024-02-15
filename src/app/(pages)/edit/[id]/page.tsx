'use client';

import { BookSearch } from "@/app/components/bookSearch";
import AddPlace from "@/app/components/map";
import { useCallback, useState } from "react";


const Editor = () => {

    const [content, setContent] = useState("");
    const [showMap, setShowMap] = useState(false);
 
    const handleSearchMap = useCallback((e:any) => {
        e.preventDefault();
        setShowMap(true);
    },[])

    const handleCloseMap = useCallback(() => {
        setShowMap(false);
    }, []);



    return (
    <div className="flex justify-center mx-auto box-border min-h-full">
       <div className="w-full px-5 py-10 sm:px-10 md:px-20 lg:px-40 xl:px-80 border border-slate-400 rounded-md">
       <header className="h-10">
            <h1>기록하기</h1>
        </header>
        <h1 className="py-8">제목</h1>
        {/* 추후에 받아올 지도 장소 */}
        <section className="py-8 flex gap-10 border border-slate-400 rounded-t-md">
            <h4 className="px-5">where</h4>
            <div className='input_box w-full'>
            <button
            className="border-slate-400 rounded-md bg-slate-200"
            onClick={handleSearchMap}
            >
                지도 검색하기
            </button>
            {showMap && <AddPlace onClose={handleCloseMap} />}
            </div>
        </section>
        <section className="py-8 flex gap-10 border border-slate-400">
            <h4 className="px-5">Book</h4>
            <div>
            <BookSearch></BookSearch>
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
       </div>
        </div>
    )
}


export default Editor;
