<?php


namespace App\Http\Controllers\API; // ✅ مهم جداً

use App\Http\Controllers\Controller; // ✅ الصحيح



use App\Http\Resources\ProviderResource;
use App\Http\Resources\ReviewResource;
use App\Http\Resources\UserResource;
use App\Models\Provider;
use App\Models\Review;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    public function __construct()
    {
        $this->middleware('role:admin');
    }

    public function stats(): JsonResponse
    {
        return response()->json([
            'total_users'     => User::count(),
            'total_providers' => Provider::count(),
            'total_reviews'   => Review::count(),
            'verified_users'  => User::where('is_verified', true)->count(),
            'users_by_role'   => User::selectRaw('role, count(*) as count')->groupBy('role')->pluck('count', 'role'),
        ]);
    }

    public function users(Request $request): JsonResponse
    {
        $users = User::query()
            ->when($request->role, fn($q) => $q->where('role', $request->role))
            ->when($request->search, fn($q) => $q->where(function ($q) use ($request) {
                $q->where('name', 'like', "%{$request->search}%")
                  ->orWhere('email', 'like', "%{$request->search}%");
            }))
            ->latest()
            ->paginate(15);

        return response()->json([
            'data' => UserResource::collection($users),
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page'    => $users->lastPage(),
                'total'        => $users->total(),
            ],
        ]);
    }

    public function verifyUser(User $user): JsonResponse
    {
        $user->update(['is_verified' => !$user->is_verified]);

        return response()->json([
            'message' => 'User verification status updated',
            'user'    => new UserResource($user),
        ]);
    }

    public function deleteUser(User $user): JsonResponse
    {
        if ($user->id === request()->user()->id) {
            return response()->json(['message' => 'Cannot delete your own account'], 422);
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    public function providers(Request $request): JsonResponse
    {
        $providers = Provider::with(['user', 'categories'])
            ->when($request->search, fn($q) => $q->whereHas('user', fn($uq) =>
                $uq->where('name', 'like', "%{$request->search}%")
            ))
            ->latest()
            ->paginate(15);

        return response()->json([
            'data' => ProviderResource::collection($providers),
            'meta' => [
                'current_page' => $providers->currentPage(),
                'last_page'    => $providers->lastPage(),
                'total'        => $providers->total(),
            ],
        ]);
    }

    public function reviews(Request $request): JsonResponse
    {
        $reviews = Review::with(['reviewer', 'provider.user'])
            ->latest()
            ->paginate(15);

        return response()->json([
            'data' => ReviewResource::collection($reviews),
            'meta' => [
                'current_page' => $reviews->currentPage(),
                'last_page'    => $reviews->lastPage(),
                'total'        => $reviews->total(),
            ],
        ]);
    }

    public function deleteReview(Review $review): JsonResponse
    {
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}
