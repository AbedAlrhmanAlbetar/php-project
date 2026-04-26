<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ProviderUpdateRequest;
use App\Http\Resources\ProviderResource;
use App\Models\Provider;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ProviderController extends Controller
{
    public function index(Request $request): JsonResponse
    {
       $query = Provider::with(['user', 'categories', 'media']);

        if ($request->filled('city')) {
            $query->whereHas('user', fn($q) => $q->where('city', 'like', '%' . $request->city . '%'));
        }

        if ($request->filled('category')) {
            $query->whereHas('categories', fn($q) => $q->where('slug', $request->category));
        }

        if ($request->filled('min_rating')) {
            $query->where('average_rating', '>=', $request->min_rating);
        }

        if ($request->filled('sort')) {
            match ($request->sort) {
                'rating'     => $query->orderByDesc('average_rating'),
                'rate_asc'   => $query->orderBy('hourly_rate'),
                'rate_desc'  => $query->orderByDesc('hourly_rate'),
                default      => $query->orderByDesc('created_at'),
            };
        } else {
            $query->orderByDesc('average_rating');
        }

        $providers = $query->paginate($request->get('per_page', 12));

        return response()->json([
            'data'  => ProviderResource::collection($providers),
            'meta'  => [
                'current_page' => $providers->currentPage(),
                'last_page'    => $providers->lastPage(),
                'per_page'     => $providers->perPage(),
                'total'        => $providers->total(),
            ],
        ]);
    }

    public function show(Provider $provider): JsonResponse
    {
        $provider->load(['user', 'categories', 'media', 'works.media', 'reviews.reviewer']);

        return response()->json(new ProviderResource($provider));
    }

    public function update(ProviderUpdateRequest $request): JsonResponse
    {
        $user     = $request->user();
        $provider = $user->provider;

        if (!$provider) {
            $provider = $user->provider()->create([
                'bio'              => '',
                'experience_years' => 0,
                'hourly_rate'      => 0,
                'service_area'     => $user->city,
            ]);
        }

        $user->update($request->only(['name', 'phone', 'city']));

        $provider->update($request->only(['bio', 'experience_years', 'hourly_rate', 'service_area']));

        if ($request->filled('category_ids')) {
            $provider->categories()->sync($request->category_ids);
        }

        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $user->update(['profile_photo' => $path]);
        }

        $provider->load(['user', 'categories', 'media']);

        return response()->json([
            'message'  => 'Profile updated successfully',
            'provider' => new ProviderResource($provider),
        ]);
    }

    public function myProfile(Request $request): JsonResponse
    {
        $provider = $request->user()->provider;

        if (!$provider) {
            return response()->json(['message' => 'Provider profile not found'], 404);
        }

        $provider->load(['user', 'categories', 'media', 'works.media', 'reviews.reviewer']);

        return response()->json(new ProviderResource($provider));
    }
}
