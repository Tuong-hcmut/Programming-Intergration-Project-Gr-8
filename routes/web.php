<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use App\Models\Answer;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/question/{question}', [QuestionController::class, 'show'])
        ->name('question.show')
        ->middleware('can:view,question');

    Route::get('/question/{question}/answer/{answer}', [AnswerController::class, 'show'])
        ->name('answer.show')
        ->middleware('can:view,question')
        ->middleware('can:view,answer');

    Route::post('/question/{question}/answer', [AnswerController::class, 'create'])
        ->name('answer.create')
        ->middleware('can:view,question')
        ->can('create', Answer::class);
});

require __DIR__ . '/auth.php';
