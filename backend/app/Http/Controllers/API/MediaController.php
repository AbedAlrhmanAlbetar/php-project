<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Media;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MediaController extends Controller
{
    public function uploadProviderMedia(Request $request): JsonResponse
    {
        $request->validate([
            'images'   => 'required|array|max:10',
            'images.*' => 'required|image|mimes:jpeg,png,jpg,webp|max:5120',
        ]);

        $provider = $request->user()->provider;

        if (!$provider) {
            return response()->json(['message' => 'Provider profile not found'], 404);
        }

        $uploaded = [];
        $order    = $provider->media()->max('order') ?? -1;

        foreach ($request->file('images') as $image) {
            $path    = $image->store('providers', 'public');
            $media   = $provider->media()->create([
                'path'  => $path,
                'type'  => 'image',
                'order' => ++$order,
            ]);
            $uploaded[] = [
                'id'  => $media->id,
                'url' => url('storage/' . $media->path),
            ];
        }

        return response()->json([
            'message' => 'Images uploaded successfully',
            'media'   => $uploaded,
        ], 201);
    }

    public function destroy(Media $media): JsonResponse
    {
        $user = request()->user();

        // Check ownership
        $mediable = $media->mediable;

        $isOwner = false;
        if ($mediable instanceof \App\Models\Provider && $mediable->user_id === $user->id) {
            $isOwner = true;
        } elseif ($mediable instanceof \App\Models\Work && $mediable->provider->user_id === $user->id) {
            $isOwner = true;
        }

        if (!$isOwner && !$user->isAdmin()) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        \Illuminate\Support\Facades\Storage::disk('public')->delete($media->path);
        $media->delete();

        return response()->json(['message' => 'Media deleted successfully']);
    }
}
