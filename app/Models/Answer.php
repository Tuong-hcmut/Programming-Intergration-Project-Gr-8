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
 * @method static AnswerFactory factory($count = null, $state = [])
 * @method static Builder|Answer newModelQuery()
 * @method static Builder|Answer newQuery()
 * @method static Builder|Answer query()
 * @method static Builder|Answer whereAudioLink($value)
 * @method static Builder|Answer whereCreatedAt($value)
 * @method static Builder|Answer whereId($value)
 * @method static Builder|Answer whereQuestionId($value)
 * @method static Builder|Answer whereTranscript($value)
 * @method static Builder|Answer whereUpdatedAt($value)
 * @method static Builder|Answer whereUserId($value)
 * @property-read Question $question
 * @property-read User $user
 * @method static Builder|Answer whereTranscribeWords($value)
 * @property string|null $transcribed_words
 * @method static Builder|Answer whereTranscribedWords($value)
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
