<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\ClimateData;
use App\Services\PredictionEngine;

class DashboardController extends Controller
{
    protected $predictionEngine;

    public function __construct(PredictionEngine $predictionEngine)
    {
        $this->predictionEngine = $predictionEngine;
    }

    /**
     * Get system-wide dashboard statistics
     */
    public function getSummary()
    {
        // 1. Core stats
        $userCount = User::where('status', 'active')->count();
        $solarCount = count($this->predictionEngine->getLocationProfiles());
        $windCount = count($this->predictionEngine->getLocationProfiles());
        
        $aqiAvg = round(ClimateData::where('region', '!=', 'Global Avg')->avg('aqi') ?: 90, 2);
        $co2Saved = round(ClimateData::where('region', '!=', 'Global Avg')->sum('co2_saved_tonnes') ?: 57400, 2);

        // 2. Generate chart series for solar and wind
        $solarPredictions = $this->predictionEngine->getAllSolarPredictions('Mumbai');
        $windPredictions = $this->predictionEngine->getAllWindPredictions('Mumbai');

        return response()->json([
            'stats' => [
                'user_count' => $userCount,
                'solar_count' => $solarCount,
                'wind_count' => $windCount,
                'aqi_avg' => $aqiAvg,
                'co2_saved' => $co2Saved,
            ],
            'solar' => array_slice($solarPredictions, 0, 7),
            'wind' => array_slice($windPredictions, 0, 7),
        ]);
    }
}
