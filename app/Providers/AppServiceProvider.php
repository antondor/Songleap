<?php

namespace App\Providers;

use Laravel\Socialite\Contracts\Factory as SocialiteFactory;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $this->app->make(SocialiteFactory::class)->extend('osu', function ($app) {
            $config = $app['config']['services.osu'] ?? [];
            return new \App\Socialite\Providers\OsuProvider(
                $app['request'],
                $config['client_id'] ?? null,
                $config['client_secret'] ?? null,
                $config['redirect'] ?? null
            );
        });
    }
}
