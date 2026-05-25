<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ClimateData;

class ClimateDataSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            ['region' => 'Mumbai',      'co2_saved_tonnes' => 12400.50, 'green_energy_pct' => 67.3, 'aqi' => 82,  'temp_anomaly' => 1.2, 'sustainability_score' => 74],
            ['region' => 'Delhi',       'co2_saved_tonnes' => 8200.00,  'green_energy_pct' => 45.1, 'aqi' => 154, 'temp_anomaly' => 1.8, 'sustainability_score' => 52],
            ['region' => 'Bangalore',   'co2_saved_tonnes' => 15800.75, 'green_energy_pct' => 78.9, 'aqi' => 48,  'temp_anomaly' => 0.9, 'sustainability_score' => 88],
            ['region' => 'Chennai',     'co2_saved_tonnes' => 11200.30, 'green_energy_pct' => 61.4, 'aqi' => 71,  'temp_anomaly' => 1.4, 'sustainability_score' => 70],
            ['region' => 'Jaipur',      'co2_saved_tonnes' => 9800.60,  'green_energy_pct' => 55.7, 'aqi' => 95,  'temp_anomaly' => 1.6, 'sustainability_score' => 63],
            ['region' => 'Global Avg',  'co2_saved_tonnes' => 11480.43, 'green_energy_pct' => 61.7, 'aqi' => 90,  'temp_anomaly' => 1.4, 'sustainability_score' => 69],
        ];

        foreach ($data as $d) {
            ClimateData::create($d);
        }
    }
}
