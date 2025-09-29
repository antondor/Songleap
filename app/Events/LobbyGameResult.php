<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;

class LobbyGameResult implements ShouldBroadcast
{
    public $lobbyId;
    public $correct;
    public $winner;

    public function __construct($data)
    {
        $this->lobbyId = $data['lobbyId'];
        $this->correct = $data['correct'];
        $this->winner  = $data['winner'];
    }

    public function broadcastOn()
    {
        return new PresenceChannel('lobby.' . $this->lobbyId);
    }

    public function broadcastAs()
    {
        return 'LobbyGameResult';
    }

    public function broadcastWith()
    {
        return [
            'correct' => $this->correct,
            'winner'  => $this->winner,
        ];
    }
}
