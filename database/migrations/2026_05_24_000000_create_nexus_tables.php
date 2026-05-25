<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. ADMIN TABLE
        Schema::create('admin', function (Blueprint $table) {
            $table->id();
            $table->string('username', 50)->unique();
            $table->string('password');
            $table->string('email', 100);
            $table->timestamp('last_login')->nullable();
            $table->timestamps();
        });

        // 2. WEATHER DATA TABLE
        Schema::create('weather_data', function (Blueprint $table) {
            $table->id();
            $table->string('location', 100)->index();
            $table->decimal('temperature', 5, 2);
            $table->decimal('humidity', 5, 2);
            $table->decimal('wind_speed', 6, 2);
            $table->string('wind_direction', 10);
            $table->decimal('pressure', 7, 2);
            $table->decimal('cloud_cover', 5, 2);
            $table->decimal('uv_index', 4, 2);
            $table->timestamp('recorded_at')->nullable()->index();
            $table->timestamps();
        });

        // 3. SOLAR PREDICTIONS TABLE
        Schema::create('solar_predictions', function (Blueprint $table) {
            $table->id();
            $table->string('location', 100)->index();
            $table->date('prediction_date')->index();
            $table->decimal('predicted_radiation', 8, 2)->comment('W/m²');
            $table->decimal('predicted_energy_kwh', 10, 2);
            $table->decimal('actual_energy_kwh', 10, 2)->nullable();
            $table->decimal('panel_efficiency', 5, 2)->default(18.50);
            $table->decimal('confidence', 5, 2)->default(85.00);
            $table->timestamps();
        });

        // 4. WIND PREDICTIONS TABLE
        Schema::create('wind_predictions', function (Blueprint $table) {
            $table->id();
            $table->string('location', 100)->index();
            $table->date('prediction_date')->index();
            $table->decimal('predicted_wind_speed', 6, 2)->comment('m/s');
            $table->decimal('predicted_energy_kwh', 10, 2);
            $table->decimal('actual_energy_kwh', 10, 2)->nullable();
            $table->decimal('turbine_capacity', 8, 2)->default(2500.00)->comment('kW');
            $table->decimal('confidence', 5, 2)->default(82.00);
            $table->timestamps();
        });

        // 5. CONTACT MESSAGES TABLE
        Schema::create('contact_messages', function (Blueprint $table) {
            $table->id();
            $table->string('name', 100);
            $table->string('email', 100);
            $table->string('subject', 200)->nullable();
            $table->text('message');
            $table->boolean('is_read')->default(false);
            $table->timestamps();
        });

        // 6. CLIMATE DATA TABLE
        Schema::create('climate_data', function (Blueprint $table) {
            $table->id();
            $table->string('region', 100);
            $table->decimal('co2_saved_tonnes', 10, 2)->default(0);
            $table->decimal('green_energy_pct', 5, 2)->default(0);
            $table->integer('aqi')->default(50);
            $table->decimal('temp_anomaly', 4, 2)->default(0);
            $table->integer('sustainability_score')->default(0);
            $table->timestamps();
        });

        // 7. CLIMATE HISTORY TABLE
        Schema::create('climate_history', function (Blueprint $table) {
            $table->id();
            $table->string('region', 100);
            $table->decimal('co2_saved_tonnes', 10, 2);
            $table->decimal('temp_anomaly', 4, 2);
            $table->integer('aqi');
            $table->date('recorded_date');
            $table->timestamps();
        });

        // 8. WEATHER CACHE TABLE
        Schema::create('weather_cache', function (Blueprint $table) {
            $table->id();
            $table->string('city', 100)->unique();
            $table->decimal('temperature', 5, 2);
            $table->decimal('feels_like', 5, 2);
            $table->integer('humidity');
            $table->integer('pressure');
            $table->decimal('wind_speed', 5, 2);
            $table->string('wind_direction', 10)->default('N');
            $table->decimal('uv_index', 3, 1)->default(0);
            $table->integer('cloud_pct')->default(0);
            $table->string('condition_text', 100)->default('Clear');
            $table->integer('rain_probability')->default(0);
            $table->integer('solar_efficiency_pct')->default(80);
            $table->timestamps();
        });

        // 9. WEATHER FORECAST TABLE
        Schema::create('weather_forecast', function (Blueprint $table) {
            $table->id();
            $table->string('city', 100);
            $table->date('forecast_date');
            $table->decimal('temp_high', 5, 2);
            $table->decimal('temp_low', 5, 2);
            $table->string('condition_text', 100);
            $table->integer('rain_probability')->default(0);
            $table->decimal('wind_speed', 5, 2);
            $table->integer('solar_efficiency_pct')->default(80);
            $table->timestamps();
        });

        // 10. USER ACTIVITY LOG TABLE
        Schema::create('user_activity_log', function (Blueprint $table) {
            $table->id();
            $table->integer('user_id');
            $table->string('username', 50);
            $table->string('action', 100);
            $table->string('ip_address', 45)->nullable();
            $table->string('user_agent', 255)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('admin');
        Schema::dropIfExists('weather_data');
        Schema::dropIfExists('solar_predictions');
        Schema::dropIfExists('wind_predictions');
        Schema::dropIfExists('contact_messages');
        Schema::dropIfExists('climate_data');
        Schema::dropIfExists('climate_history');
        Schema::dropIfExists('weather_cache');
        Schema::dropIfExists('weather_forecast');
        Schema::dropIfExists('user_activity_log');
    }
};
