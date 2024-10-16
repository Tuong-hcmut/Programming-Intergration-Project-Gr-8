<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreAnswerRequest;
use App\Http\Requests\UpdateAnswerRequest;
use App\Jobs\TranscribeAnswer;
use App\Models\Answer;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rules\File;
use Inertia\Response;

class AnswerController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Question $question, Request $request)
    {
        $form = $request->validate([
            'answerAudio' => 'required|mimes:wav,mp3,webm,mpeg',
        ]);

        // Set filename by <question_id>_<user_id>_<YYYYMMDD>_<HHMMSS>.<extension>
        $filename = sprintf(
            '%s_%s_%s.%s',
            $question->id,
            getAuthUser()->id,
            now()->format('Ymd_His'),
            $form['answerAudio']->extension()
        );
        $path = $form['answerAudio']->storePubliclyAs('answer-audios/' . $question->id, $filename, 'public');

        $answer = getAuthUser()->answers()->create([
            'question_id' => $question->id,
            'audio_link' => Storage::url($path),
        ]);
        $answer->save();

        TranscribeAnswer::dispatch($answer);

        return to_route('answer.show', ['question' => $question, 'answer' => $answer]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreAnswerRequest $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Question $question, Answer $answer): Response
    {
        if ($answer->question_id !== $question->id) {
            abort(404);
        }

        return inertia()->render('Questions/Show', [
            'question' => $answer->question,
            'answer' => $answer->load('user'),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Answer $answer)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateAnswerRequest $request, Answer $answer)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Answer $answer)
    {
        //
    }
}
