<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class FuneralRecord extends Model
{
    use Auditable;

    protected $fillable = [
        'member_id', 'first_name', 'last_name', 'date_of_birth',
        'date_of_death', 'date_of_funeral', 'place_of_burial',
        'officiant', 'cause_of_death', 'notes',
    ];

    protected function casts(): array
    {
        return [
            'date_of_birth'   => 'date',
            'date_of_death'   => 'date',
            'date_of_funeral' => 'date',
        ];
    }

    public function member() { return $this->belongsTo(Member::class); }

    public function getFullNameAttribute(): string
    {
        return "{$this->first_name} {$this->last_name}";
    }
}
