<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
{
    use Auditable;
    protected $fillable = [
        'member_number', 'first_name', 'last_name', 'gender',
        'date_of_birth', 'phone', 'email', 'address',
        'join_date', 'status', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth' => 'date',
            'join_date'     => 'date',
        ];
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }

    public function baptismRecords()
    {
        return $this->hasMany(BaptismRecord::class);
    }
}
