<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE members MODIFY COLUMN status ENUM('active','inactive','dedication','new_convert','follow_up') NOT NULL DEFAULT 'active'");
        }
    }

    public function down(): void
    {
        if (DB::getDriverName() === 'mysql') {
            DB::statement("ALTER TABLE members MODIFY COLUMN status ENUM('active','inactive') NOT NULL DEFAULT 'active'");
        }
    }
};
