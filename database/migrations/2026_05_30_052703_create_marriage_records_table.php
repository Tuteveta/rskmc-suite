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
        Schema::create('marriage_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('husband_member_id')->nullable()->constrained('members')->nullOnDelete();
            $table->foreignId('wife_member_id')->nullable()->constrained('members')->nullOnDelete();
            $table->string('husband_first_name');
            $table->string('husband_last_name');
            $table->string('wife_first_name');
            $table->string('wife_last_name');
            $table->date('date_of_marriage');
            $table->string('place_of_marriage')->nullable();
            $table->string('officiant');
            $table->string('witnesses')->nullable();
            $table->string('license_number')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('marriage_records');
    }
};
