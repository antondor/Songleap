<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use App\Models\User;

class LobbyGameAnswer implements ShouldBroadcast
{
    use InteractsWithSockets;

    public $lobbyId;
    public $userId;
    public $isCorrect;
    public $artist;
    public $title;

    public function __construct($lobbyId, $userId, $isCorrect, $artist, $title)
    {
        $this->lobbyId  = $lobbyId;
        $this->userId   = $userId;
        $this->isCorrect= $isCorrect;
        $this->artist   = $artist;
        $this->title    = $title;
    }

    public function broadcastOn()
    {
        return new PresenceChannel("lobby.{$this->lobbyId}");
    }

    public function broadcastAs()
    {
        return 'LobbyGameAnswer';
    }

    public function broadcastWith()
    {
        $user = User::find($this->userId);

        return [
            'answer' => [
                'userId'   => $this->userId,
                'username' => $user?->username,
                'osu_id'   => $user?->osu_id,
                'isCorrect'=> $this->isCorrect,
                'chosen'   => [
                    'artist' => $this->artist,
                    'title'  => $this->title,
                ],
            ]
        ];
    }
}
