<?php

use App\Models\Lobby;
use Illuminate\Support\Facades\Broadcast;
use App\Models\LobbyUser;

Broadcast::channel('lobby.{lobbyId}', function ($user, $lobbyId) {
    return [
        'id' => $user->id,
        'name' => $user->username,
    ];
});
