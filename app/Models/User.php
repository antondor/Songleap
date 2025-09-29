<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Crypt;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'osu_id',
        'username',
        'osu_access_token',
        'osu_refresh_token',
        'osu_token_expires_at',
    ];
    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'osu_access_token',
        'osu_refresh_token',
    ];

    public function setOsuRefreshTokenAttribute($value)
    {
        $this->attributes['osu_refresh_token'] = $value
            ? Crypt::encryptString($value)
            : null;
    }

    public function setOsuAccessTokenAttribute($value)
    {
        $this->attributes['osu_access_token'] = $value
            ? \Illuminate\Support\Facades\Crypt::encryptString($value)
            : null;
    }

    public function getOsuRefreshTokenAttribute($value)
    {
        return $value
            ? Crypt::decryptString($value)
            : null;
    }

    public function getOsuAccessTokenAttribute($value)
    {
        return $value
            ? Crypt::decryptString($value)
            : null;
    }

    public function lobbies()
    {
        return $this->belongsToMany(Lobby::class, 'lobby_users', 'user_id', 'lobby_id')
            ->withPivot(['is_admin', 'joined_at'])
            ->withTimestamps();
    }

    public function isRestricted() {
        return $this->restricted_access;
    }
}
