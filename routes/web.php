<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $user = getAuthUser();

    if (!is_null($user)) {
        return redirect()->route('dashboard');
    }

    return inertia()->render('Welcome');
});

Route::get('/questions', function (Request $request) {
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

    return inertia()->render('QuestionIndex', [
        'questions' => $questions->items(),
        'pagination' => getPaginationObject($questions),
    ]);
})->middleware(['auth', 'verified'])->name('questions');

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
