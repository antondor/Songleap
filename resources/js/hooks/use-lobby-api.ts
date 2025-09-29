import {router} from "@inertiajs/react";
import {route} from "ziggy-js";

export function useLobbyApi(lobbyId: number) {
    const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;

    const sendAnswer = async (option: { artist: string; title: string }) => {
        const res = await fetch(`/api/lobbies/${lobbyId}/answer`, {
            method: "POST",
            headers: {
                "X-CSRF-TOKEN": csrfToken,
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
            body: JSON.stringify(option),
        });

        return res.json();
    };

    const nextQuestion = async () => {
        return router.post(route("lobbies.nextQuestion", lobbyId));
    };

    return { sendAnswer, nextQuestion };
}
