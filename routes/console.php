<?php

use App\Jobs\GenerateQuestion;
use Illuminate\Support\Facades\Schedule;

Schedule::job(GenerateQuestion::class)->hourly();
Schedule::command('queue:work --stop-when-empty')
    ->everyMinute()
    ->withoutOverlapping();
