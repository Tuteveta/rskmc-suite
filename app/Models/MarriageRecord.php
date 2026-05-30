<?php

namespace App\Models;

use App\Traits\Auditable;
use Illuminate\Database\Eloquent\Model;

class MarriageRecord extends Model
{
    use Auditable;

    protected $fillable = [
        'husband_member_id', 'wife_member_id',
        'husband_first_name', 'husband_last_name',
        'wife_first_name', 'wife_last_name',
        'date_of_marriage', 'place_of_marriage', 'officiant',
        'witnesses', 'license_number', 'notes',
    ];

    protected function casts(): array
    {
        return ['date_of_marriage' => 'date'];
    }

    public function husband() { return $this->belongsTo(Member::class, 'husband_member_id'); }
    public function wife()    { return $this->belongsTo(Member::class, 'wife_member_id'); }

    public function getCoupleLabelAttribute(): string
    {
        return "{$this->husband_first_name} {$this->husband_last_name} & {$this->wife_first_name} {$this->wife_last_name}";
    }

    public function auditLabel(): string { return $this->couple_label; }
}
