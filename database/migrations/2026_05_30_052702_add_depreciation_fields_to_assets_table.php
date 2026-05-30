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
        Schema::table('assets', function (Blueprint $table) {
            $table->enum('depreciation_method', ['straight_line', 'declining_balance', 'none'])->default('none')->after('acquisition_cost');
            $table->unsignedSmallInteger('useful_life_years')->nullable()->after('depreciation_method');
            $table->decimal('salvage_value', 12, 2)->nullable()->after('useful_life_years');
        });
    }

    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropColumn(['depreciation_method', 'useful_life_years', 'salvage_value']);
        });
    }
};
