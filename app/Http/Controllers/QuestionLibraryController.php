<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreQuestionLibraryRequest;
use App\Http\Requests\UpdateQuestionLibraryRequest;
use App\Models\QuestionLibrary;
use Illuminate\Support\Facades\Gate;
use Str;

class QuestionLibraryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return inertia()->render('QuestionLibrary/Index', [
            'question_libraries' => QuestionLibrary
                ::where('owner_id', auth()->id())
                ->withCount('questions')
                ->get(),
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreQuestionLibraryRequest $request)
    {
        Gate::authorize('create', QuestionLibrary::class);

        QuestionLibrary::create([
            ...$request->validated(),
            'owner_id' => getAuthUser()->id,
            'uuid' => Str::orderedUuid(),
        ]);

        return redirect()->back();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(QuestionLibrary $questionLibrary)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(QuestionLibrary $questionLibrary)
    {
        return inertia()->render('QuestionLibrary/Edit', [
            'editable' => $questionLibrary->owner_id === getAuthUser()->id,
            'question_library' => $questionLibrary,
            'questions' => $questionLibrary->questions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateQuestionLibraryRequest $request, QuestionLibrary $questionLibrary)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(QuestionLibrary $questionLibrary)
    {
        //
    }
}
