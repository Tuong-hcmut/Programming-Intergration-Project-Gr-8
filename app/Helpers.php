<?php

use App\Models\User;

if (!function_exists('getAuthUser')) {
    /**
     * @return User|null
     */
    function getAuthUser(): ?User
    {
        /** @var User */
        return auth()->user();
    }
}
