<?php

namespace App\Http\Controllers;

use App\Events\LobbyGameQuestion;
use App\Events\LobbyGameResult;
use App\Jobs\StartNextLobbyQuestion;
use App\Models\Lobby;
use App\Services\LobbyGameService;
use App\Services\OsuApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;
use App\Events\LobbyGameAnswer;

class LobbyGameController extends Controller
{
    public function nextQuestion(Request $request, $lobbyId, OsuApi $osuApi, LobbyGameService $service)
    {
        $user = $request->user();
        $lobby = Lobby::findOrFail($lobbyId);

        if ($user->id !== $lobby->user_id) {
            abort(403, 'Only the host can start the next question.');
        }

        $question = $service->startNextQuestion($lobby, $user, $osuApi);
        if (! $question) {
            return response()->json(['error' => 'No maps found'], 404);
        }

        return response()->json(['status' => 'ok', 'question' => $question]);
    }

    public function answer(Request $request, $lobbyId)
    {
        $user = $request->user();
        $correct = Cache::get("lobby:{$lobbyId}:correct");

        $isCorrect = $correct &&
            $correct['artist'] === $request->artist &&
            $correct['title'] === $request->title;

        $answered = Cache::get("lobby:{$lobbyId}:answered", []);

        $already = collect($answered)->firstWhere('userId', $user->id);
        if (!$already) {
            $answered[] = [
                'userId'   => $user->id,
                'username' => $user->username,
                'isCorrect'=> $isCorrect,
                'chosen'   => [
                    'artist' => $request->artist,
                    'title'  => $request->title,
                ],
            ];
            Cache::put("lobby:{$lobbyId}:answered", $answered, now()->addMinutes(10));
        }

        event(new LobbyGameAnswer(
            $lobbyId,
            $user->id,
            $isCorrect,
            $request->artist,
            $request->title
        ));

        $lobbyUsersCount = Lobby::find($lobbyId)->users()->count();
        if (count($answered) >= $lobbyUsersCount) {
            $winner = null;
            foreach ($answered as $entry) {
                if ($entry['isCorrect']) {
                    $winner = $entry;
                    break;
                }
            }

            event(new LobbyGameResult([
                'lobbyId' => $lobbyId,
                'correct' => $correct,
                'winner'  => $winner,
            ]));

            StartNextLobbyQuestion::dispatch($lobbyId, $user->id)->delay(now()->addSeconds(2));
        }

        return response()->json(['correct' => $isCorrect]);
    }
}
