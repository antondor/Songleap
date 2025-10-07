import { useEffect } from "react";
import Echo from "laravel-echo";

export function useLobbyEcho(
    lobbyId: number,
    csrfToken: string,
    {
        onQuestion,
        onAnswer,
        onResult,
    }: {
        onQuestion: (q: any) => void;
        onAnswer: (a: any) => void;
        onResult: (r: any) => void;
    }
) {
    useEffect(() => {
        const echo = new Echo({
            broadcaster: "pusher",
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true,
            authEndpoint: "/broadcasting/auth",
            auth: {
                headers: { "X-CSRF-TOKEN": csrfToken },
            },
        });

        echo.join(`lobby.${lobbyId}`)
            .listen(".LobbyGameQuestion", (e: any) => onQuestion(e.question))
            .listen(".LobbyGameAnswer", (e: any) => onAnswer(e.answer))
            .listen(".LobbyGameResult", (e: any) => onResult(e));

        return () => {
            echo.disconnect();
        };
    }, [lobbyId, csrfToken]);
}
