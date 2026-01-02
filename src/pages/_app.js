import { store } from "@/redux/store";
import "@/styles/globals.css";
import { Provider, useSelector } from "react-redux";
import { socket, registerSocketUser } from "../socket/socket";
import { useEffect } from "react";


function SocketManager() {
  const user = useSelector((state) => state.user.user);

  // connect ONCE
  useEffect(() => {
    socket.connect();

    socket.on("connect", () => {
      console.log("✅ Socket connected:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.error("❌ Socket error:", err.message);
    });

    return () => {
      socket.disconnect(); // only on full app unload
    };
  }, []);

  // register user
  useEffect(() => {
    if (!user?.id) return;
    if (!socket.connected) return;

    registerSocketUser(user.id);
  }, [user?.id]);

  // re-register on reconnect
  useEffect(() => {
    if (!user?.id) return;

    const handleReconnect = () => {
      registerSocketUser(user.id);
    };

    socket.on("reconnect", handleReconnect);
    return () => socket.off("reconnect", handleReconnect);
  }, [user?.id]);

  return null;
}

export default function App({ Component, pageProps }) {
  return (
    <Provider store={store}>
      <SocketManager />
      <Component {...pageProps} />
    </Provider>
  );
}
