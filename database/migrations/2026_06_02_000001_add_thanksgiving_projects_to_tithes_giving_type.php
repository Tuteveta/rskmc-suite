<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE tithes MODIFY COLUMN giving_type ENUM('tithe','offering','special','building_fund','mission','thanksgiving','projects') NOT NULL DEFAULT 'tithe'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE tithes MODIFY COLUMN giving_type ENUM('tithe','offering','special','building_fund','mission') NOT NULL DEFAULT 'tithe'");
        }
    }
};
