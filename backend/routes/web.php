<?php

use Illuminate\Support\Facades\Route;

Route::get('/', fn() => response()->json(['message' => 'Handyman Platform API', 'version' => '1.0']));
