<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('baptism_records', function (Blueprint $table) {
            $table->string('baptism_type')->default('infant')->after('date_of_baptism');
        });
    }

    public function down(): void
    {
        Schema::table('baptism_records', function (Blueprint $table) {
            $table->dropColumn('baptism_type');
        });
    }
};
