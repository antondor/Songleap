import { Button } from "@/components/ui/button";
import { route } from "ziggy-js";
import { usePage } from "@inertiajs/react";
import { Lobby, PaginatedData, SharedData } from "@/types";
import { DefaultPagination } from "@/components/default-pagination";
import { LobbyCard } from "@/components/lobby-card";

export const LobbiesList = ({ lobbies }: { lobbies: PaginatedData<Lobby> }) => {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <div className="flex items-center justify-between mb-5">
                <h2 className="mt-2 flex flex-col">
                    <span className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight first:mt-0">
                        Available Lobbies
                    </span>
                    Browse open lobbies and join one to start playing!
                </h2>
                {auth.user && (
                    <Button
                        asChild
                        className="mt-4 w-50 text-white hover:opacity-90 flex items-center justify-center"
                    >
                        <a href={route("lobbies.store")}>Create Lobby</a>
                    </Button>
                )}
            </div>

            {lobbies.data.length === 0 ? (
                <p className="text-center">
                    No lobbies available yet. Be the first to create one!
                </p>
            ) : (
                <>
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {lobbies.data.map((lobby) => (
                            <LobbyCard key={lobby.id} lobby={lobby} />
                        ))}
                    </div>

                    <DefaultPagination data={lobbies} />
                </>
            )}
        </>
    );
};
