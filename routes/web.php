<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\PredictionController;
use App\Http\Controllers\ClimateController;
use App\Http\Controllers\WeatherController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\UserManagementController;

// 1. SPA VIEW ENTRY ROUTE
Route::get('/', function () {
    return view('index');
});

// 2. STATEFUL API ENDPOINTS (Grouped with Session cookies & CSRF verification)
Route::prefix('api')->middleware(['log.activity'])->group(function () {
    
    // Auth routes
    Route::post('auth/login', [AuthController::class, 'login']);
    Route::post('auth/logout', [AuthController::class, 'logout']);
    Route::get('auth/check', [AuthController::class, 'check']);
    Route::post('auth/register', [AuthController::class, 'register']);

    // Dashboard routes
    Route::get('dashboard/summary', [DashboardController::class, 'getSummary']);

    // Prediction routes
    Route::get('predictions/solar', [PredictionController::class, 'getSolar']);
    Route::get('predictions/wind', [PredictionController::class, 'getWind']);

    // Climate routes
    Route::get('climate/summary', [ClimateController::class, 'getSummary']);
    Route::get('climate/regions', [ClimateController::class, 'getRegions']);
    Route::get('climate/history', [ClimateController::class, 'getHistory']);

    // Weather routes
    Route::get('weather/current', [WeatherController::class, 'getCurrent']);
    Route::get('weather/forecast', [WeatherController::class, 'getForecast']);

    // Contact form route
    Route::post('contact/submit', [ContactController::class, 'submit']);

    // Admin routes
    Route::get('admin/messages', [AdminController::class, 'getMessages']);
    Route::post('admin/mark-read', [AdminController::class, 'markRead']);

    // User management CRUD
    Route::get('user-management/list', [UserManagementController::class, 'list']);
    Route::post('user-management/create', [UserManagementController::class, 'create']);
    Route::post('user-management/update', [UserManagementController::class, 'update']);
    Route::post('user-management/delete', [UserManagementController::class, 'delete']);
    Route::post('user-management/toggle', [UserManagementController::class, 'toggle']);
    Route::get('user-management/logs', [UserManagementController::class, 'getLogs']);
});
