<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $fillable = ['reviewer_id', 'provider_id', 'rating', 'comment'];

    protected $casts = [
        'rating' => 'integer',
    ];

    public function reviewer()
    {
        return $this->belongsTo(User::class, 'reviewer_id');
    }

    public function provider()
    {
        return $this->belongsTo(Provider::class);
    }

    protected static function booted(): void
    {
        static::created(function (Review $review) {
            $review->provider->updateRating();
        });

        static::updated(function (Review $review) {
            $review->provider->updateRating();
        });

        static::deleted(function (Review $review) {
            $review->provider->updateRating();
        });
    }
}
