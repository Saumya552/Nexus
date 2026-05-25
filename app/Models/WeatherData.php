<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherData extends Model
{
    protected $table = 'weather_data';

    protected $fillable = [
        'location',
        'temperature',
        'humidity',
        'wind_speed',
        'wind_direction',
        'pressure',
        'cloud_cover',
        'uv_index',
        'recorded_at',
    ];

    protected function casts(): array
    {
        return [
            'recorded_at' => 'datetime',
        ];
    }
}
