import {initializeSocketConnection} from "../service/chat.socket.js";
import { sendMessage , getChats, getMessages , deleteChat } from "../service/chat.api.js";   
import {useDispatch} from "react-redux";


export const useChat = () => {
    const dispatch = useDispatch();
    
    return {
initializeSocketConnection,
    }
    
}