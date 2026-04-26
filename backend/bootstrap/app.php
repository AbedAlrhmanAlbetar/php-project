<?php

use App\Http\Middleware\RoleMiddleware;
use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        api: __DIR__ . '/../routes/api.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        
        // 1. تسجيل الميدل وير الخاص بالأدوار
        $middleware->alias([
            'role' => RoleMiddleware::class,
        ]);

        // 2. الحل الذهبي: تفعيل Sanctum Stateful لـ React
        // استخدمنا statefulApi() لأنها تعالج مشكلة تكرار الـ Headers في لارافيل 11 تلقائياً
        $middleware->statefulApi();

        // 3. استثناء مسارات الـ API من فحص CSRF
        $middleware->validateCsrfTokens(except: [
            'api/*',
        ]);

    })
    ->withExceptions(function (Exceptions $exceptions) {
        
        // توحيد استجابات الأخطاء لـ JSON في حال كان الطلب من الـ API
        
        // خطأ المصادقة (401)
        $exceptions->render(function (\Illuminate\Auth\AuthenticationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Unauthenticated'], 401);
            }
        });

        // خطأ الصلاحيات (403)
        $exceptions->render(function (\Illuminate\Auth\Access\AuthorizationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Forbidden. Insufficient permissions.'], 403);
            }
        });

        // خطأ التحقق من البيانات (422)
        $exceptions->render(function (\Illuminate\Validation\ValidationException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json([
                    'message' => 'The given data was invalid.',
                    'errors'  => $e->errors(),
                ], 422);
            }
        });

        // خطأ عدم وجود السجل في قاعدة البيانات (404)
        $exceptions->render(function (\Illuminate\Database\Eloquent\ModelNotFoundException $e, Request $request) {
            if ($request->is('api/*')) {
                return response()->json(['message' => 'Resource not found'], 404);
            }
        });

    })->create();