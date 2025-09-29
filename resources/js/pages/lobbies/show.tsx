import AppLayout from "@/layouts/app-layout";
import { Head, usePage } from "@inertiajs/react";
import { Lobby, SharedData } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import LobbyGame from "@/pages/lobbies/lobby-game";
import {route} from "ziggy-js";


export default function LobbyShow({ lobby, user_id }: { lobby: Lobby; user_id: number }) {
    const { auth } = usePage<SharedData>().props;

    return (
        <AppLayout breadcrumbs={[{ title: "Dashboard", href: "/dashboard" }, { title: lobby.name }]}>
            <Head title={`Lobby: ${lobby.name}`} />

            <Card className="shadow-lg rounded-xl">
                <CardHeader>
                    <CardTitle>Game</CardTitle>
                </CardHeader>
                <CardContent>
                    <LobbyGame lobby={lobby} />
                </CardContent>
            </Card>

            <div className="flex flex-col px-4 py-8 gap-8">
                <Card className="shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <img
                                src={lobby.image}
                                alt={lobby.name}
                                className="h-10 w-10 rounded-full object-cover"
                            />
                            <span className="truncate">{lobby.name}</span>
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm mb-1">
                            Mode: <span className="font-medium">{lobby.mode}</span>
                        </p>
                        <p className="text-sm mb-1">
                            Years:{" "}
                            <span className="font-medium">
                                {lobby.years ? lobby.years.split(",").join(" - ") : "N/A"}
                            </span>
                        </p>
                        <p className="text-sm mb-1">
                            Created by: <span className="font-medium">{lobby.owner?.username}</span>
                        </p>
                    </CardContent>
                </Card>

                <Card className="shadow-lg rounded-xl">
                    <CardHeader>
                        <CardTitle>Players</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ul className="flex flex-wrap gap-3">
                            {lobby.users.map((user) => (
                                <li
                                    key={user.id}
                                    className={`px-3 py-1 rounded-full text-sm ${
                                        user.id === user_id
                                            ? "bg-blue-600 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    }`}
                                >
                                    {user.username}
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>

                {auth.user && (
                    <div className="flex justify-end">
                        <Button
                            asChild
                            variant="destructive"
                            className="hover:opacity-90 flex items-center justify-center"
                        >
                            <a href={route("lobbies.leave", lobby.id)}>Leave Lobby</a>
                        </Button>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
