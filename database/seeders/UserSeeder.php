<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $users = [
            ['username' => 'john_doe', 'email' => 'john@example.com', 'role' => 'user'],
            ['username' => 'jane_smith', 'email' => 'jane@example.com', 'role' => 'user'],
            ['username' => 'alex_green', 'email' => 'alex@example.com', 'role' => 'user'],
            ['username' => 'sarah_wind', 'email' => 'sarah@example.com', 'role' => 'admin'],
            ['username' => 'mike_solar', 'email' => 'mike@example.com', 'role' => 'user'],
        ];

        $pass = Hash::make('password123');

        foreach ($users as $u) {
            User::create([
                'username' => $u['username'],
                'email' => $u['email'],
                'password' => $pass,
                'role' => $u['role'],
                'status' => 'active',
                'avatar_initials' => strtoupper(substr($u['username'], 0, 2)),
            ]);
        }
    }
}
