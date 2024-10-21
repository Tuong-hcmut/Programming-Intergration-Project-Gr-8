<?php

use App\Jobs\GenerateQuestion;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new GenerateQuestion)->hourly();
Schedule::command('queue:work --stop-when-empty')
    ->everyMinute()
    ->withoutOverlapping();
