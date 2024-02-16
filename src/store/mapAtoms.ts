import { atom } from "recoil";

export interface mapData {
    lat:number;
    lng:number;
    address:string;
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