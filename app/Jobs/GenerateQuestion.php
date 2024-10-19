<?php

namespace App\Jobs;

use App\Models\Question;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use OpenAI\Laravel\Facades\OpenAI;

class GenerateQuestion implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        // Only run if we have too few questions unanswered
        if (Question::whereDoesntHave('answers')->count() >= 50) {
            return;
        }

        $response = OpenAI::chat()->create([
            'model' => 'gpt-3.5-turbo',
            'messages' => [[
                'role' => 'system',
                'content' => <<<EOD
                    You are asked to give a question for english learners to practice speaking.
                    Give a short question, with quite open answer possibility so they could freely answer it.
                    Besides, give a few (3-5) cue words relating to the topic, so that the user must use them to answer the question.
                    Give in format of JSON, for example (DO NOT copy this example): {
                        "question": "Talk about a recent tournament you've attended, and what did you achieve after that?",
                        "cue_words": ["champion", "opponent", "sportsmanship"]
                    }
                EOD
            ]]
        ]);

        $json = json_decode($response->choices[0]->message->content, true);
        Question::create([
            'text' => $json['question'],
            'cue_words' => $json['cue_words'],
        ]);
    }
}
