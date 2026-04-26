<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\ReviewRequest;
use App\Http\Resources\ReviewResource;
use App\Models\Provider;
use App\Models\Review;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReviewController extends Controller
{
    public function index(Provider $provider): JsonResponse
    {
        $reviews = $provider->reviews()
            ->with('reviewer')
            ->latest()
            ->paginate(10);

        return response()->json([
            'data' => ReviewResource::collection($reviews),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    public function store(ReviewRequest $request, Provider $provider): JsonResponse
    {
        $user = $request->user();

        $existing = Review::where('reviewer_id', $user->id)
            ->where('provider_id', $provider->id)
            ->first();

        if ($existing) {
            return response()->json(['message' => 'You have already reviewed this provider'], 422);
        }

        if ($provider->user_id === $user->id) {
            return response()->json(['message' => 'You cannot review your own profile'], 422);
        }

        $review = Review::create([
            'reviewer_id' => $user->id,
            'provider_id' => $provider->id,
            'rating'      => $request->rating,
            'comment'     => $request->comment,
        ]);

        $review->load('reviewer');

        return response()->json([
            'message' => 'Review submitted successfully',
            'review'  => new ReviewResource($review),
        ], 201);
    }

    public function destroy(Review $review): JsonResponse
    {
        $this->authorize('delete', $review);

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
