import { create} from "zustand";
import { createAuthslice} from "./slices/auth-slice";
import { createChatSlice } from "./slices/chat-slice";

export const useAppStore = create()((...a)=>({
    ...createAuthslice(...a),
    ...createChatSlice(...a),
}))