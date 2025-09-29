<?php

namespace App\Jobs;

use App\Models\Lobby;
use App\Services\OsuApi;
use App\Services\LobbyGameService;
use Illuminate\Bus\Queueable;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;

class StartNextLobbyQuestion implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public int $lobbyId;
    public int $hostUserId;

    public function __construct(int $lobbyId, int $hostUserId)
    {
        $this->lobbyId    = $lobbyId;
        $this->hostUserId = $hostUserId;
    }

    public function handle(OsuApi $osuApi, LobbyGameService $service)
    {
        $lobby = Lobby::find($this->lobbyId);
        if (! $lobby) {
            return;
        }

        $host = $lobby->user()->where('id', $this->hostUserId)->first();
        if (! $host) {
            return;
        }

        $service->startNextQuestion($lobby, $host, $osuApi);
    }
}
