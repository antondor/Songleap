<?php

use App\Http\Controllers\LobbiesController;
use App\Http\Controllers\LobbyGameController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('welcome', []);
})->name('home');

Route::middleware(['auth'])->group(function () {
    Route::get('/dashboard', [LobbiesController::class, 'index'])->name('dashboard');

    Route::match(['get', 'post'], '/lobbies/create', [LobbiesController::class, 'store'])->name('lobbies.store');
    Route::get('/lobbies', [LobbiesController::class, 'index'])->name('lobbies.index');
    Route::get('/lobbies/{lobby}', [LobbiesController::class, 'show'])->name('lobbies.show');
    Route::post('/lobbies/{lobby}/join', [LobbiesController::class, 'join']);
    Route::post('/lobbies/{lobby}/leave', [LobbiesController::class, 'leave']);
    Route::delete('/lobbies/{lobby}', [LobbiesController::class, 'destroy']);

    Route::post('/lobbies/{lobby}/start-question', [LobbiesController::class, 'startQuestion'])->name('lobbies.startQuestion');
    Route::post('/lobbies/{lobby}/next-question', [LobbyGameController::class, 'nextQuestion'])
        ->name('lobbies.next-question');
    Route::post('/api/lobbies/{lobby}/answer', [LobbyGameController::class, 'answer'])
        ->withoutMiddleware([\Inertia\Middleware::class]);
    Route::post('/lobbies/{lobby}/leave', [LobbiesController::class, 'leave'])->name('lobbies.leave');

    Route::get('/my-lobbies', [LobbiesController::class, 'my_lobbies'])->name('my-lobbies');
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
