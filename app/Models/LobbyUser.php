<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\Pivot;

class LobbyUser extends Pivot
{
    use HasFactory;

    protected $table = 'lobby_users';

    protected $fillable = [
        'lobby_id',
        'user_id',
        'is_admin',
        'joined_at',
    ];

    protected $casts = [
        'is_admin' => 'boolean',
        'joined_at' => 'datetime',
    ];

    public function lobby()
    {
        return $this->belongsTo(Lobby::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function scopeJoinedByUser($query, $userId)
    {
        return $query->where('user_id', $userId);
    }

    public function scopeForLobby($query, $lobbyId)
    {
        return $query->where('lobby_id', $lobbyId);
    }

    public function scopeAdmins($query)
    {
        return $query->where('is_admin', true);
    }
}
