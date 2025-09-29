<?php

namespace App\Events;

use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LobbyGameQuestion implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public array $question;

    public function __construct(array $question)
    {
        $this->question = $question;
    }

    public function broadcastOn(): PresenceChannel
    {
        return new PresenceChannel('lobby.' . $this->question['lobbyId']);
    }

    public function broadcastWith(): array
    {
        return [
            'question' => $this->question,
        ];
    }

    public function broadcastAs(): string
    {
        return 'LobbyGameQuestion';
    }
}
