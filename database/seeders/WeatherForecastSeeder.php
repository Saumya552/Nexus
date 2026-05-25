<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WeatherForecast;
use Carbon\Carbon;

class WeatherForecastSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $forecasts = [
            'Mumbai' => [
                ['high' => 33, 'low' => 27, 'text' => 'Partly Cloudy', 'rain' => 35, 'wind' => 18, 'solar' => 68],
                ['high' => 31, 'low' => 26, 'text' => 'Rain Showers',  'rain' => 75, 'wind' => 25, 'solar' => 35],
                ['high' => 29, 'low' => 25, 'text' => 'Heavy Rain',    'rain' => 90, 'wind' => 30, 'solar' => 20],
                ['high' => 30, 'low' => 26, 'text' => 'Overcast',      'rain' => 55, 'wind' => 20, 'solar' => 45],
                ['high' => 32, 'low' => 27, 'text' => 'Partly Cloudy', 'rain' => 30, 'wind' => 16, 'solar' => 65],
                ['high' => 33, 'low' => 27, 'text' => 'Sunny',          'rain' => 8,  'wind' => 14, 'solar' => 88],
                ['high' => 34, 'low' => 28, 'text' => 'Sunny',          'rain' => 5,  'wind' => 12, 'solar' => 92],
            ],
            'Delhi' => [
                ['high' => 38, 'low' => 28, 'text' => 'Sunny',           'rain' => 5,  'wind' => 12, 'solar' => 92],
                ['high' => 39, 'low' => 29, 'text' => 'Sunny',           'rain' => 3,  'wind' => 10, 'solar' => 95],
                ['high' => 40, 'low' => 30, 'text' => 'Hot & Sunny',     'rain' => 2,  'wind' => 8,  'solar' => 96],
                ['high' => 38, 'low' => 29, 'text' => 'Hazy',           'rain' => 10, 'wind' => 15, 'solar' => 80],
                ['high' => 36, 'low' => 27, 'text' => 'Partly Cloudy',  'rain' => 20, 'wind' => 18, 'solar' => 72],
                ['high' => 37, 'low' => 28, 'text' => 'Sunny',           'rain' => 8,  'wind' => 12, 'solar' => 90],
                ['high' => 38, 'low' => 29, 'text' => 'Sunny',           'rain' => 4,  'wind' => 10, 'solar' => 93],
            ],
            'Bangalore' => [
                ['high' => 27, 'low' => 20, 'text' => 'Cloudy',        'rain' => 20, 'wind' => 14, 'solar' => 60],
                ['high' => 25, 'low' => 18, 'text' => 'Light Rain',    'rain' => 60, 'wind' => 20, 'solar' => 40],
                ['high' => 23, 'low' => 17, 'text' => 'Rain',          'rain' => 80, 'wind' => 25, 'solar' => 28],
                ['high' => 26, 'low' => 19, 'text' => 'Partly Cloudy',  'rain' => 35, 'wind' => 16, 'solar' => 58],
                ['high' => 28, 'low' => 21, 'text' => 'Sunny',         'rain' => 10, 'wind' => 12, 'solar' => 85],
                ['high' => 27, 'low' => 20, 'text' => 'Partly Cloudy',  'rain' => 25, 'wind' => 14, 'solar' => 68],
                ['high' => 26, 'low' => 19, 'text' => 'Cloudy',        'rain' => 40, 'wind' => 18, 'solar' => 50],
            ],
            'Chennai' => [
                ['high' => 33, 'low' => 29, 'text' => 'Humid & Cloudy', 'rain' => 45, 'wind' => 22, 'solar' => 55],
                ['high' => 31, 'low' => 28, 'text' => 'Rain Showers',   'rain' => 70, 'wind' => 28, 'solar' => 30],
                ['high' => 30, 'low' => 27, 'text' => 'Heavy Rain',     'rain' => 85, 'wind' => 35, 'solar' => 18],
                ['high' => 32, 'low' => 28, 'text' => 'Cloudy',         'rain' => 50, 'wind' => 24, 'solar' => 45],
                ['high' => 33, 'low' => 29, 'text' => 'Partly Cloudy',  'rain' => 30, 'wind' => 20, 'solar' => 62],
                ['high' => 34, 'low' => 30, 'text' => 'Sunny',          'rain' => 10, 'wind' => 18, 'solar' => 82],
                ['high' => 34, 'low' => 30, 'text' => 'Sunny',          'rain' => 8,  'wind' => 16, 'solar' => 85],
            ],
            'Jaipur' => [
                ['high' => 40, 'low' => 30, 'text' => 'Blazing Sun',   'rain' => 2,  'wind' => 8,  'solar' => 95],
                ['high' => 41, 'low' => 31, 'text' => 'Sunny',         'rain' => 1,  'wind' => 7,  'solar' => 97],
                ['high' => 42, 'low' => 32, 'text' => 'Hot & Sunny',   'rain' => 1,  'wind' => 6,  'solar' => 98],
                ['high' => 40, 'low' => 30, 'text' => 'Sunny',         'rain' => 3,  'wind' => 9,  'solar' => 95],
                ['high' => 39, 'low' => 29, 'text' => 'Partly Cloudy', 'rain' => 10, 'wind' => 12, 'solar' => 85],
                ['high' => 41, 'low' => 31, 'text' => 'Sunny',          'rain' => 2,  'wind' => 8,  'solar' => 96],
                ['high' => 40, 'low' => 30, 'text' => 'Sunny',          'rain' => 3,  'wind' => 9,  'solar' => 94],
            ]
        ];

        foreach ($forecasts as $city => $days) {
            foreach ($days as $index => $day) {
                WeatherForecast::create([
                    'city' => $city,
                    'forecast_date' => Carbon::today()->addDays($index),
                    'temp_high' => $day['high'],
                    'temp_low' => $day['low'],
                    'condition_text' => $day['text'],
                    'rain_probability' => $day['rain'],
                    'wind_speed' => $day['wind'],
                    'solar_efficiency_pct' => $day['solar'],
                ]);
            }
        }
    }
}
