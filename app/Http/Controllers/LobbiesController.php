<?php

namespace App\Http\Controllers;

use App\Models\Lobby;
use App\Models\LobbyUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use App\Events\LobbyGameQuestion;
use App\Events\LobbyGameAnswer;

class LobbiesController extends Controller
{

    public function index()
    {
//        $lobbies = Lobby::with('users', 'owner')->get();

        return Inertia::render('dashboard', [
            'lobbies' => Lobby::where('is_closed', 0)
                ->orderByRaw('CASE WHEN id = 1 THEN 0 ELSE 1 END')
                ->orderBy('updated_at', 'asc')
                ->with(['owner', 'users'])
                ->paginate(9)
        ]);

    }

    public function store(Request $request)
    {
        if ($request->isMethod('get')) {
            return Inertia::render('lobbies/create');
        }
        $user = Auth::user();

        $request->validate([
            'name' => 'required|string|max:255',
            'mode' => 'required|in:Standard,Mania,Catch,Taiko',
            'years' => 'nullable|string|regex:/^\d{4},\d{4}$/',
            'status' => 'nullable|in:approved,loved',
        ]);

        $lobby = Lobby::create([
            'user_id' => Auth::id(),
            'name' => $request->get('name'),
            'mode' => $request->get('mode'),
            'years' => $request->get('years'),
            'image' => "https://a.ppy.sh/" . $user->osu_id,
        ]);

        LobbyUser::create([
            'lobby_id' => $lobby->id,
            'user_id' => Auth::id(),
            'is_admin' => true,
            'joined_at' => now(),
        ]);

        return redirect()->route('lobbies.index')
            ->with('success', 'Lobby created successfully');
    }

    public function show(Lobby $lobby)
    {
        $lobby->load('users', 'owner');

        return Inertia::render('lobbies/show', [
            'lobby' => $lobby,
            'user_id' => Auth::id(),
        ]);
    }

    public function my_lobbies()
    {
        $user = auth()->user();

        $lobbies = $user->lobbies()
            ->with(['owner', 'users'])
            ->paginate(9);

        return Inertia::render('my_lobbies', [
            'lobbies' => $lobbies,
        ]);
    }

    public function join(Lobby $lobby)
    {
        $exists = LobbyUser::where('lobby_id', $lobby->id)
            ->where('user_id', Auth::id())
            ->exists();

        if (!$exists) {
            LobbyUser::create([
                'lobby_id' => $lobby->id,
                'user_id' => Auth::id(),
                'joined_at' => now(),
            ]);
        }

        return redirect()->route('lobbies.show', $lobby->id)
            ->with('success', 'Joined the lobby');
    }

    public function leave(Lobby $lobby)
    {
        LobbyUser::where('lobby_id', $lobby->id)
            ->where('user_id', Auth::id())
            ->delete();

        return redirect()->route('lobbies.index')
            ->with('success', 'Left the lobby');
    }

    public function destroy(Lobby $lobby)
    {
        $isAdmin = LobbyUser::where('lobby_id', $lobby->id)
            ->where('user_id', Auth::id())
            ->where('is_admin', true)
            ->exists();

        if (!$isAdmin) {
            return redirect()->route('lobbies.index')
                ->with('error', 'You do not have permission to delete this lobby');
        }

        $lobby->delete();

        return redirect()->route('lobbies.index')
            ->with('success', 'Lobby deleted');
    }

    public function startQuestion(Lobby $lobby)
    {
        $user = auth()->user();
        $token = $user->osu_token;

        $response = Http::withToken($token)
            ->get("https://osu.ppy.sh/api/v2/beatmapsets/search", [
                "limit" => 50,
                "sort" => "ranked_desc"
            ]);

        $beatmaps = $response->json()["beatmapsets"] ?? [];
        if (empty($beatmaps)) return;

        $random = $beatmaps[array_rand($beatmaps)];
        $correct = [
            "title" => $random["title"],
            "artist" => $random["artist"],
        ];

        $options = [$correct];
        while (count($options) < 4) {
            $fake = $beatmaps[array_rand($beatmaps)];
            $options[] = [
                "title" => $fake["title"],
                "artist" => $fake["artist"],
            ];
        }
        shuffle($options);

        $question = [
            "cover" => $random["covers"]["cover"] ?? $random["covers"]["card"],
            "correct" => $correct,
            "options" => $options,
        ];

        broadcast(new LobbyGameQuestion($lobby->id, $question));
        return response()->json(["status" => "ok"]);
    }

    public function answer(Lobby $lobby, Request $request)
    {
        $userId = auth()->id();
        $isCorrect = $request->get("answer") === $request->get("correct");

        broadcast(new LobbyGameAnswer($lobby->id, $userId, $isCorrect));

        return response()->json([
            "correct" => $isCorrect,
        ]);
    }
}
