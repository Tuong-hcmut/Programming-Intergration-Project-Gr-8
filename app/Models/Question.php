<?php

namespace App\Models;

use Database\Factories\QuestionFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Carbon;

/**
 *
 *
 * @property int $id
 * @property string $text
 * @property array<array-key, mixed> $cue_words
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property int|null $question_library_id
 * @property-read Collection<int, Answer> $answers
 * @property-read int|null $answers_count
 * @property-read QuestionLibrary|null $questionLibrary
 * @method static QuestionFactory factory($count = null, $state = [])
 * @method static Builder<static>|Question newModelQuery()
 * @method static Builder<static>|Question newQuery()
 * @method static Builder<static>|Question query()
 * @method static Builder<static>|Question whereCreatedAt($value)
 * @method static Builder<static>|Question whereCueWords($value)
 * @method static Builder<static>|Question whereId($value)
 * @method static Builder<static>|Question whereQuestionLibraryId($value)
 * @method static Builder<static>|Question whereText($value)
 * @method static Builder<static>|Question whereUpdatedAt($value)
 * @mixin Eloquent
 */
class Question extends Model
{
    use HasFactory;

    protected $fillable = ['question_library_id', 'text', 'cue_words'];
    protected $casts = [
        'cue_words' => 'array'
    ];

    public function answers(): HasMany
    {
        return $this->hasMany(Answer::class);
    }

    public function questionLibrary(): BelongsTo
    {
        return $this->belongsTo(QuestionLibrary::class);
    }
}
