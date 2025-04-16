import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL =
  typeof window !== "undefined" && window.location.hostname === "localhost"
    ? "https://backend.stage.cricap.com/"
    : "https://ws.cricap.com/";

type UseSocketReturnType = {
  socket: Socket | null;
  emitEvent: (event: string, data: any) => void;
  onEvent: (event: string, callback: (data: any) => void) => () => void;
};

const useSocket = (nameSpace: string): UseSocketReturnType => {
  const [token, setToken] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const authData = JSON.parse(localStorage.getItem("auth") || "{}");
        if (authData.jwt) {
          console.log("Auth token retrieved:", authData.jwt);
          setToken(authData.jwt);
        }
      } catch (error) {
        console.error("Error retrieving token from localStorage:", error);
      }
    };

    fetchToken();
  }, []);

  useEffect(() => {
    // if (!token) return;

    console.log("Initializing socket for:", `${SOCKET_URL}${nameSpace}`);

    socketRef.current = io(`${SOCKET_URL}${nameSpace}`, {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ["websocket"],
    });

    setSocketInstance(socketRef.current);

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server, ID:", socketRef.current?.id);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("Socket connection error:", err);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocketInstance(null);
      }
    };
  }, [token, nameSpace]);

  const emitEvent = (event: string, data: any) => {
    if (socketInstance) {
      socketInstance.emit(event, data);
    } else {
      console.warn("Attempted to emit event, but socket is not initialized.");
    }
  };

  const onEvent = (event: string, callback: (data: any) => void) => {
    if (socketInstance) {
      socketInstance.on(event, callback);
      return () => {
        socketInstance.off(event, callback);
      };
    }
    return () => {};
  };

  return {
    socket: socketInstance,
    emitEvent,
    onEvent,
  };
};

export default useSocket;
