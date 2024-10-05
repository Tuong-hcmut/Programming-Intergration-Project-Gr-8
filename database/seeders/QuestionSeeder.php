<?php

namespace Database\Seeders;

use App\Models\Question;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Question::upsert([
            [
                'text' => "Talk about a recent tournament you've attended, and what did you achieve after that?",
                'cue_words' => json_encode(["champion", "opponent", "sportsmanship"])
            ],
        ], uniqueBy: ['text']);
    }
}
