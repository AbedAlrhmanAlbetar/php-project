<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Http\Requests\WorkRequest;
use App\Http\Resources\WorkResource;
use App\Models\Work;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class WorkController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $provider = $request->user()->provider;

        if (!$provider) {
            return response()->json(['data' => []]);
        }

        $works = $provider->works()->with('media')->latest()->get();

        return response()->json(WorkResource::collection($works));
    }

    public function store(WorkRequest $request): JsonResponse
    {
        $provider = $request->user()->provider;

        if (!$provider) {
            return response()->json(['message' => 'Provider profile not found'], 404);
        }

        $work = $provider->works()->create($request->only(['title', 'description']));

        if ($request->hasFile('images')) {
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('works', 'public');
                $work->media()->create([
                    'path'  => $path,
                    'type'  => 'image',
                    'order' => $index,
                ]);
            }
        }

        $work->load('media');

        return response()->json([
            'message' => 'Work created successfully',
            'work'    => new WorkResource($work),
        ], 201);
    }

    public function show(Work $work): JsonResponse
    {
        $work->load('media');

        return response()->json(new WorkResource($work));
    }

    public function update(WorkRequest $request, Work $work): JsonResponse
    {
        $this->authorize('update', $work);

        $work->update($request->only(['title', 'description']));

        if ($request->hasFile('images')) {
            $work->media()->delete();
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('works', 'public');
                $work->media()->create([
                    'path'  => $path,
                    'type'  => 'image',
                    'order' => $index,
                ]);
            }
        }

        $work->load('media');

        return response()->json([
            'message' => 'Work updated successfully',
            'work'    => new WorkResource($work),
        ]);
    }

    public function destroy(Work $work): JsonResponse
    {
        $this->authorize('delete', $work);

        $work->media()->delete();
        $work->delete();

        return response()->json(['message' => 'Work deleted successfully']);
    }
}
