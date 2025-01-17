<?php

namespace App\Providers;

use App\Listeners\MigrationsEventSubscriber;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Vite;
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
        Vite::prefetch(concurrency: 3);
        Event::subscribe(MigrationsEventSubscriber::class);
        RateLimiter::for('transcribe answer', function (object $job) {
            return Limit::perMinute(3);
        });
    }
}
