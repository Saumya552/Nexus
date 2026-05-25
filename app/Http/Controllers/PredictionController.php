<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\SolarPrediction;
use App\Models\WindPrediction;
use App\Services\PredictionEngine;

class PredictionController extends Controller
{
    protected $predictionEngine;

    public function __construct(PredictionEngine $predictionEngine)
    {
        $this->predictionEngine = $predictionEngine;
    }

    /**
     * Get Solar Energy Predictions
     */
    public function getSolar(Request $request)
    {
        $location = $request->query('location');
        $mode = $request->query('mode', 'realtime');

        if ($mode === 'historical') {
            $query = SolarPrediction::orderBy('prediction_date', 'desc');
            if (!empty($location)) {
                $query->where('location', $location);
            }
            $data = $query->limit(30)->get();
            return response()->json($data);
        }

        // Default: Real-time simulation
        $data = $this->predictionEngine->getAllSolarPredictions($location ?: null);
        
        // Sort chronologically by date
        usort($data, function($a, $b) {
            $cmp = strcmp($a['prediction_date'], $b['prediction_date']);
            return $cmp === 0 ? strcmp($a['location'], $b['location']) : $cmp;
        });

        return response()->json($data);
    }

    /**
     * Get Wind Energy Predictions
     */
    public function getWind(Request $request)
    {
        $location = $request->query('location');
        $mode = $request->query('mode', 'realtime');

        if ($mode === 'historical') {
            $query = WindPrediction::orderBy('prediction_date', 'desc');
            if (!empty($location)) {
                $query->where('location', $location);
            }
            $data = $query->limit(30)->get();
            return response()->json($data);
        }

        // Default: Real-time simulation
        $data = $this->predictionEngine->getAllWindPredictions($location ?: null);

        usort($data, function($a, $b) {
            $cmp = strcmp($a['prediction_date'], $b['prediction_date']);
            return $cmp === 0 ? strcmp($a['location'], $b['location']) : $cmp;
        });

        return response()->json($data);
    }
}
