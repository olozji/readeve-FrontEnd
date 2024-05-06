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
    default: [{content:'잔잔한 음악이 흘러요',selected:false},{content:'날씨 좋은날 테라스가 좋아요',selected:false},{content:'카공하기 좋아요',selected:false},{content:'힙합BGM이 흘러나와요',selected:false},{content:'조용해서 좋아요',selected:false},{content:'한적해요',selected:false},{content:'자리가 많아요',selected:false},{content:'차마시기 좋아요',selected:false},{content:'귀여운 고양이가 있어요🐈',selected:false},{content:'책을 무료로 대여해줘요📚',selected:false}]
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
    default:[],
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

