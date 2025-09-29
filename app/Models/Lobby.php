<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lobby extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'mode',
        'image',
        'years',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function owner()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'lobby_users', 'lobby_id', 'user_id')
            ->withPivot(['is_admin', 'joined_at'])
            ->withTimestamps();
    }
}
