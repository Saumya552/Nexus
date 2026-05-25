<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolarPrediction extends Model
{
    protected $table = 'solar_predictions';

    protected $fillable = [
        'location',
        'prediction_date',
        'predicted_radiation',
        'predicted_energy_kwh',
        'actual_energy_kwh',
        'panel_efficiency',
        'confidence',
    ];

    protected function casts(): array
    {
        return [
            'prediction_date' => 'date',
        ];
    }
}
