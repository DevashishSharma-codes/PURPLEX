import { useDispatch } from "react-redux";
import {register , login , getMe} from "../service/auth.api.js";
import { setUser , setLoading , setError } from "../auth.slice.js";



export const useAuth = () => {
    const dispatch = useDispatch();
   async function handleRegister({email , password , username}){
        try {
            dispatch(setLoading(true));
            const data = await register({email , password , username});
        } catch (error) {
            dispatch(setError(error.message || "Registration failed"));
        } finally {
            dispatch(setLoading(false));
        }     
}

async function handleLogin({ email, password }) {
    try {
        dispatch(setLoading(true));
        const data = await login({ email, password });

        dispatch(setUser(data.user));

       
    } catch (error) {
        dispatch(setError(error.message || "Login failed"));
        throw error; 
    } finally {
        dispatch(setLoading(false));
    }
}

   async function handleGetMe(){
        try {
            dispatch(setLoading(true));
            const data = await getMe();
            dispatch(setUser(data.user));
        } catch (error) {
            dispatch(setError(error.message || "Failed to fetch user data"));
        } finally {
            dispatch(setLoading(false));
        } 
    }

    return {
        handleRegister,
        handleLogin,
        handleGetMe
    };
}