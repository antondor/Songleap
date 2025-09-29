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
            broadcaster: "reverb",
            key: import.meta.env.VITE_REVERB_APP_KEY,
            wsHost: import.meta.env.VITE_REVERB_HOST ?? window.location.hostname,
            wsPort: Number(import.meta.env.VITE_REVERB_PORT ?? 80),
            wssPort: Number(import.meta.env.VITE_REVERB_PORT ?? 443),
            forceTLS: import.meta.env.VITE_REVERB_SCHEME === "https",
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
