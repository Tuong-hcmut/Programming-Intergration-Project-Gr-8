<?php

namespace App\Listeners;

use Illuminate\Database\Events\MigrationsEnded;
use Illuminate\Events\Dispatcher;
use Illuminate\Support\Facades\Artisan;

class MigrationsEventSubscriber
{
    /**
     * Handle the migrations ended event.
     */
    public function afterMigration(MigrationsEnded $event): void
    {
        Artisan::call('ide-helper:models', ['-W' => true]);
    }

    /**
     * Register the listeners for the subscriber.
     */
    public function subscribe(Dispatcher $events): void
    {
        $events->listen(
            MigrationsEnded::class,
            [MigrationsEventSubscriber::class, 'afterMigration']
        );
    }
}
