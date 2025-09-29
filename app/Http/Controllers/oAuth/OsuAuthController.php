<?php

namespace App\Http\Controllers\oAuth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\OsuApi;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Session;
use Laravel\Socialite\Facades\Socialite;
use Laravel\Socialite\Two\InvalidStateException;
use Mockery\Exception;

class OsuAuthController extends Controller
{
    public function redirectToProvider()
    {
        return Socialite::driver('osu')->redirect();
    }

    public function handleProviderCallback()
    {
        try {
            $osu_user = Socialite::driver('osu')->user();
            $user = User::where('osu_id', $osu_user->getId())->first();

            if ($user) {
                $user->update([
                    'username'             => $osu_user->getNickname(),
                    'osu_access_token'     => $osu_user->token,
                    'osu_refresh_token'    => $osu_user->refreshToken,
                    'osu_token_expires_at' => now()->addSeconds($osu_user->expiresIn),
                ]);
            } else {
                $user = User::create([
                    'osu_id'               => $osu_user->getId(),
                    'username'             => $osu_user->getNickname(),
                    'osu_access_token'     => $osu_user->token,
                    'osu_refresh_token'    => $osu_user->refreshToken,
                    'osu_token_expires_at' => now()->addSeconds($osu_user->expiresIn),
                ]);
            }

            Auth::login($user);

            return redirect()->intended(route('dashboard'));
        } catch (InvalidStateException $exception) {
            dd('osuAuthController - ', $exception);
        }
    }


    public function handleLogout() {
        try {
            (new OsuApi())->revokeToken();
        } catch (\Exception $exception) {

        } finally {
            Auth::logout();
            Session::forget('osu_access_token');
            Session::forget('osu_refresh_token');
            return redirect()->route('home');
        }
    }
}
