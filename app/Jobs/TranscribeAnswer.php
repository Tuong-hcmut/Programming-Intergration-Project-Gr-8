<?php

namespace App\Jobs;

use App\Models\Answer;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Queue\Middleware\RateLimited;
use Log;
use OpenAI\Laravel\Facades\OpenAI;
use Throwable;

class TranscribeAnswer implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct(
        public Answer $answer
    )
    {
        //
    }

    /**
     * Get the middleware the job should pass through.
     *
     * @return array<int, object>
     */
    public function middleware(): array
    {
        return [(new RateLimited('transcribe answer'))->dontRelease()];
    }

    /**
     * Execute the job.
     * @throws Throwable
     */
    public function handle(): void
    {
        $cueWords = $this->answer->question->cue_words;
        $joinedCueWords = implode(', ', $cueWords);
        $question = $this->answer->question->text;

        $response = OpenAI::audio()->transcribe([
            'model' => 'whisper-1',
            'file' => fopen(url($this->answer->audio_link), 'r'),
            'language' => 'en',
            'response_format' => 'verbose_json',
            'timestamp_granularities' => ['word'],
            'prompt' => <<<EOD
                You are transcribing a spoken answer to a question: $question.
                The user was asked to answer using words or derivatives from these: $joinedCueWords.
                The user responded:
            EOD,
        ]);

        $this->answer->transcript = $response->text;
        $this->answer->transcribed_words = $response->toArray()['words'];
        $this->answer->save();
    }
}
