<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['name' => 'Pastor Sione Taufa',  'email' => 'pastor@rskmc.org',  'role' => 'pastoral_staff'],
            ['name' => 'Elder Malia Fifita',   'email' => 'council@rskmc.org', 'role' => 'council_member'],
            ['name' => 'Secretary Ana Tonga',  'email' => 'admin@rskmc.org',   'role' => 'administrator'],
            ['name' => 'Data Entry Lupe Vaka', 'email' => 'entry@rskmc.org',   'role' => 'data_entry_officer'],
        ];

        foreach ($users as $u) {
            User::firstOrCreate(['email' => $u['email']], array_merge($u, [
                'password'          => Hash::make('Password@123'),
                'email_verified_at' => now(),
            ]));
        }
    }
}
