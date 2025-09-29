<?php

use App\Http\Controllers\oAuth\OsuAuthController;
use Illuminate\Support\Facades\Route;

Route::get('auth/osu', [OsuAuthController::class, 'redirectToProvider'])->name('auth.osu');
Route::get('auth/osu/callback', [OsuAuthController::class, 'handleProviderCallback'])->name('auth.osu.callback');
Route::post('auth/logout', [OsuAuthController::class, 'handleLogout'])->name('auth.logout');
