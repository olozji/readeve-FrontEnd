import { atom, selector } from "recoil";

export const authState = atom({
    key:'authState',
    default:false,
})

export const sessionState = atom({
    key:'sessionState',
    default:false,
})

export const loginSelector = selector({
    key:'loginSelector',
    get: ({get}) => {
       const auth = get(authState);
       const session = get(sessionState);
       return {auth, session};
    },
    set:({set}) => {
        set(authState, true);
    }
}) 

