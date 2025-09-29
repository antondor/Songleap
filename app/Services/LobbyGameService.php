<?php
namespace App\Services;

use App\Models\Lobby;
use App\Events\LobbyGameQuestion;
use Illuminate\Support\Facades\Cache;

class LobbyGameService
{
    public function startNextQuestion(Lobby $lobby, $hostUser, \App\Services\OsuApi $osuApi)
    {
        // copy your controller logic here but accept $lobby and $hostUser
        $years = explode(',', $lobby->years);
        $mode = match ($lobby->mode) {
            'Taiko' => 1,
            'Catch' => 2,
            'Mania' => 3,
            default => 0,
        };

        $data = $osuApi->searchBeatmapsets($hostUser, $years[0], $years[1], $mode);
        if (empty($data['beatmapsets'])) {
            return null;
        }

        $beatmaps = $data['beatmapsets'];
        $correct  = $beatmaps[array_rand($beatmaps)];

        // pick options
        $options = [$correct];
        while (count($options) < 4) {
            $random = $beatmaps[array_rand($beatmaps)];
            if (! in_array($random, $options, true)) {
                $options[] = $random;
            }
        }
        shuffle($options);

        Cache::put("lobby:{$lobby->id}:correct", [
            'artist' => $correct['artist'],
            'title'  => $correct['title'],
        ], now()->addMinutes(10));

        Cache::put("lobby:{$lobby->id}:answered", [], now()->addMinutes(10));

        $question = [
            'lobbyId' => $lobby->id,
            'cover'   => $correct['covers']['cover'],
            'audio'   => $correct['preview_url'] ?? null,
            'options' => array_map(fn($bm) => [
                'artist' => $bm['artist'],
                'title'  => $bm['title'],
            ], $options),
            'correct' => [
                'artist' => $correct['artist'],
                'title'  => $correct['title'],
            ],
        ];

        event(new LobbyGameQuestion($question));

        return $question;
    }
}
