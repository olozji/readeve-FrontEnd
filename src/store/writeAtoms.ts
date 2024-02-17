import { atom, selector } from "recoil";



// 독후감 상태
export const writeState = atom({
    key:'writeState',
    default:[],
})

// 모든 공유리뷰 호출
export const allRevieSelector = selector({
    key:'allRevieSelector',
    get:({get}) => {
        
    }
})

export const deleteReview = async (reviewId: any) => {
    // 후에 API에서 독후감 삭제
    await fetch('', { method: 'DELETE' });

}