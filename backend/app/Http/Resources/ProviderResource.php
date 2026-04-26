<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProviderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'               => $this->id,
            'bio'              => $this->bio,
            'experience_years' => $this->experience_years,
            'hourly_rate'      => $this->hourly_rate,
            'service_area'     => $this->service_area,
            'average_rating'   => $this->average_rating,
            'reviews_count'    => $this->reviews_count,
            'user'             => $this->when($this->relationLoaded('user'), fn() =>
                new UserResource($this->user)
            ),
            'categories'       => $this->when($this->relationLoaded('categories'), fn() =>
                CategoryResource::collection($this->categories)
            ),
            'media'            => $this->when($this->relationLoaded('media'), fn() =>
                MediaResource::collection($this->media)
            ),
            'works'            => $this->when($this->relationLoaded('works'), fn() =>
                WorkResource::collection($this->works)
            ),
            'reviews'          => $this->when($this->relationLoaded('reviews'), fn() =>
                ReviewResource::collection($this->reviews)
            ),
            'created_at'       => $this->created_at?->toISOString(),
        ];
    }
}
