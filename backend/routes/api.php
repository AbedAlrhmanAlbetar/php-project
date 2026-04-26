<?php

use App\Http\Controllers\API\AdminController;
use App\Http\Controllers\API\AuthController;
use App\Http\Controllers\API\CategoryController;
use App\Http\Controllers\API\MediaController;
use App\Http\Controllers\API\ProviderController;
use App\Http\Controllers\API\ReviewController;
use App\Http\Controllers\API\WorkController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// ✅ كود فحص CORS يدوي آمن لا يعطل أوامر الـ Artisan
if (isset($_SERVER['REQUEST_METHOD'])) {
    header('Access-Control-Allow-Origin: http://localhost:5173');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With, X-XSRF-TOKEN');
    header('Access-Control-Allow-Credentials: true');

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        exit;
    }
}

// Public routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login',    [AuthController::class, 'login']);

// Public read-only
Route::get('/categories',            [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);
Route::get('/providers',             [ProviderController::class, 'index']);
Route::get('/providers/{provider}', [ProviderController::class, 'show']);
Route::get('/providers/{provider}/reviews', [ReviewController::class, 'index']);

// Authenticated routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me',      [AuthController::class, 'me']);

    // Provider profile (own)
    Route::get('/my-profile',    [ProviderController::class, 'myProfile']);
    Route::post('/my-profile',   [ProviderController::class, 'update']);

    // Works (provider only)
    Route::middleware('role:provider,admin')->group(function () {
        Route::get('/works',           [WorkController::class, 'index']);
        Route::post('/works',          [WorkController::class, 'store']);
        Route::get('/works/{work}',   [WorkController::class, 'show']);
        Route::post('/works/{work}',  [WorkController::class, 'update']);
        Route::delete('/works/{work}', [WorkController::class, 'destroy']);

        // Media upload
        Route::post('/media/upload',        [MediaController::class, 'uploadProviderMedia']);
        Route::delete('/media/{media}',     [MediaController::class, 'destroy']);
    });

    // Categories CRUD (admin only)
    Route::post('/categories',              [CategoryController::class, 'store']);
    Route::put('/categories/{category}',   [CategoryController::class, 'update']);
    Route::delete('/categories/{category}', [CategoryController::class, 'destroy']);

    // Reviews (customers)
    Route::post('/providers/{provider}/reviews',        [ReviewController::class, 'store']);
    Route::delete('/reviews/{review}',                  [ReviewController::class, 'destroy']);

    // Admin routes
    Route::prefix('admin')->middleware('role:admin')->group(function () {
        Route::get('/stats',                [AdminController::class, 'stats']);
        Route::get('/users',               [AdminController::class, 'users']);
        Route::patch('/users/{user}/verify', [AdminController::class, 'verifyUser']);
        Route::delete('/users/{user}',     [AdminController::class, 'deleteUser']);
        Route::get('/providers',           [AdminController::class, 'providers']);
        Route::get('/reviews',             [AdminController::class, 'reviews']);
        Route::delete('/reviews/{review}', [AdminController::class, 'deleteReview']);
    });
});