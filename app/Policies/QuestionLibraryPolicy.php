<?php

namespace App\Policies;

use App\Models\QuestionLibrary;
use App\Models\User;

class QuestionLibraryPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return false;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, QuestionLibrary $questionLibrary): bool
    {
        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->is_teacher;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, QuestionLibrary $questionLibrary): bool
    {
        return $questionLibrary->owner_id === $user->id;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, QuestionLibrary $questionLibrary): bool
    {
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, QuestionLibrary $questionLibrary): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, QuestionLibrary $questionLibrary): bool
    {
        return false;
    }
}
