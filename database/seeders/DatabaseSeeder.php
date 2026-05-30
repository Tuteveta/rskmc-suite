<?php

namespace Database\Seeders;

use App\Models\Asset;
use App\Models\BaptismRecord;
use App\Models\Member;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // ── Users ──────────────────────────────────────────────────────────
        $users = [
            ['name' => 'Pastor Sione Taufa',    'email' => 'pastor@rskmc.org',     'role' => 'pastoral_staff'],
            ['name' => 'Elder Malia Fifita',     'email' => 'council@rskmc.org',    'role' => 'council_member'],
            ['name' => 'Secretary Ana Tonga',    'email' => 'admin@rskmc.org',      'role' => 'administrator'],  // distinct from system admin
            ['name' => 'Data Entry Lupe Vaka',   'email' => 'entry@rskmc.org',      'role' => 'data_entry_officer'],
        ];
        foreach ($users as $u) {
            User::firstOrCreate(['email' => $u['email']], array_merge($u, [
                'password'          => Hash::make('Password@123'),
                'email_verified_at' => now(),
            ]));
        }

        // ── Members ────────────────────────────────────────────────────────
        $members = [
            ['first_name'=>'Sione',   'last_name'=>'Kami',      'gender'=>'male',   'dob'=>'1955-03-12', 'phone'=>'+675 71234567', 'status'=>'inactive', 'join_date'=>'1990-01-15'],
            ['first_name'=>'Malia',   'last_name'=>'Taufa',     'gender'=>'female', 'dob'=>'1978-07-22', 'phone'=>'+675 72345678', 'status'=>'active',   'join_date'=>'2005-06-10'],
            ['first_name'=>'Tevita',  'last_name'=>'Fifita',    'gender'=>'male',   'dob'=>'1982-11-05', 'phone'=>'+675 73456789', 'status'=>'active',   'join_date'=>'2008-03-20'],
            ['first_name'=>'Ana',     'last_name'=>'Tonga',     'gender'=>'female', 'dob'=>'1990-04-30', 'phone'=>'+675 74567890', 'status'=>'active',   'join_date'=>'2012-09-01'],
            ['first_name'=>'Peni',    'last_name'=>'Moala',     'gender'=>'male',   'dob'=>'1975-09-18', 'phone'=>'+675 75678901', 'status'=>'active',   'join_date'=>'2000-11-15'],
            ['first_name'=>'Lupe',    'last_name'=>'Vaka',      'gender'=>'female', 'dob'=>'1988-02-14', 'phone'=>'+675 76789012', 'status'=>'active',   'join_date'=>'2015-02-28'],
            ['first_name'=>'Filipo',  'last_name'=>'Nuku',      'gender'=>'male',   'dob'=>'1965-06-25', 'phone'=>'+675 77890123', 'status'=>'active',   'join_date'=>'1995-07-04'],
            ['first_name'=>'Seini',   'last_name'=>'Taufa',     'gender'=>'female', 'dob'=>'1993-12-08', 'phone'=>'+675 78901234', 'status'=>'active',   'join_date'=>'2018-01-10'],
            ['first_name'=>'Mosese',  'last_name'=>'Havili',    'gender'=>'male',   'dob'=>'1970-08-17', 'phone'=>'+675 79012345', 'status'=>'inactive', 'join_date'=>'1998-04-22'],
            ['first_name'=>'Salote',  'last_name'=>'Pohiva',    'gender'=>'female', 'dob'=>'1985-05-03', 'phone'=>'+675 70123456', 'status'=>'active',   'join_date'=>'2010-06-30'],
            ['first_name'=>'Taniela', 'last_name'=>'Ulakai',    'gender'=>'male',   'dob'=>'1998-01-20', 'phone'=>null,            'status'=>'active',   'join_date'=>'2020-03-15'],
            ['first_name'=>'Finau',   'last_name'=>'Tuilagi',   'gender'=>'female', 'dob'=>'2002-09-11', 'phone'=>null,            'status'=>'active',   'join_date'=>'2022-08-07'],
            ['first_name'=>'Aminiasi','last_name'=>'Koroivuya', 'gender'=>'male',   'dob'=>'1979-03-28', 'phone'=>'+675 71357924', 'status'=>'active',   'join_date'=>'2007-12-01'],
            ['first_name'=>'Sisilia', 'last_name'=>'Mafi',      'gender'=>'female', 'dob'=>'1969-11-14', 'phone'=>'+675 72468135', 'status'=>'active',   'join_date'=>'2003-05-18'],
            ['first_name'=>'Viliami', 'last_name'=>'Taufa',     'gender'=>'male',   'dob'=>'1994-07-07', 'phone'=>'+675 73579246', 'status'=>'active',   'join_date'=>'2019-11-25'],
            ['first_name'=>'Mele',    'last_name'=>'Latu',      'gender'=>'female', 'dob'=>'1961-04-16', 'phone'=>'+675 74680357', 'status'=>'inactive', 'join_date'=>'1993-09-08'],
            ['first_name'=>'Siosaia', 'last_name'=>'Fonoti',    'gender'=>'male',   'dob'=>'1987-10-02', 'phone'=>'+675 75791468', 'status'=>'active',   'join_date'=>'2014-04-14'],
            ['first_name'=>'Tupou',   'last_name'=>'Fainga',    'gender'=>'female', 'dob'=>'2000-06-19', 'phone'=>null,            'status'=>'active',   'join_date'=>'2021-06-01'],
            ['first_name'=>'Sekove',  'last_name'=>'Driti',     'gender'=>'male',   'dob'=>'1973-02-08', 'phone'=>'+675 76802579', 'status'=>'active',   'join_date'=>'2001-10-20'],
            ['first_name'=>'Losana',  'last_name'=>'Ratu',      'gender'=>'female', 'dob'=>'1996-08-30', 'phone'=>'+675 77913680', 'status'=>'active',   'join_date'=>'2017-07-12'],
        ];

        foreach ($members as $i => $m) {
            Member::firstOrCreate(['member_number' => 'M' . str_pad($i + 1, 5, '0', STR_PAD_LEFT)], [
                'member_number' => 'M' . str_pad($i + 1, 5, '0', STR_PAD_LEFT),
                'first_name'    => $m['first_name'],
                'last_name'     => $m['last_name'],
                'gender'        => $m['gender'],
                'date_of_birth' => $m['dob'],
                'phone'         => $m['phone'],
                'email'         => null,
                'address'       => 'Boroko, NCD, Papua New Guinea',
                'join_date'     => $m['join_date'],
                'status'        => $m['status'],
            ]);
        }

        // ── Assets ─────────────────────────────────────────────────────────
        $assets = [
            ['name'=>'Toyota HiAce Bus',       'category'=>'vehicle',           'brand'=>'Toyota',    'serial'=>'TH-2019-001', 'date'=>'2019-03-15', 'cost'=>85000,  'condition'=>'good',      'status'=>'active',      'location'=>'Church Garage'],
            ['name'=>'Isuzu Truck',             'category'=>'vehicle',           'brand'=>'Isuzu',     'serial'=>'IT-2015-002', 'date'=>'2015-07-20', 'cost'=>120000, 'condition'=>'fair',      'status'=>'maintenance', 'location'=>'Service Centre'],
            ['name'=>'Kawai Grand Piano',       'category'=>'musical_equipment', 'brand'=>'Kawai',     'serial'=>'KP-2020-001', 'date'=>'2020-01-10', 'cost'=>45000,  'condition'=>'excellent', 'status'=>'active',      'location'=>'Main Sanctuary'],
            ['name'=>'Yamaha Electronic Organ', 'category'=>'musical_equipment', 'brand'=>'Yamaha',    'serial'=>'YO-2017-002', 'date'=>'2017-06-05', 'cost'=>28000,  'condition'=>'good',      'status'=>'active',      'location'=>'Main Sanctuary'],
            ['name'=>'PA Sound System',         'category'=>'musical_equipment', 'brand'=>'JBL',       'serial'=>'JBL-2021-003','date'=>'2021-09-12', 'cost'=>15000,  'condition'=>'good',      'status'=>'active',      'location'=>'Main Sanctuary'],
            ['name'=>'Drum Kit',                'category'=>'musical_equipment', 'brand'=>'Pearl',     'serial'=>'PD-2018-004', 'date'=>'2018-11-28', 'cost'=>8500,   'condition'=>'good',      'status'=>'active',      'location'=>'Music Room'],
            ['name'=>'Church Main Building',    'category'=>'property',          'brand'=>null,        'serial'=>null,          'date'=>'1985-12-01', 'cost'=>500000, 'condition'=>'good',      'status'=>'active',      'location'=>'Boroko, NCD'],
            ['name'=>'Pastor\'s Residence',     'category'=>'property',          'brand'=>null,        'serial'=>null,          'date'=>'1990-06-15', 'cost'=>200000, 'condition'=>'good',      'status'=>'active',      'location'=>'Boroko, NCD'],
            ['name'=>'Church Hall',             'category'=>'property',          'brand'=>null,        'serial'=>null,          'date'=>'2001-03-20', 'cost'=>150000, 'condition'=>'excellent', 'status'=>'active',      'location'=>'Boroko, NCD'],
            ['name'=>'Projector & Screen',      'category'=>'electronics',       'brand'=>'Epson',     'serial'=>'EP-2022-001', 'date'=>'2022-02-14', 'cost'=>4500,   'condition'=>'excellent', 'status'=>'active',      'location'=>'Main Sanctuary'],
            ['name'=>'LED Lighting Rig',        'category'=>'electronics',       'brand'=>'Philips',   'serial'=>'PH-2021-002', 'date'=>'2021-04-30', 'cost'=>6000,   'condition'=>'good',      'status'=>'active',      'location'=>'Main Sanctuary'],
            ['name'=>'Church Pews (Set of 40)', 'category'=>'furniture',         'brand'=>null,        'serial'=>null,          'date'=>'1995-08-10', 'cost'=>12000,  'condition'=>'fair',      'status'=>'active',      'location'=>'Main Sanctuary'],
        ];

        foreach ($assets as $a) {
            Asset::firstOrCreate(['name' => $a['name']], [
                'name'             => $a['name'],
                'category'         => $a['category'],
                'brand'            => $a['brand'],
                'serial_number'    => $a['serial'],
                'acquisition_date' => $a['date'],
                'acquisition_cost' => $a['cost'],
                'condition'        => $a['condition'],
                'status'           => $a['status'],
                'location'         => $a['location'],
            ]);
        }

        // ── Baptism Records ────────────────────────────────────────────────
        $baptisms = [
            ['first'=>'Sione',    'last'=>'Kami',      'dob'=>'1955-03-12', 'bap'=>'1955-04-20', 'place'=>'Nuku\'alofa, Tonga',       'officiant'=>'Rev. Taufa Fifita',    'father'=>'Kami Taufa',     'mother'=>'Mele Kami'],
            ['first'=>'Malia',    'last'=>'Taufa',     'dob'=>'1978-07-22', 'bap'=>'1978-08-15', 'place'=>'Suva, Fiji',               'officiant'=>'Rev. Sione Kami',      'father'=>'Taufa Moala',    'mother'=>'Ana Taufa'],
            ['first'=>'Tevita',   'last'=>'Fifita',    'dob'=>'1982-11-05', 'bap'=>'1982-12-19', 'place'=>'RSKMC Church, Boroko',     'officiant'=>'Rev. Sione Kami',      'father'=>'Fifita Havili',  'mother'=>'Lupe Fifita'],
            ['first'=>'Ana',      'last'=>'Tonga',     'dob'=>'1990-04-30', 'bap'=>'1990-06-03', 'place'=>'RSKMC Church, Boroko',     'officiant'=>'Rev. Sione Kami',      'father'=>'Tonga Ulakai',   'mother'=>'Salote Tonga'],
            ['first'=>'Peni',     'last'=>'Moala',     'dob'=>'1975-09-18', 'bap'=>'1975-10-26', 'place'=>'Port Moresby, PNG',        'officiant'=>'Rev. Filipo Nuku',     'father'=>'Moala Pohiva',   'mother'=>'Seini Moala'],
            ['first'=>'Lupe',     'last'=>'Vaka',      'dob'=>'1988-02-14', 'bap'=>'1988-03-27', 'place'=>'RSKMC Church, Boroko',     'officiant'=>'Rev. Sione Kami',      'father'=>'Vaka Tuilagi',   'mother'=>'Finau Vaka'],
            ['first'=>'Seini',    'last'=>'Taufa',     'dob'=>'1993-12-08', 'bap'=>'1994-01-15', 'place'=>'RSKMC Church, Boroko',     'officiant'=>'Rev. Sione Kami',      'father'=>'Taufa Fonoti',   'mother'=>'Malia Taufa'],
            ['first'=>'Taniela',  'last'=>'Ulakai',    'dob'=>'1998-01-20', 'bap'=>'1998-02-22', 'place'=>'RSKMC Church, Boroko',     'officiant'=>'Pastor Sione Taufa',   'father'=>'Ulakai Driti',   'mother'=>'Losana Ulakai'],
            ['first'=>'Finau',    'last'=>'Tuilagi',   'dob'=>'2002-09-11', 'bap'=>'2002-10-20', 'place'=>'RSKMC Church, Boroko',     'officiant'=>'Pastor Sione Taufa',   'father'=>'Tuilagi Ratu',   'mother'=>'Tupou Tuilagi'],
            ['first'=>'Viliami',  'last'=>'Taufa',     'dob'=>'1994-07-07', 'bap'=>'1994-08-14', 'place'=>'RSKMC Church, Boroko',     'officiant'=>'Rev. Sione Kami',      'father'=>'Taufa Koroivuya','mother'=>'Sisilia Taufa'],
            ['first'=>'Grace',    'last'=>'Fifita',    'dob'=>'2015-05-10', 'bap'=>'2015-06-21', 'place'=>'RSKMC Church, Boroko',     'officiant'=>'Pastor Sione Taufa',   'father'=>'Tevita Fifita',  'mother'=>'Sela Fifita'],
            ['first'=>'Joshua',   'last'=>'Moala',     'dob'=>'2018-11-03', 'bap'=>'2018-12-09', 'place'=>'RSKMC Church, Boroko',     'officiant'=>'Pastor Sione Taufa',   'father'=>'Peni Moala',     'mother'=>'Mere Moala'],
        ];

        $memberIds = Member::pluck('id')->toArray();

        foreach ($baptisms as $i => $b) {
            BaptismRecord::firstOrCreate(
                ['first_name' => $b['first'], 'last_name' => $b['last'], 'date_of_baptism' => $b['bap']],
                [
                    'member_id'        => $memberIds[$i] ?? null,
                    'first_name'       => $b['first'],
                    'last_name'        => $b['last'],
                    'date_of_birth'    => $b['dob'],
                    'date_of_baptism'  => $b['bap'],
                    'place_of_baptism' => $b['place'],
                    'officiant'        => $b['officiant'],
                    'father_name'      => $b['father'],
                    'mother_name'      => $b['mother'],
                ]
            );
        }
    }
}
