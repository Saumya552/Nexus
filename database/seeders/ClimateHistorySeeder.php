<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClimateHistory;
use Carbon\Carbon;

class ClimateHistorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        for ($i = 13; $i >= 0; $i--) {
            ClimateHistory::create([
                'region' => 'Global Avg',
                'co2_saved_tonnes' => 10200.00 + (13 - $i) * 160 + rand(0, 50),
                'temp_anomaly' => 1.0 + (13 - $i) * 0.04 + rand(0, 10) / 100.0,
                'aqi' => 95 - ($i % 3) * 4 + rand(-2, 2),
                'recorded_date' => Carbon::today()->subDays($i),
            ]);
        }
    }
}
