<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WeatherForecast extends Model
{
    protected $table = 'weather_forecast';

    protected $fillable = [
        'city',
        'forecast_date',
        'temp_high',
        'temp_low',
        'condition_text',
        'rain_probability',
        'wind_speed',
        'solar_efficiency_pct',
    ];

    protected function casts(): array
    {
        return [
            'forecast_date' => 'date',
        ];
    }
}
