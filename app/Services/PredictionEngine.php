<?php

namespace App\Services;

use Carbon\Carbon;

class PredictionEngine
{
    // Location profiles: latitude, base solar irradiance (W/m²), base wind speed (m/s),
    //                    panel capacity (kW), turbine capacity (kW)
    protected $LOCATION_PROFILES = [
        'Mumbai' => [
            'lat' => 19.07, 'base_radiation' => 850, 'base_wind' => 12.5,
            'panel_kw' => 500, 'turbine_kw' => 2500, 'timezone' => 'Asia/Kolkata'
        ],
        'Delhi' => [
            'lat' => 28.61, 'base_radiation' => 950, 'base_wind' => 8.8,
            'panel_kw' => 550, 'turbine_kw' => 2000, 'timezone' => 'Asia/Kolkata'
        ],
        'Bangalore' => [
            'lat' => 12.97, 'base_radiation' => 750, 'base_wind' => 6.5,
            'panel_kw' => 450, 'turbine_kw' => 1500, 'timezone' => 'Asia/Kolkata'
        ],
        'Chennai' => [
            'lat' => 13.08, 'base_radiation' => 900, 'base_wind' => 15.5,
            'panel_kw' => 500, 'turbine_kw' => 3000, 'timezone' => 'Asia/Kolkata'
        ],
        'Jaipur' => [
            'lat' => 26.91, 'base_radiation' => 1050, 'base_wind' => 9.5,
            'panel_kw' => 600, 'turbine_kw' => 2500, 'timezone' => 'Asia/Kolkata'
        ]
    ];

    /**
     * Compute a seeded deterministic "random" value for reproducible results
     */
    public function seededRandom($seed) {
        $x = sin($seed * 12.9898 + 78.233) * 43758.5453;
        return $x - floor($x);
    }

    /**
     * Seasonal multiplier based on solar declination angle
     */
    public function solarSeasonalFactor($dayOfYear) {
        return 0.85 + 0.3 * sin(2 * M_PI * ($dayOfYear - 80) / 365);
    }

    /**
     * Wind seasonal factor — monsoon/winter patterns for India
     */
    public function windSeasonalFactor($dayOfYear) {
        return 0.8 + 0.4 * sin(2 * M_PI * ($dayOfYear - 60) / 365);
    }

    /**
     * Generate 7-day solar predictions for a location
     */
    public function generateSolarPredictions($locName, $profile) {
        $predictions = [];
        $today = Carbon::now()->setTimezone($profile['timezone']);

        for ($d = 0; $d < 7; $d++) {
            $date = $today->copy()->addDays($d);
            $dateStr = $date->format('Y-m-d');
            $dayOfYear = $date->dayOfYear - 1; // 0-indexed day of year matching PHP "z"

            // Seed based on location + date for deterministic results
            $seed = crc32($locName . $dateStr) / 2147483647;

            // Seasonal factor
            $seasonFactor = $this->solarSeasonalFactor($dayOfYear);

            // Cloud cover variation (0.6 to 1.0)
            $cloudFactor = 0.65 + $this->seededRandom($seed * 1.1) * 0.35;

            // Predicted radiation
            $radiation = round($profile['base_radiation'] * $seasonFactor * $cloudFactor, 2);

            // Panel efficiency varies 16-21%
            $efficiency = round(16 + $this->seededRandom($seed * 2.2) * 5, 2);

            // Predicted energy (radiation * panel area factor * efficiency)
            $predictedKwh = round($radiation * ($efficiency / 100) * ($profile['panel_kw'] / 100), 2);

            // Actual only for today (with small deviation from predicted)
            $actualKwh = null;
            if ($d == 0) {
                $deviation = 0.92 + $this->seededRandom($seed * 3.3) * 0.12; // 92-104% of predicted
                $actualKwh = round($predictedKwh * $deviation, 2);
            }

            // Confidence: higher for nearer days
            $confidence = round(max(65, 95 - $d * 4.5 + $this->seededRandom($seed * 4.4) * 3), 2);

            $predictions[] = [
                'id' => $d + 1,
                'location' => $locName,
                'prediction_date' => $dateStr,
                'predicted_radiation' => $radiation,
                'predicted_energy_kwh' => $predictedKwh,
                'actual_energy_kwh' => $actualKwh,
                'panel_efficiency' => $efficiency,
                'confidence' => $confidence,
                'created_at' => $today->toDateTimeString(),
                'is_realtime' => true
            ];
        }
        return $predictions;
    }

    /**
     * Generate 7-day wind predictions for a location
     */
    public function generateWindPredictions($locName, $profile) {
        $predictions = [];
        $today = Carbon::now()->setTimezone($profile['timezone']);

        for ($d = 0; $d < 7; $d++) {
            $date = $today->copy()->addDays($d);
            $dateStr = $date->format('Y-m-d');
            $dayOfYear = $date->dayOfYear - 1;

            $seed = crc32($locName . $dateStr . 'wind') / 2147483647;

            $seasonFactor = $this->windSeasonalFactor($dayOfYear);
            $gustFactor = 0.7 + $this->seededRandom($seed * 1.5) * 0.5;

            // Predicted wind speed
            $windSpeed = round($profile['base_wind'] * $seasonFactor * $gustFactor, 2);

            // Energy from wind: P ∝ v³ (cubic law), scaled to turbine capacity
            $capacityFactor = min(1.0, pow($windSpeed / 15, 3) * 0.45);
            $predictedKwh = round($profile['turbine_kw'] * $capacityFactor * 24 * 0.3, 2);

            // Actual only for today
            $actualKwh = null;
            if ($d == 0) {
                $deviation = 0.93 + $this->seededRandom($seed * 2.8) * 0.10;
                $actualKwh = round($predictedKwh * $deviation, 2);
            }

            $confidence = round(max(62, 93 - $d * 5 + $this->seededRandom($seed * 3.7) * 4), 2);

            $predictions[] = [
                'id' => $d + 1,
                'location' => $locName,
                'prediction_date' => $dateStr,
                'predicted_wind_speed' => $windSpeed,
                'predicted_energy_kwh' => $predictedKwh,
                'actual_energy_kwh' => $actualKwh,
                'turbine_capacity' => $profile['turbine_kw'],
                'confidence' => $confidence,
                'created_at' => $today->toDateTimeString(),
                'is_realtime' => true
            ];
        }
        return $predictions;
    }

    /**
     * Get all solar predictions (all locations or filtered)
     */
    public function getAllSolarPredictions($location = null) {
        $all = [];
        foreach ($this->LOCATION_PROFILES as $name => $profile) {
            if ($location && strcasecmp($location, $name) !== 0) continue;
            $all = array_merge($all, $this->generateSolarPredictions($name, $profile));
        }
        return $all;
    }

    /**
     * Get all wind predictions (all locations or filtered)
     */
    public function getAllWindPredictions($location = null) {
        $all = [];
        foreach ($this->LOCATION_PROFILES as $name => $profile) {
            if ($location && strcasecmp($location, $name) !== 0) continue;
            $all = array_merge($all, $this->generateWindPredictions($name, $profile));
        }
        return $all;
    }

    /**
     * Get Location profiles list
     */
    public function getLocationProfiles() {
        return $this->LOCATION_PROFILES;
    }
}
