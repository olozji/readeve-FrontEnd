import { atom, selector } from "recoil";

export interface mapData {
    id: string;
    lat:number;
    lng:number;
    address:string;
    ionUrl?:string;
}

// 공유지도의 마커들
export const sharedMarkerState = atom<mapData[]>({
    key:'sharedMarkerState',
    default:[],
})

// 개인지도의 마커들
export const markersState = atom<mapData[]>({
    key:'markersState',
    default:[],
})

// 유저의 방문 기록 전부 가져오기
export const userVisitedState = atom({
    key:'userVisitedState',
    default:[],
})

// 지도에서 전체 방문수 
export const totalVisitedSelect = selector({
    key:'totalVisitedSelect',
    get:({get}) => {
        const visitedPlace = get(userVisitedState);
        return visitedPlace.length;
    }
})
export const mapState = atom({
    key: 'mapState',
    default:null
})
