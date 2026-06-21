import {io} from "socket.io-client";

export const initializeSocketConnection = (token) => {
    const socket = io(import.meta.env.VITE_API_URL || "https://purplex.onrender.com", {
       withCredentials : true
    })
    socket.on("connect", () => {
        console.log("Connected to socket server");
    });

    socket.on("disconnect", () => {
        console.log("Disconnected from socket server");
    });

}