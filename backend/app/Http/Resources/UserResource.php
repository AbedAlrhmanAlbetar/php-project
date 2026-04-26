<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'name'              => $this->name,
            'email'             => $this->email,
            'phone'             => $this->phone,
            'role'              => $this->role,
            'city'              => $this->city,
            'is_verified'       => $this->is_verified,
            'profile_photo_url' => $this->profile_photo_url,
            'created_at'        => $this->created_at?->toISOString(),
            'provider'          => $this->when($this->relationLoaded('provider'), fn() =>
                $this->provider ? new ProviderResource($this->provider) : null
            ),
        ];
    }
}
