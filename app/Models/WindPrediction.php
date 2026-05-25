<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WindPrediction extends Model
{
    protected $table = 'wind_predictions';

    protected $fillable = [
        'location',
        'prediction_date',
        'predicted_wind_speed',
        'predicted_energy_kwh',
        'actual_energy_kwh',
        'turbine_capacity',
        'confidence',
    ];

    protected function casts(): array
    {
        return [
            'prediction_date' => 'date',
        ];
    }
}
