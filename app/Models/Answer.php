<?php

namespace App\Models;

use Database\Factories\AnswerFactory;
use Eloquent;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Carbon;

/**
 *
 *
 * @property int $id
 * @property int $question_id
 * @property int $user_id
 * @property string $audio_link
 * @property string|null $transcript
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property array<array-key, mixed>|null $transcribed_words
 * @property-read Question $question
 * @property-read User $user
 * @method static AnswerFactory factory($count = null, $state = [])
 * @method static Builder<static>|Answer newModelQuery()
 * @method static Builder<static>|Answer newQuery()
 * @method static Builder<static>|Answer query()
 * @method static Builder<static>|Answer whereAudioLink($value)
 * @method static Builder<static>|Answer whereCreatedAt($value)
 * @method static Builder<static>|Answer whereId($value)
 * @method static Builder<static>|Answer whereQuestionId($value)
 * @method static Builder<static>|Answer whereTranscribedWords($value)
 * @method static Builder<static>|Answer whereTranscript($value)
 * @method static Builder<static>|Answer whereUpdatedAt($value)
 * @method static Builder<static>|Answer whereUserId($value)
 * @mixin Eloquent
 */
class Answer extends Model
{
    use HasFactory;

    protected $fillable = ['question_id', 'user_id', 'audio_link'];
    protected $casts = [
        'transcribed_words' => 'array',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function question(): BelongsTo
    {
        return $this->belongsTo(Question::class);
    }
}
