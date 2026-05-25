<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ClimateData extends Model
{
    protected $table = 'climate_data';

    protected $fillable = [
        'region',
        'co2_saved_tonnes',
        'green_energy_pct',
        'aqi',
        'temp_anomaly',
        'sustainability_score',
    ];
}
