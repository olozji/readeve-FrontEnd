import { atom } from "recoil";

export interface mapData {
    lat:number;
    lng:number;
    address:string;
}

export const markersState = atom<mapData[]>({
    key:'markersState',
    default:[],
})