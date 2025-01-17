<?php

use App\Http\Controllers\AnswerController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\QuestionController;
use App\Http\Controllers\QuestionLibraryController;
use App\Models\Question;
use App\Models\QuestionLibrary;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    $user = getAuthUser();

    if (!is_null($user)) {
        return redirect()->route('dashboard');
    }

    return redirect()->route('login');
});

Route::get('/dashboard', function () {
    return inertia()->render('Dashboard', [
        'question_libraries' => QuestionLibrary::withCount('questions')->get(),
    ]);
})->middleware(['auth', 'verified'])->name('dashboard');

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
    Route::post('switch-role', function () {
        $user = getAuthUser();
        $user->is_teacher = !$user->is_teacher;
        $user->save();

        return redirect()->back();
    })->name('switch-role');

    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });

    Route::prefix('question')->group(function () {
        Route::post('/', [QuestionController::class, 'store'])->name('question.store');

        Route::prefix('/{question}')->group(function () {
            Route::get('/', [QuestionController::class, 'show'])
                ->name('question.show');
            Route::patch('/', [QuestionController::class, 'update'])
                ->name('question.update');
            Route::delete('/', [QuestionController::class, 'destroy'])
                ->name('question.delete');

            Route::get('/answer', [AnswerController::class, 'index'])
                ->name('answer.index');
            Route::get('/answer/{answer}', [AnswerController::class, 'show'])
                ->name('answer.show');
            Route::post('/answer', [AnswerController::class, 'create'])
                ->name('answer.create');
        });
    });

    Route::prefix('question-library')->group(function () {
        Route::get('/', [QuestionLibraryController::class, 'index'])->name('question-library');
        Route::post('/', [QuestionLibraryController::class, 'store'])->name('question-library.store');

        Route::prefix('{questionLibrary:uuid}')->group(function () {
            Route::get('/', [QuestionLibraryController::class, 'edit'])
                ->name('question-library.edit');
            Route::patch('/', [QuestionLibraryController::class, 'update'])
                ->name('question-library.update');
        });
    });
});

require __DIR__ . '/auth.php';
