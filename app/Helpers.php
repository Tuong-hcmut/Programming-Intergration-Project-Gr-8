<?php

use App\Models\User;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

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

function getPaginationObject(LengthAwarePaginator $paginator): array
{
    $current_page = $paginator->currentPage();
    $leading_pages = 2;
    $trailing_pages = 2;
    $on_each_side = 2;

    $pages = array_filter(
        array_unique([
            ...range(1, $leading_pages),
            ...range($current_page - $on_each_side, $current_page + $on_each_side),
            ...range($paginator->lastPage() - $trailing_pages + 1, $paginator->lastPage()),
        ]),
        fn(int $item) => $item > 0 && $item <= $paginator->lastPage()
    );

    return array_map(
        fn(int $page) => [
            'url' => $paginator->url($page),
            'page' => $page,
            'is_current' => $page === $current_page,
        ],
        $pages
    );
}
