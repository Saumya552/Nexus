<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherCache extends Model
{
    protected $table = 'weather_cache';

    protected $fillable = [
        'city',
        'temperature',
        'feels_like',
        'humidity',
        'pressure',
        'wind_speed',
        'wind_direction',
        'uv_index',
        'cloud_pct',
        'condition_text',
        'rain_probability',
        'solar_efficiency_pct',
    ];
}
