<?php

namespace App\Models;

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
 * @property int $owner_id
 * @property string $title
 * @property string $uuid
 * @property Carbon|null $created_at
 * @property Carbon|null $updated_at
 * @property-read User $owner
 * @property-read Collection<int, Question> $questions
 * @property-read int|null $questions_count
 * @method static Builder<static>|QuestionLibrary newModelQuery()
 * @method static Builder<static>|QuestionLibrary newQuery()
 * @method static Builder<static>|QuestionLibrary query()
 * @method static Builder<static>|QuestionLibrary whereCreatedAt($value)
 * @method static Builder<static>|QuestionLibrary whereId($value)
 * @method static Builder<static>|QuestionLibrary whereOwnerId($value)
 * @method static Builder<static>|QuestionLibrary whereTitle($value)
 * @method static Builder<static>|QuestionLibrary whereUpdatedAt($value)
 * @method static Builder<static>|QuestionLibrary whereUuid($value)
 * @mixin Eloquent
 */
class QuestionLibrary extends Model
{
    use HasFactory;

    protected $fillable = [
        'owner_id',
        'title',
        'uuid'
    ];

    public function owner(): BelongsTo
    {
        return $this->belongsTo(User::class, 'owner_id');
    }

    public function questions(): HasMany
    {
        return $this->hasMany(Question::class);
    }
}
