import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { route } from "ziggy-js";
import { Lobby } from "@/types";

export const LobbyCard = ({ lobby }: { lobby: Lobby }) => {
    return (
        <Card className="backdrop-blur shadow-lg rounded-xl hover:shadow-xl transition-all">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 overflow">
                    <img
                        src={lobby.image}
                        alt={lobby.name}
                        className="h-8 w-8 rounded-full object-cover"
                    />
                    <span className="truncate">{lobby.name}</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm mb-1">
                    Mode: <span>{lobby.mode}</span>
                </p>
                <p className="text-sm mb-1">
                    Years:{" "}
                    <span>
                        {lobby.years ? lobby.years.split(",").join(" - ") : "N/A"}
                    </span>
                </p>
                <p className="text-xs mt-2 truncate">
                    Current players: {lobby.users.map((u) => u.username).join(", ")}
                </p>
                <p className="text-xs mt-2">
                    Created by {lobby.owner?.username}
                </p>

                <Button
                    asChild
                    className="mt-4 w-full hover:opacity-90 flex items-center justify-center"
                >
                    <a href={route("lobbies.show", lobby.id)}>
                        Join Lobby
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                </Button>
            </CardContent>
        </Card>
    );
};
