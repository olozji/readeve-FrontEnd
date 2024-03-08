import { atom, selector } from "recoil";

export interface ReviewData {
    id?:number;
    date?:string;
    title?:string;
    place?:string;
    category?:string;
    description?:string;
    isFavorite?:boolean;
    image?:string;
    tag?: {
        rate?: number;
        count?: number;
      };
    private?:boolean;
}

// 독후감 배열
export const reviewState = atom<ReviewData[]>({
    key:'reviewState',
    default:[],
})

export const selectedReviewState = atom<ReviewData | null>({
    key:'selectedReviewState',
    default:null,
})
export const bookState = atom({
    key: 'bookState',
    default: {}
})
export const tagState = atom({
    key: 'tagState',
    default:[]
})
export const mainTagState = atom({
  key: 'mainTagState',
  default: [false,false,false,false,false,false,false,false,false,false],
})
export const titleState = atom({
  key: 'titleState',
  default: ''
})
export const placeState = atom({
  key: 'placaeState',
  default:{}
})
export const allDataState = atom({
  key: 'allDataState',
  default:{},
})
// 리뷰 필터링
export const filterReviewState = atom({
    key:'filterReviewState',
    default:'전체'
})
// 모든 리뷰데이터 호출
export const allReviewDataState = atom({
  key: 'allReviewDataState',
  default:[]
})

// 리뷰 수정 아톰
export const editReivewState = atom<number | null>({
    key:'editReivewState',
    default:null,
})

// 리뷰 삭제 아톰
export const removeReivewState = atom<number | null>({
  key:'removeReivewState',
  default:null,
})

// 모든 공유리뷰 호출
export const allReviewSelector = selector({
    key:'allReviewSelector',
    get:({get}) => {
        
    }
})

export const sortOptionState = atom({
  key: 'sortOptionState',
  default: 'latest', 
});

export const filteredReviewsState = selector({
  key: 'filteredReviewsState',
  get: ({ get }) => {
    const filterReview = get(filterReviewState);
    let allReviews = get(reviewState);

  
    if (filterReview === '최신등록순') {
      return allReviews.slice().reverse(); 
    } else if (filterReview === '오래된 순') {
      return allReviews; 
    }

    return allReviews;
  },
});
  
// 상품 API 가져오기
export const getReviewData = selector({
    key:'getReviewData',
    get: async () => {
        const res = await fetch('https://fakestoreapi.com/products/');
        const data = await res.json();
        return data;
    }
}) ;




export const deleteReview = async (reviewId: any) => {
    // 후에 API에서 독후감 삭제
    await fetch('', { method: 'DELETE' });

}