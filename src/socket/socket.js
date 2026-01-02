import { io } from "socket.io-client";

const SOCKET_URL =   process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_DEVELOPMENT_URL
    : process.env.NEXT_PUBLIC_PRODUCTION_URL;

export const socket = io(SOCKET_URL, {
  autoConnect: false, // important
  transports: ["websocket"],
});



export const registerSocketUser = (userId) => {
  if (!userId) return;

  if (socket.connected) {
    socket.emit("register-user", userId);
  } else {
    socket.once("connect", () => {
      socket.emit("register-user", userId);
    });
  }
};



const logout = () => {
  socket.disconnect();

};
