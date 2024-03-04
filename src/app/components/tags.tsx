import { tagState } from "@/store/writeAtoms";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";


interface TagProps {
    tags:any[];
    limit?:number;
    showModal?:boolean;
}

export const Tag = ({tags, limit = tags.length, showModal = false} : TagProps) => {
    
    const [tagInfo,setTagInfo] = useRecoilState(tagState)
    
    useEffect(() => {
    //    console.log(tagInfo)
   },[tagInfo])


    const handleTagClick = (i: number) => {
        // 선택된 태그의 상태를 변경
        const updatedTags = tagInfo.map((tag: any, index: number) => {
            if (index === i) {
                return { ...tag, selected: !tag.selected };
            }
            return tag;
        });
        setTagInfo(updatedTags)
    };

    const renderTags = showModal ? tags : tags.slice(0, limit);

    return (
        <div className="flex flex-wrap justify-center sm:px-10 ">

            {renderTags.map((d: any, i: number) => (
                <div 
                    key={i}
                    className={`box-border flex justify-center items-center px-4 py-2 my-2 mx-2 border border-gray-300 rounded-full ${
                        tags[i].selected
                          ? 'bg-[#E57C65] text-white'
                          : 'bg-white hover:border-[#C05555] hover:text-[#C05555]'
                      }`}

                    onClick={() => handleTagClick(i)}
                >
                    #{d.content}
                </div>
            ))}
        </div>
    );
};
