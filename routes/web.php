<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Foundation\Application;
use Illuminate\Http\Request;
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

Route::get('/dashboard', function (Request $request) {
    $type = $request->validate([
        'type' => 'string|in:unanswered,answered',
    ])['type'] ?? 'unanswered';

    $where = fn($query) => $query->where('user_id', auth()->user()->getAuthIdentifier());

    $base_query = $type === 'unanswered'
        ? Question::whereDoesntHave('answers', $where)
        : Question::whereHas('answers', $where);

    $questions = $base_query
        ->select('questions.*')
        ->selectRaw(<<<EOD
            EXISTS (
                SELECT 1 FROM answers
                WHERE answers.question_id = questions.id AND answers.user_id = ?
            ) as answered
        EOD, [auth()->user()->getAuthIdentifier()])
        ->paginate(20);

    return Inertia::render('Dashboard', [
        'questions' => $questions->items(),
        'pagination' => getPaginationObject($questions),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/question/{question}', [QuestionController::class, 'show'])
        ->name('question.show')
        ->middleware('can:view,question');

    Route::post('/question/{question}/answer', [AnswerController::class, 'create'])
        ->name('answer.create')
        ->middleware('can:view,question')
        ->can('create', Answer::class);
});

require __DIR__ . '/auth.php';
