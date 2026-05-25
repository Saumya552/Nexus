<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WeatherCache;

class WeatherCacheSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $caches = [
            ['city' => 'Mumbai',    'temperature' => 32.5, 'feels_like' => 38.0, 'humidity' => 78, 'pressure' => 1008, 'wind_speed' => 18.5, 'wind_direction' => 'SW', 'uv_index' => 7.2, 'cloud_pct' => 45, 'condition_text' => 'Partly Cloudy', 'rain_probability' => 35, 'solar_efficiency_pct' => 68],
            ['city' => 'Delhi',     'temperature' => 38.2, 'feels_like' => 42.0, 'humidity' => 35, 'pressure' => 1002, 'wind_speed' => 12.0, 'wind_direction' => 'NW', 'uv_index' => 9.1, 'cloud_pct' => 15, 'condition_text' => 'Sunny',          'rain_probability' => 5,  'solar_efficiency_pct' => 92],
            ['city' => 'Bangalore', 'temperature' => 26.8, 'feels_like' => 28.5, 'humidity' => 65, 'pressure' => 1015, 'wind_speed' => 14.0, 'wind_direction' => 'SE', 'uv_index' => 5.8, 'cloud_pct' => 55, 'condition_text' => 'Cloudy',         'rain_probability' => 20, 'solar_efficiency_pct' => 60],
            ['city' => 'Chennai',   'temperature' => 33.0, 'feels_like' => 40.0, 'humidity' => 82, 'pressure' => 1006, 'wind_speed' => 22.0, 'wind_direction' => 'NE', 'uv_index' => 6.5, 'cloud_pct' => 60, 'condition_text' => 'Humid & Cloudy',  'rain_probability' => 45, 'solar_efficiency_pct' => 55],
            ['city' => 'Jaipur',    'temperature' => 40.1, 'feels_like' => 44.5, 'humidity' => 20, 'pressure' => 998,  'wind_speed' => 8.5,  'wind_direction' => 'W',  'uv_index' => 10.0,'cloud_pct' => 5,  'condition_text' => 'Blazing Sun',    'rain_probability' => 2,  'solar_efficiency_pct' => 95],
        ];

        foreach ($caches as $c) {
            WeatherCache::create($c);
        }
    }
}
