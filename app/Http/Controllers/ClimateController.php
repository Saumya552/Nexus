<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ClimateData;
use App\Models\ClimateHistory;

class ClimateController extends Controller
{
    public function getSummary()
    {
        $regions = ClimateData::where('region', '!=', 'Global Avg')->get();
        
        return response()->json([
            'totals' => [
                'total_co2_saved' => $regions->sum('co2_saved_tonnes'),
                'avg_green_energy' => round($regions->avg('green_energy_pct'), 1),
                'avg_aqi' => round($regions->avg('aqi')),
                'avg_sustainability' => round($regions->avg('sustainability_score')),
            ]
        ]);
    }

    /**
     * Get distinct climate regions list
     */
    public function getRegions()
    {
        $data = ClimateData::where('region', '!=', 'Global Avg')->get();
        return response()->json($data);
    }

    /**
     * Get historical climate metrics timeline for a region
     */
    public function getHistory(Request $request)
    {
        $region = $request->query('region', 'Global Avg');
        
        $history = ClimateHistory::where('region', $region)
            ->orderBy('recorded_date', 'asc')
            ->limit(14)
            ->get();

        return response()->json($history);
    }
}
