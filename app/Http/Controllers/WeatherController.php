<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WeatherCache;
use App\Models\WeatherForecast;

class WeatherController extends Controller
{
    /**
     * Get active cache telemetry for a city
     */
    public function getCurrent(Request $request)
    {
        $city = $request->query('city', 'Mumbai');
        
        $cache = WeatherCache::where('city', $city)->first();
        
        if (!$cache) {
            return response()->json(['error' => 'Weather details not found for city: ' . $city], 404);
        }

        return response()->json($cache);
    }

    /**
     * Get 7-day forecast telemetry for a city
     */
    public function getForecast(Request $request)
    {
        $city = $request->query('city', 'Mumbai');

        $forecast = WeatherForecast::where('city', $city)
            ->orderBy('forecast_date', 'asc')
            ->limit(7)
            ->get();

        return response()->json($forecast);
    }
}
