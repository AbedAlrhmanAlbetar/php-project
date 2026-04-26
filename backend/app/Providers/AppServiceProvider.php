<?php

namespace App\Providers;

use App\Models\Category;
use App\Models\Review;
use App\Models\Work;
use App\Policies\CategoryPolicy;
use App\Policies\ReviewPolicy;
use App\Policies\WorkPolicy;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void {}

    public function boot(): void
    {
        Gate::policy(Category::class, CategoryPolicy::class);
        Gate::policy(Work::class,     WorkPolicy::class);
        Gate::policy(Review::class,   ReviewPolicy::class);
    }
}
