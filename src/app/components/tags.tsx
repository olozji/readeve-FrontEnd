import { tagState } from "@/store/writeAtoms";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";

export const Tag = () => {
    const [tags,setTags] = useState<any>([{name:'1',selected:false},{name:'2',selected:false},{name:'3',selected:false},{name:'4',selected:false},{name:'5',selected:false}])
    const [tagInfo,setTagInfo] = useRecoilState(tagState)
    
    useEffect(() => {
    //    console.log(tagInfo)
   },[tagInfo])
    const handleTagClick = (i: number) => {
        // 선택된 태그의 상태를 변경
        const updatedTags = tags.map((tag: any, index: number) => {
            if (index === i) {
                return { ...tag, selected: !tag.selected };
            }
            return tag;
        });
        setTags(updatedTags);
        setTagInfo(updatedTags)
    };

    return (
        <div className="grid grid-cols-5 gap-4">
            {tags.map((d: any, i: number) => (
                <div key={i}
                    className={`p-4 rounded${tags[i].selected ? ' rounded-lg border-4 border-blue-500' : ' rounded-lg border-4 border-slate-300'}`}
                    onClick={() => handleTagClick(i)}
                >
                    #{d.name}
                </div>
            ))}
        </div>
    );
};
