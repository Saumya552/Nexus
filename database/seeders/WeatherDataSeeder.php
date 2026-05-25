<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\WeatherData;
use Carbon\Carbon;

class WeatherDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Jaipur'];
        $windDirections = ['SW', 'NE', 'E', 'SE', 'NW', 'W', 'N', 'S'];

        foreach ($locations as $loc) {
            for ($i = 6; $i >= 0; $i--) {
                WeatherData::create([
                    'location' => $loc,
                    'temperature' => 25.0 + ($i % 3) * 4.5 + rand(0, 20) / 10.0,
                    'humidity' => 45.0 + ($i % 2) * 20.0 + rand(0, 10),
                    'wind_speed' => 5.0 + ($i % 4) * 3.5 + rand(0, 30) / 10.0,
                    'wind_direction' => $windDirections[rand(0, 7)],
                    'pressure' => 1005.0 + rand(0, 100) / 10.0,
                    'cloud_cover' => ($i % 3) * 25.0 + rand(0, 15),
                    'uv_index' => 5.0 + ($i % 2) * 2.5 + rand(0, 10) / 10.0,
                    'recorded_at' => Carbon::now()->subDays($i),
                ]);
            }
        }
    }
}
