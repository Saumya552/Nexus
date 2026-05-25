<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClimateHistory extends Model
{
    protected $table = 'climate_history';

    protected $fillable = [
        'region',
        'co2_saved_tonnes',
        'temp_anomaly',
        'aqi',
        'recorded_date',
    ];

    protected function casts(): array
    {
        return [
            'recorded_date' => 'date',
        ];
    }
}
