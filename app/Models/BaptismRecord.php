<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class BaptismRecord extends Model
{
    use Auditable;
    protected $fillable = [
        'member_id', 'first_name', 'last_name', 'date_of_birth',
        'date_of_baptism', 'baptism_type', 'place_of_baptism', 'officiant',
        'father_name', 'mother_name', 'witnesses', 'notes',
    ];

    public static function baptismTypes(): array
    {
        return [
            'infant'    => 'Infant Baptism',
            'immersion' => 'Immersion',
        ];
    }

    protected function casts(): array
    {
        return [
            'date_of_birth'    => 'date',
            'date_of_baptism'  => 'date',
        ];
    }

    public function member()
    {
        return $this->belongsTo(Member::class);
    }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
