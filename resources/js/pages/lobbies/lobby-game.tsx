import {useEffect, useState, useCallback, useRef} from "react";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import { Lobby, SharedData } from "@/types";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import SongCard from "@/components/song-card";
import {useLobbyEcho} from "@/hooks/use-lobby-echo";
import AnswersList, {Answer} from "@/components/answers-list";
import OptionsGrid, {GameResult, QuestionOption} from "@/components/options-grid";
import {useLobbyApi} from "@/hooks/use-lobby-api";

export interface Question {
    cover: string;
    audio: string;
    options: QuestionOption[];
}

interface LobbyWithHost extends Lobby {
    user_id?: number;
}

export default function LobbyGame({ lobby }: { lobby: LobbyWithHost }) {
    const { auth } = usePage<SharedData>().props;
    const isHost = auth.user?.id === (lobby.user_id ?? lobby.owner.id);

    const [question, setQuestion] = useState<Question | null>(null);
    const [answers, setAnswers] = useState<Answer[]>([]);
    const [result, setResult] = useState<GameResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [hasAnswered, setHasAnswered] = useState(false);

    const csrfToken = (document.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content;
    const post = useCallback(
        async (url: string, body?: Record<string, any>) => {
            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "X-CSRF-TOKEN": csrfToken,
                    "Accept": "application/json",
                    ...(body && { "Content-Type": "application/json" }),
                },
                body: body ? JSON.stringify(body) : undefined,
            });
            return res.json();
        },
        [csrfToken]
    );

    useLobbyEcho(lobby.id, csrfToken, {
        onQuestion: (q) => {
            setQuestion(q);
            setAnswers([]);
            setResult(null);
            setHasAnswered(false);
        },
        onAnswer: (ans) => setAnswers(prev => [...prev, ans]),
        onResult: (res) => setResult(res),
    });

    const startRound = async () => {
        setLoading(true);
        try {
            const data = await post(route("lobbies.next-question", lobby.id));
            setQuestion(data.question);
            setAnswers([]);
            setResult(null);
            setHasAnswered(false);
        } finally {
            setLoading(false);
        }
    };

    const { sendAnswer, nextQuestion } = useLobbyApi(lobby.id);
    const handleAnswer = async (option: QuestionOption) => {
        if (hasAnswered) return;
        setHasAnswered(true);

        try {
            await sendAnswer(option);
        } catch (e) {
            console.error(e);
            setHasAnswered(false);
        }
    };

    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const toggleAudio = () => {
        if (!audioRef.current) return;
        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
        } else {
            audioRef.current.play();
            setIsPlaying(true);
        }
    };

    if (!question) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                {isHost ? (
                    <Button
                        onClick={startRound}
                        disabled={loading}
                        size="lg"
                        className="rounded-2xl shadow-md"
                    >
                        {loading ? "Loading..." : "Start Round"}
                    </Button>
                ) : (
                    <p className="text-muted-foreground">Waiting for host to start…</p>
                )}
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center gap-6 w-full max-w-3xl mx-auto">
            {result && (
                <div className="mt-4 text-center">
                    {result.winner ? (
                        <p className="font-semibold text-green-600">
                            Победитель: {result.winner.username}
                        </p>
                    ) : (
                        <p className="font-semibold text-red-500">
                            В этом раунде победителей нет
                        </p>
                    )}
                </div>
            )}

            <Card className="w-full shadow-lg rounded-2xl overflow-hidden">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-semibold">
                        Guess the Song
                    </CardTitle>
                </CardHeader>

                <CardContent className="flex flex-col items-center gap-4">
                    <SongCard cover={question.cover} audio={question.audio} />
                    <OptionsGrid
                        result={result}
                        options={question.options}
                        onAnswer={handleAnswer}
                        disabled={hasAnswered}
                    />
                </CardContent>
            </Card>

            <Card className="w-full shadow-md rounded-2xl">
                <CardHeader>
                    <CardTitle className="text-lg font-semibold">Answers</CardTitle>
                </CardHeader>
                <CardContent>
                    <AnswersList answers={answers} />
                </CardContent>
            </Card>
        </div>
    );
}
