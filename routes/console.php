<?php

use App\Jobs\GenerateQuestion;
use Illuminate\Support\Facades\Schedule;

Schedule::job(new GenerateQuestion)->everyMinute();
Schedule::command('queue:work --max-time=120')->everyMinute();
